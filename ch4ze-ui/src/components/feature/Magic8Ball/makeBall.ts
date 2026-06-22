const RAMP = ' .,:;~-=+*oa#%@';
const R = 12;
const COLS = 23;
const W = COLS * 2 + 1;
const H = R * 2 + 1;

export function makeBall(angle: number): string {
  let lx = Math.cos(angle) * 0.72, ly = Math.sin(angle) * 0.72, lz = 0.62;
  const ll = Math.sqrt(lx * lx + ly * ly + lz * lz);
  lx /= ll; ly /= ll; lz /= ll;
  let out = '';
  for (let yi = 0; yi < H; yi++) {
    const y = yi - R, ny = y / R;
    let line = '';
    for (let xi = 0; xi < W; xi++) {
      const x = xi - COLS, nx = x / COLS, d = nx * nx + ny * ny;
      if (d > 1.0) { line += ' '; continue; }
      const nz = Math.sqrt(Math.max(0, 1 - d));
      const b = Math.max(0, nx * lx + ny * ly + nz * lz);
      let v = 0.16 + 0.84 * b;
      v = Math.min(1, v * 0.72 + Math.pow(b, 7));
      if (d > 0.86) v *= 0.55;
      const idx = Math.max(0, Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1))));
      line += RAMP.charAt(idx);
    }
    out += line + (yi < H - 1 ? '\n' : '');
  }
  return out;
}
