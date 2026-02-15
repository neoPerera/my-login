// Runtime config injected from public/env.js
// WARNING: files under `public/` are served publicly. Do NOT store private secrets
// (API private keys, DB credentials, etc.) in `public/env.js` — anyone can read them.

declare global {
  interface Window {
    env?: {
      REACT_APP_API_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

export {};
