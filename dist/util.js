"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}
exports.isDefined = isDefined;
function coerceBooleanProperty(value) {
    return value != null && `${value}` !== 'false';
}
exports.coerceBooleanProperty = coerceBooleanProperty;
function dateParser(date) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.valueOf())) {
        return parsed;
    }
    const parts = String(date).match(/\d+/g);
    if (parts === null || parts.length <= 2) {
        return parsed;
    }
    else {
        const [firstP, secondP, ...restPs] = parts.map(x => parseInt(x, 10));
        return new Date(Date.UTC(firstP, secondP - 1, ...restPs));
    }
}
exports.dateParser = dateParser;
exports.MINUTE = 60;
exports.HOUR = exports.MINUTE * 60;
exports.DAY = exports.HOUR * 24;
exports.WEEK = exports.DAY * 7;
exports.MONTH = exports.DAY * 30;
exports.YEAR = exports.DAY * 365;
//# sourceMappingURL=util.js.map