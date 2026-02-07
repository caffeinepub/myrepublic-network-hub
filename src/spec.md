# Specification

## Summary
**Goal:** Restore product visibility and make the Admin dashboard reliably accessible after Internet Identity login, while ensuring direct URL navigation loads the correct page.

**Planned changes:**
- Fix authenticated actor initialization so login and subsequent role/product queries work even when the `caffeineAdminToken` URL parameter is missing or empty, and ensure backend initialization does not trap when an empty secret is provided.
- Sync internal page state with the browser URL so direct navigation to `/admin`, `/dashboard`, `/network`, `/join`, `/calculator`, and `/about` loads the intended page; in-app navigation updates the URL and Back/Forward works.
- Prevent non-admin users from triggering product bootstrapping on Home; show an English empty-state when no products exist with a Retry that only refetches.
- Make Admin entry behavior explicit: show the Admin tab reliably for admins, and show an English access-denied state for non-admins when accessing Admin (no blank screens), with English loading/guard text.

**User-visible outcome:** Users can log in via Internet Identity and see products (or a clear empty-state) without silent failures; opening `/admin` and other routes directly loads the correct page, and Admin access is clearly shown for admins and clearly denied for non-admins.
