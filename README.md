Just do yarn watch - Webpack will recompile by itself, you just haev to refresh from browser manually (from extensions page)

three parts here -
index.tsx - extension ka popup
(called foregorund now) content-script - anything inside page, in foreground
background - background script, service worker, always running

alerts - content-script foreground
tabs manipulation - background script
