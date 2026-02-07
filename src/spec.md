# Specification

## Summary
**Goal:** Enable the ICP HTTP gateway to serve the frontend from the apex (root) custom domain by allowlisting `myrepubicnetwork.web.id`, and document the exact redeploy + gateway registration steps for both apex and `www`.

**Planned changes:**
- Add a static `ic-domains` allowlist file under the standard IC well-known public assets location containing newline-separated domains: `myrepubicnetwork.web.id` and `www.myrepubicnetwork.web.id`, and ensure it is included in the built frontend canister assets.
- Update `frontend/docs/custom-domain.md` with post-deploy instructions to: add domains to `ic-domains`, redeploy the frontend canister, and register both apex and `www` via separate `curl -X POST ... /registrations` commands.
- Add a documentation verification step to check registration status via `https://icp0.io/registrations/<id>`.

**User-visible outcome:** The deployed frontend canister can be served via both `myrepubicnetwork.web.id` and `www.myrepubicnetwork.web.id` once the documented redeploy and gateway registration steps are completed.
