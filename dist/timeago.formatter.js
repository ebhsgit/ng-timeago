"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var timeago_intl_1 = require("./timeago.intl");
var util_1 = require("./util");
var defaultFormattter = function (then) {
    var now = Date.now();
    var seconds = Math.round(Math.abs(now - then) / 1000);
    var suffix = then < now ? 'ago' : 'from now';
    var _a = seconds < util_1.MINUTE
        ? [Math.round(seconds), 'second']
        : seconds < util_1.HOUR
            ? [Math.round(seconds / util_1.MINUTE), 'minute']
            : seconds < util_1.DAY
                ? [Math.round(seconds / util_1.HOUR), 'hour']
                : seconds < util_1.WEEK
                    ? [Math.round(seconds / util_1.DAY), 'day']
                    : seconds < util_1.MONTH
                        ? [Math.round(seconds / util_1.WEEK), 'week']
                        : seconds < util_1.YEAR
                            ? [Math.round(seconds / util_1.MONTH), 'month']
                            : [Math.round(seconds / util_1.YEAR), 'year'], value = _a[0], unit = _a[1];
    return { value: value, unit: unit, suffix: suffix };
};
var ɵ0 = defaultFormattter;
exports.ɵ0 = ɵ0;
var TimeagoFormatter = /** @class */ (function () {
    function TimeagoFormatter() {
    }
    return TimeagoFormatter;
}());
exports.TimeagoFormatter = TimeagoFormatter;
var TimeagoDefaultFormatter = /** @class */ (function (_super) {
    __extends(TimeagoDefaultFormatter, _super);
    function TimeagoDefaultFormatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeagoDefaultFormatter.prototype.format = function (then) {
        var _a = defaultFormattter(then), suffix = _a.suffix, value = _a.value, unit = _a.unit;
        return this.parse(value, unit, suffix);
    };
    TimeagoDefaultFormatter.prototype.parse = function (value, unit, suffix) {
        if (value !== 1) {
            unit += 's';
        }
        return value + ' ' + unit + ' ' + suffix;
    };
    TimeagoDefaultFormatter.decorators = [
        { type: core_1.Injectable },
    ];
    return TimeagoDefaultFormatter;
}(TimeagoFormatter));
exports.TimeagoDefaultFormatter = TimeagoDefaultFormatter;
var TimeagoCustomFormatter = /** @class */ (function (_super) {
    __extends(TimeagoCustomFormatter, _super);
    function TimeagoCustomFormatter(intl) {
        var _this = _super.call(this) || this;
        _this.intl = intl;
        return _this;
    }
    TimeagoCustomFormatter.prototype.format = function (then) {
        var _a = defaultFormattter(then), suffix = _a.suffix, value = _a.value, unit = _a.unit;
        return this.parse(value, unit, suffix, Date.now(), then);
    };
    TimeagoCustomFormatter.prototype.parse = function (value, unit, suffix, now, then) {
        /** convert weeks to days if strings don't handle weeks */
        if (unit === 'week' && !this.intl.strings.week && !this.intl.strings.weeks) {
            var days = Math.round(Math.abs(now - then) / (1000 * 60 * 60 * 24));
            value = days;
            unit = 'day';
        }
        /** create a normalize function for given value */
        var normalize = this.normalizeFn(value, now - then, this.intl.strings.numbers);
        /** The eventual return value stored in an array so that the wordSeparator can be used */
        var dateString = [];
        /** handle prefixes */
        if (suffix === 'ago' && this.intl.strings.prefixAgo) {
            dateString.push(normalize(this.intl.strings.prefixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.prefixFromNow) {
            dateString.push(normalize(this.intl.strings.prefixFromNow));
        }
        /** Handle Main number and unit */
        var isPlural = value > 1;
        if (isPlural) {
            var stringFn = this.intl.strings[unit + 's'] || this.intl.strings[unit] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        else {
            var stringFn = this.intl.strings[unit] || this.intl.strings[unit + 's'] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        /** Handle Suffixes */
        if (suffix === 'ago' && this.intl.strings.suffixAgo) {
            dateString.push(normalize(this.intl.strings.suffixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.suffixFromNow) {
            dateString.push(normalize(this.intl.strings.suffixFromNow));
        }
        /** join the array into a string and return it */
        var wordSeparator = typeof this.intl.strings.wordSeparator === 'string' ? this.intl.strings.wordSeparator : ' ';
        return dateString.join(wordSeparator);
    };
    /**
     * If the numbers array is present, format numbers with it,
     * otherwise just cast the number to a string and return it
    */
    /**
       * If the numbers array is present, format numbers with it,
       * otherwise just cast the number to a string and return it
      */
    TimeagoCustomFormatter.prototype.normalizeNumber = /**
       * If the numbers array is present, format numbers with it,
       * otherwise just cast the number to a string and return it
      */
    function (numbers, value) {
        return numbers && numbers.length === 10
            ? String(value).split('')
                .map(function (digit) { return digit.match(/^[0-9]$/) ? numbers[parseInt(digit, 10)] : digit; })
                .join('')
            : String(value);
    };
    /**
     * Take a string or a function that takes number of days and returns a string
     * and provide a uniform API to create string parts
    */
    /**
       * Take a string or a function that takes number of days and returns a string
       * and provide a uniform API to create string parts
      */
    TimeagoCustomFormatter.prototype.normalizeFn = /**
       * Take a string or a function that takes number of days and returns a string
       * and provide a uniform API to create string parts
      */
    function (value, millisDelta, numbers) {
        var _this = this;
        return function (stringOrFn) {
            return typeof stringOrFn === 'function'
                ? stringOrFn(value, millisDelta).replace(/%d/g, _this.normalizeNumber(numbers, value))
                : stringOrFn.replace(/%d/g, _this.normalizeNumber(numbers, value));
        };
    };
    TimeagoCustomFormatter.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    TimeagoCustomFormatter.ctorParameters = function () { return [
        { type: timeago_intl_1.TimeagoIntl, },
    ]; };
    return TimeagoCustomFormatter;
}(TimeagoFormatter));
exports.TimeagoCustomFormatter = TimeagoCustomFormatter;
//# sourceMappingURL=timeago.formatter.js.map