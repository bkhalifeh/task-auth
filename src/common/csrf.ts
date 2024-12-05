import { csrfSync } from "csrf-sync";

export const { generateToken, csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.body["csrfToken"];
  },
});
