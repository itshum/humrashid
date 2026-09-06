# rendr — future scope ideas

Not started. Ideas to revisit later, not built now.

## Use DialKit 2.0 for settings UI

Josh Puckett released DialKit 2.0. rendr's scrub controls (Padding,
Radius, Shadow, etc.) were originally modeled on DialKit's pill-shaped
draggable/scrubbable chip pattern — worth updating the UI once 2.0 is
out to match whatever's new in it.

## Background removal on upload

When a user uploads an asset, offer a "remove background" option that
outputs a transparent image before compositing it onto the chosen
background. Would need either a client-side segmentation model (e.g.
something canvas/WASM-based) or a server-side API call — no decision
made yet on which approach fits rendr's otherwise fully
client-side/no-backend architecture.
