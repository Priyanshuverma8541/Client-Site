// Public API endpoint and tenant slug are deployment configuration, not credentials.
window.MAA_CONFIG = { apiBase: location.hostname === "localhost" ? "http://localhost:8081" : "", storeSlug: "maa-vindhwshani-jewellery" };
