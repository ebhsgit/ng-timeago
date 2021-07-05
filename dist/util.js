"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}
exports.isDefined = isDefined;
function coerceBooleanProperty(value) {
    return value != null && "" + value !== 'false';
}
exports.coerceBooleanProperty = coerceBooleanProperty;
function dateParser(date) {
    var parsed = new Date(date);
    if (!Number.isNaN(parsed.valueOf())) {
        return parsed;
    }
    var parts = String(date).match(/\d+/g);
    if (parts === null || parts.length <= 2) {
        return parsed;
    }
    else {
        var _a = parts.map(function (x) { return parseInt(x, 10); }), firstP = _a[0], secondP = _a[1], restPs = _a.slice(2);
        return new Date(Date.UTC.apply(Date, [firstP, secondP - 1].concat(restPs)));
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