import * as React from 'react';
import { DisconnectOverlay } from '@chasecrawford/ch4ze-ui';

// DisconnectOverlay is a full-screen position:fixed overlay. In the preview
// card's containment wrapper a bare fixed element has no height to center
// within, so its content collapses to the top. Wrapping it in a sized,
// transformed box makes that box the containing block for the fixed overlay
// (transform establishes one) and gives it a real height to fill — so the
// "CONNECTION TERMINATED" title, message, and RECONNECT button render centered,
// matching the storybook reference and the live site.
export const Open = () => (
  <div style={{ position: 'relative', height: 700, overflow: 'hidden', transform: 'translateZ(0)' }}>
    <DisconnectOverlay open onReconnect={() => {}} />
  </div>
);
