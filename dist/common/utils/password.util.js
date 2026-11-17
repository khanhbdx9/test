"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ROUNDS = 10;
function hashPassword(password) {
    return bcrypt_1.default.hash(password, ROUNDS);
}
function verifyPassword(password, passwordHash) {
    return bcrypt_1.default.compare(password, passwordHash);
}
//# sourceMappingURL=password.util.js.map