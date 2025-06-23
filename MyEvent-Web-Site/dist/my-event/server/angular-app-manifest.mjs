
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/events"
  },
  {
    "renderMode": 0,
    "route": "/events/*"
  },
  {
    "renderMode": 2,
    "route": "/create-event"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/register"
  },
  {
    "renderMode": 2,
    "route": "/favourites"
  },
  {
    "renderMode": 0,
    "route": "/categories/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5214, hash: '10aebc9d886c9e2d5a21db8ca4de80f446b49b80486bbb897fd297993f19860a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1186, hash: 'e5489706381d88702028a567d71e3dea1b46e3d39f8ded8f149d02ef8a05b93a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'login/index.html': {size: 24114, hash: '2904c531454eaa981861ef2af966bd3094d8b87c930aa30ec7431db37f808637', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'create-event/index.html': {size: 24114, hash: '2904c531454eaa981861ef2af966bd3094d8b87c930aa30ec7431db37f808637', text: () => import('./assets-chunks/create-event_index_html.mjs').then(m => m.default)},
    'register/index.html': {size: 24245, hash: 'a38348f529343211f3706f01185ccc9a4e1236f4d30c44b8bfb2cc3faf08b007', text: () => import('./assets-chunks/register_index_html.mjs').then(m => m.default)},
    'favourites/index.html': {size: 24114, hash: '2904c531454eaa981861ef2af966bd3094d8b87c930aa30ec7431db37f808637', text: () => import('./assets-chunks/favourites_index_html.mjs').then(m => m.default)},
    'index.html': {size: 26805, hash: 'e83600a840292a9325752fc796593c9f382a1371b4a35c1139db98edbc9185ad', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'events/index.html': {size: 31845, hash: '3e3c8a3d2d58300dd6cf8d229a9727d8a9b69c2e9f7119a9b1b23a91c565b352', text: () => import('./assets-chunks/events_index_html.mjs').then(m => m.default)},
    'styles-BVJQD57C.css': {size: 230873, hash: 'YU+im7r2LDs', text: () => import('./assets-chunks/styles-BVJQD57C_css.mjs').then(m => m.default)}
  },
};
