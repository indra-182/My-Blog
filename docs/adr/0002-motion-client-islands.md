# Keep Motion inside focused client islands

Decision Atlas keeps page composition, content discovery, SEO, and MDX in
Server Components, and loads the `motion` package once through a
`MotionConfig reducedMotion="user"` and `LazyMotion` boundary.
Only interactions that need browser state—featured-route path drawing, filter
layout feedback, article progress, menu/theme controls, disclosure feedback,
and back-to-top—become client islands; this preserves the reading surface's
server-first output and makes reduced-motion behavior explicit without taking
on route-transition or scroll-lock complexity.
