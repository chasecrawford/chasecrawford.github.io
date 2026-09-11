// <matrix-map> — vector US map (d3) zooms crisply to Louisville, then crossfades to detailed street tiles (Leaflet).
// Requires d3, topojson, L globals (loaded in the page's helmet).
(function () {
  const LOU_LL = [38.2527, -85.7655];
  const LOU = [-85.7655, 38.2527];
  class MatrixMap extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      // Only self-position if nothing else has. The page's stylesheet sets
      // `position:absolute;inset:0` so the element fills its frame; an
      // unconditional inline `relative` here would outrank that and collapse
      // the map to zero height.
      if (getComputedStyle(this).position === 'static') this.style.position = 'relative';
      const deadline = Date.now() + 5000;
      const wait = () => {
        if (window.d3 && window.topojson && window.L) return this.build();
        if (Date.now() > deadline) return this.fail();
        setTimeout(wait, 60);
      };
      wait();
    }
    fail() {
      window.__mapState = 'failed';
      const panel = this.closest('.hero-right');
      if (panel) panel.hidden = true;
    }
    async build() {
      // Detail layer: Leaflet already parked on Louisville, hidden until the trace completes
      const mapEl = document.createElement('div');
      // The backdrop is WHITE on purpose, not the page's near-black. It sits *inside* the
      // filter chain below, which starts with invert(1) -- so white renders as black, while
      // a dark value here would render as near-white and then get pushed to neon green by
      // the sepia/hue-rotate/saturate. That matters because Leaflet's tile rows meet on a
      // sub-pixel boundary: whatever is behind them bleeds through as a hairline. With a
      // dark backdrop that hairline was a bright green line across the map; with white it
      // disappears into the map's own dark areas. Same reason un-loaded tile area stays dark
      // instead of flashing green. Do not "fix" this back to #020803.
      mapEl.style.cssText = 'position:absolute;inset:0;background:#fff;filter:invert(1) sepia(1) hue-rotate(65deg) saturate(3.2) brightness(0.85) contrast(1.15);opacity:0;transition:opacity 1.2s ease';
      this.appendChild(mapEl);
      const map = L.map(mapEl, {
        center: LOU_LL, zoom: 12, zoomControl: false, attributionControl: false,
        dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, touchZoom: false, fadeAnimation: false
      });
      // Esri's terms require visible attribution, but Leaflet's own attribution
      // control renders inside mapEl -- under the invert/hue-rotate filter above,
      // and occluded by the .map-label gradient. A static, unfiltered credit in
      // the label (below) satisfies the terms; the control is not used.
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map);
      new ResizeObserver(() => map.invalidateSize({ animate: false })).observe(mapEl);
      setTimeout(() => map.invalidateSize({ animate: false }), 400);

      // Trace layer: crisp vector states + counties
      const w = 760, h = 560;
      const svgWrap = document.createElement('div');
      svgWrap.style.cssText = 'position:absolute;inset:0;background:#020803;transition:opacity 1.2s ease';
      this.appendChild(svgWrap);
      let topo;
      try {
        topo = await fetch('vendor/counties-10m.json').then(r => r.json());
      } catch (e) {
        return this.fail();
      }
      const states = topojson.feature(topo, topo.objects.states);
      const countyMesh = topojson.mesh(topo, topo.objects.counties, (a, b) => a !== b && ((a.id / 1000) | 0) === ((b.id / 1000) | 0));
      const proj = d3.geoAlbersUsa().fitExtent([[20, 20], [w - 20, h - 20]], states);
      const path = d3.geoPath(proj);
      const [lx, ly] = proj(LOU);
      const [ex, ey] = proj([LOU[0] + 0.5, LOU[1]]);
      const tilt = Math.atan2(ey - ly, ex - lx) * 180 / Math.PI;
      const svg = d3.create('svg')
        .attr('viewBox', `0 0 ${w} ${h}`)
        .style('width', '100%').style('height', '100%').style('display', 'block');
      const g = svg.append('g');
      const counties = g.append('path')
        .attr('d', path(countyMesh))
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,255,65,0.35)')
        .attr('stroke-width', 0.5)
        .attr('vector-effect', 'non-scaling-stroke')
        .attr('opacity', 0);
      g.selectAll('path.st').data(states.features).join('path').attr('class', 'st')
        .attr('d', path)
        .attr('fill', 'rgba(0,255,65,0.045)')
        .attr('stroke', 'rgba(0,255,65,0.55)')
        .attr('stroke-width', 1)
        .attr('vector-effect', 'non-scaling-stroke');
      svgWrap.appendChild(svg.node());

      const label = document.createElement('div');
      label.className = 'map-label';
      const status = document.createElement('span');
      status.className = 'map-label-status';
      status.textContent = 'ACQUIRING SIGNAL...';
      const credit = document.createElement('span');
      credit.className = 'map-label-credit';
      credit.textContent = 'Leaflet | Tiles © Esri';
      label.appendChild(status);
      label.appendChild(credit);
      this.appendChild(label);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        svgWrap.style.opacity = '0';
        mapEl.style.opacity = '1';
        status.textContent = 'SIGNAL LOCKED > LOUISVILLE, KY · 38.2527°N 85.7585°W';
        window.__mapState = 'locked';
        return;
      }

      const zoomTo = () => {
        // Match the vector end-scale to the Leaflet layer's zoom so the crossfade is seamless
        const [ax, ay] = proj(LOU);
        const [bx, by] = proj([LOU[0] + 0.01, LOU[1]]);
        const unitsPerDeg = Math.hypot(bx - ax, by - ay) / 0.01;
        const mPerUnit = 111320 * Math.cos(LOU[1] * Math.PI / 180) / unitsPerDeg;
        const leafletZoom = map.getZoom();
        const mPerCssPx = 40075016.686 * Math.cos(LOU[1] * Math.PI / 180) / (256 * Math.pow(2, leafletZoom));
        const elW = svgWrap.getBoundingClientRect().width || 760;
        const k = mPerUnit * (760 / elW) / mPerCssPx;
        const i = d3.interpolateZoom([w / 2, h / 2, w], [lx, ly, w / k]);
        g.transition().duration(11000).ease(d3.easeCubicInOut)
          .attrTween('transform', () => t => {
            const v = i(t);
            const kk = w / v[2];
            counties.attr('opacity', Math.max(0, Math.min(1, (kk - 2.5) / 3)));
            return `translate(${w / 2 - v[0] * kk},${h / 2 - v[1] * kk}) scale(${kk}) rotate(${-tilt * t},${lx},${ly})`;
          })
          .on('end', () => {
            svgWrap.style.opacity = '0';
            mapEl.style.opacity = '1';
            status.textContent = 'SIGNAL LOCKED > LOUISVILLE, KY · 38.2527°N 85.7585°W';
            window.__mapState = 'locked';
          });
      };
      const reset = () => {
        g.interrupt().attr('transform', null);
        counties.attr('opacity', 0);
        svgWrap.style.opacity = '1';
        mapEl.style.opacity = '0';
        status.textContent = 'ACQUIRING SIGNAL...';
        window.__mapState = 'acquiring';
        setTimeout(zoomTo, 900);
      };
      window.__mapState = 'acquiring';
      setTimeout(zoomTo, 900);
      this.style.cursor = 'pointer';
      this.title = 'replay';
      this.addEventListener('click', reset);
    }
  }
  if (!customElements.get('matrix-map')) customElements.define('matrix-map', MatrixMap);
})();
