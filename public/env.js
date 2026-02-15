/**
 * Runtime environment for the app, injected at page load.
 * WARNING: This file is served publicly; DO NOT place private secrets here
 * (API private keys, DB credentials, etc.). Use server-side env or secret stores
 * for private values. Only include public runtime configuration.
 */
// This script is loaded by the app at runtime via a <script src="/env.js"></script>
window.env = window.env || {};
// Default API URL (override per-deployment by editing this file)
window.env.REACT_APP_API_URL = window.env.REACT_APP_API_URL || "http://localhost:5208/";

// Example public value (safe for public exposure):
// window.env.MY_PUBLIC_FLAG = "true";

