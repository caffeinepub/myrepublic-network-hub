# Specification

## Summary
**Goal:** Remove all custom-domain configuration/behavior and use the default Caffeine URL (`https://myrepublic-tuk.caffeine.xyz`) as the only canonical URL.

**Planned changes:**
- Update `frontend/index.html` to remove any pre-load canonical redirect script that forces `myrepubicnetwork.web.id`.
- Update `frontend/index.html` to set the canonical link (`<link rel="canonical">`) and Open Graph `og:url` to `https://myrepublic-tuk.caffeine.xyz`.
- Remove the IC custom domain allowlist by deleting `frontend/public/.well-known/ic-domains` (or ensuring it no longer lists `myrepubicnetwork.web.id` / `www.myrepubicnetwork.web.id`).
- Remove custom-domain documentation by deleting `frontend/docs/custom-domain.md` or replacing it with a brief note that only the default Caffeine URL is used.

**User-visible outcome:** The app can be opened on the default Caffeine URL or any gateway hostname without redirecting to `myrepubicnetwork.web.id`, and sharing/SEO metadata points to `https://myrepublic-tuk.caffeine.xyz`.
