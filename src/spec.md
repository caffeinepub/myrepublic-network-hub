# Specification

## Summary
**Goal:** Fix the intermittent “Package could not be loaded” issue in the WhatsApp subscription flow by ensuring the correct backend product id is used and improving the form’s loading/error/retry behavior.

**Planned changes:**
- Update the Home page → “Subscribe via WhatsApp” flow so the selected package maps to a real backend `Product.id` and pass that id into `PreWhatsAppContactForm` (not the UI list index).
- Add an explicit loading state in `PreWhatsAppContactForm` while the product lookup is in-flight, and prevent submission until product data is successfully loaded and validated.
- When product fetching fails or returns null, show a user-visible error with a retry button that triggers a refetch (no need to close/reopen the modal).
- Configure product retrieval (via `useGetProduct` and/or the caller) with a defined, bounded retry policy and ensure errors are surfaced in the modal UI (not only in the console).

**User-visible outcome:** Opening the WhatsApp subscription form from any package reliably loads the correct package details (name/price), shows a clear loading state, provides an in-modal retry on failure, and only allows submission once a valid product is loaded.
