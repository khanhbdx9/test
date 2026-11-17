"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = createRefreshToken;
exports.hashRefreshToken = hashRefreshToken;
const crypto_1 = require("crypto");
function createRefreshToken() {
    return (0, crypto_1.randomBytes)(48).toString('base64url');
}
function hashRefreshToken(token, secret) {
    return (0, crypto_1.createHash)('sha256').update(`${secret}:${token}`).digest('hex');
}
//# sourceMappingURL=refresh-token.util.js.map