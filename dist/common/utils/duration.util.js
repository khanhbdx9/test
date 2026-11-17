"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDurationMs = parseDurationMs;
const DURATION_UNITS = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
};
function parseDurationMs(value) {
    const match = /^(\d+)(s|m|h|d)$/.exec(value);
    const amount = match?.[1];
    const unit = match?.[2];
    if (!amount || (unit !== 's' && unit !== 'm' && unit !== 'h' && unit !== 'd')) {
        throw new Error('Định dạng thời hạn không hợp lệ');
    }
    return Number(amount) * DURATION_UNITS[unit];
}
//# sourceMappingURL=duration.util.js.map