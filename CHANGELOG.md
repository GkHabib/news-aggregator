# Changelog

## 1.0.0 (2026-10-11)

### Features

* add "Your feed" preference sections ([7e47864](https://github.com/GkHabib/news-aggregator/commit/7e478649d1c455ca226982fa63d9134b6ce49ca7))
* add app layout, pages and routing ([4ccfaba](https://github.com/GkHabib/news-aggregator/commit/4ccfabaf1b2692642fa522836bb464315b51edbf))
* add article card, follow menu and feed states ([8c35969](https://github.com/GkHabib/news-aggregator/commit/8c35969c6c9e1363d0092d8fdca260326973a0df))
* add Autocomplete component ([200a4aa](https://github.com/GkHabib/news-aggregator/commit/200a4aab0201f7603e8ed69c8fa00fef155bbd51))
* add back to feed link on Your feed ([ec7d483](https://github.com/GkHabib/news-aggregator/commit/ec7d483bfd5e12ecc42732d9fd70ceb8f58025b3))
* add design tokens and global styles ([a42f1c6](https://github.com/GkHabib/news-aggregator/commit/a42f1c659c5931e0f52c7f63cb6cb991859a0f57))
* add feed filter model ([ddd7d5f](https://github.com/GkHabib/news-aggregator/commit/ddd7d5f0658def42bf71f8bede8e5fd9f27d8cd0))
* add filter panel, active filter chips and empty states ([f80c935](https://github.com/GkHabib/news-aggregator/commit/f80c935071e9707e384ae8c1fcbf1472ef89bfbe))
* add generic UI components ([8cad645](https://github.com/GkHabib/news-aggregator/commit/8cad645d2b7b50b1f0ad343576ae874bd718f187))
* add in-memory feed preferences ([6ea3526](https://github.com/GkHabib/news-aggregator/commit/6ea35260ec8026cbd97c0bfa2ec3ac4b8c6bdf4d))
* add source labels and coverage rules ([6ab3617](https://github.com/GkHabib/news-aggregator/commit/6ab36175f1b57f7e58c4ba212029eeefba7ddc4b))
* add UI domain types and formatting utilities ([4e0bbcb](https://github.com/GkHabib/news-aggregator/commit/4e0bbcb3780afe3f55702f7a4f54ff5423b5c82c))
* capture a mock snapshot from the live APIs ([937a287](https://github.com/GkHabib/news-aggregator/commit/937a2878d2e0d1833471db63ecd62e2fbfa6b5db))
* implement first draft of data layer + mock services + simple caching + proper typing on FE side + normalization ([301fbbf](https://github.com/GkHabib/news-aggregator/commit/301fbbfdcd6fe422b0c0a8fe6959973133258fb8))
* keep feed filters in the URL ([5bc7cb0](https://github.com/GkHabib/news-aggregator/commit/5bc7cb0aa75bbdc0b96050cf42eac02b58ab79f4))
* load more stories on scroll ([e299c55](https://github.com/GkHabib/news-aggregator/commit/e299c556628951300b5cbe7e0cec734760422ddc))
* persist preferences and dismissed notices ([856b3e9](https://github.com/GkHabib/news-aggregator/commit/856b3e977e2ea5b452c5aff9d77e4e1438fee96c))
* replace Vite favicon with the app's own icon ([3849709](https://github.com/GkHabib/news-aggregator/commit/3849709cb6bc831da518e084bee02420e0108ac3))
* serve the captured snapshot in dev mock mode ([527b41f](https://github.com/GkHabib/news-aggregator/commit/527b41fa9e4cd9b73e00ff02ab10b8da9abcd394))
* suggest writers when adding authors ([fd72fd6](https://github.com/GkHabib/news-aggregator/commit/fd72fd6db5644f4a5683bb806304fedca1d2d9e1))

### Bug Fixes

* add .env.example, update README.md ([5562a0d](https://github.com/GkHabib/news-aggregator/commit/5562a0d40c4bfe19d6d2f81aeb91be741c78bf50))
* add DOM.Iterable lib for TypeScript 5 editors ([7027743](https://github.com/GkHabib/news-aggregator/commit/702774379210aac96e0ff490e1049004b169f7d5))
* always revalidate the app's HTML ([23fd26f](https://github.com/GkHabib/news-aggregator/commit/23fd26fe9de7e71207e7ea3cbe7fd72c184a83e7))
* clean author names parsed from bylines ([c12c5f1](https://github.com/GkHabib/news-aggregator/commit/c12c5f17e473ce49ca50c30959f6a53af872292d))
* give the header title link a 44px touch target ([d7de5cc](https://github.com/GkHabib/news-aggregator/commit/d7de5ccdcfeb49759aca99d87a29ad1b2944ade4))
* keep loading when filters leave the first pages empty ([40cf72f](https://github.com/GkHabib/news-aggregator/commit/40cf72f763e3b274d99bab8a277a294f9f6e3175))
* keep mock timestamps stable across reloads ([b6bb786](https://github.com/GkHabib/news-aggregator/commit/b6bb786a2df1bc6ed87302618c3609e3bc74b2ca))
* make Undo restore removed filters ([b137c56](https://github.com/GkHabib/news-aggregator/commit/b137c567d0fa524e876cb76d8816c41300f3671a))
* rate-limit the API proxy ([e70c1f6](https://github.com/GkHabib/news-aggregator/commit/e70c1f6d7336c512340adbd5ee28ec205148fe86))
* update filtering UI and UX in mobile view, make it always available ([1c633f3](https://github.com/GkHabib/news-aggregator/commit/1c633f36f76ac286f75d9bcfa71840acf46c94b5))

### Refactoring

* extract route table and app providers ([9b53385](https://github.com/GkHabib/news-aggregator/commit/9b53385c0c210a46ccaee5fbff90686d49176856))

### Documentation

* document state, infinite feed and testing ([fb897d6](https://github.com/GkHabib/news-aggregator/commit/fb897d6b9e8d08e31321a11ca6f96468e1b3edd0))
* document UI architecture in README ([85e9bdf](https://github.com/GkHabib/news-aggregator/commit/85e9bdf8268fa6bfde2ced51bed62d3c322090c4))
* explain switching from mock to live data ([1c26951](https://github.com/GkHabib/news-aggregator/commit/1c26951d431fdf7e37720d4663c59f1d83d1b969))
* rewrite README for setup, structure and design ([4751a7b](https://github.com/GkHabib/news-aggregator/commit/4751a7b579e1886eb59e7a411a616568a5c7f207))

### Tests

* add integration and component tests ([5e932e9](https://github.com/GkHabib/news-aggregator/commit/5e932e9b58c03021e0127ad8f5f7238b0d15fd98))
