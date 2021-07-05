"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const timeago_intl_1 = require("./timeago.intl");
const util_1 = require("./util");
const defaultFormattter = function (then) {
    const now = Date.now();
    const seconds = Math.round(Math.abs(now - then) / 1000);
    const suffix = then < now ? 'ago' : 'from now';
    const [value, unit] = seconds < util_1.MINUTE
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
                            : [Math.round(seconds / util_1.YEAR), 'year'];
    return { value, unit, suffix };
};
const ɵ0 = defaultFormattter;
exports.ɵ0 = ɵ0;
class TimeagoFormatter {
}
exports.TimeagoFormatter = TimeagoFormatter;
class TimeagoDefaultFormatter extends TimeagoFormatter {
    format(then) {
        const { suffix, value, unit } = defaultFormattter(then);
        return this.parse(value, unit, suffix);
    }
    parse(value, unit, suffix) {
        if (value !== 1) {
            unit += 's';
        }
        return value + ' ' + unit + ' ' + suffix;
    }
}
TimeagoDefaultFormatter.decorators = [
    { type: core_1.Injectable },
];
exports.TimeagoDefaultFormatter = TimeagoDefaultFormatter;
class TimeagoCustomFormatter extends TimeagoFormatter {
    constructor(intl) {
        super();
        this.intl = intl;
    }
    format(then) {
        const { suffix, value, unit } = defaultFormattter(then);
        return this.parse(value, unit, suffix, Date.now(), then);
    }
    parse(value, unit, suffix, now, then) {
        /** convert weeks to days if strings don't handle weeks */
        if (unit === 'week' && !this.intl.strings.week && !this.intl.strings.weeks) {
            const days = Math.round(Math.abs(now - then) / (1000 * 60 * 60 * 24));
            value = days;
            unit = 'day';
        }
        /** create a normalize function for given value */
        const normalize = this.normalizeFn(value, now - then, this.intl.strings.numbers);
        /** The eventual return value stored in an array so that the wordSeparator can be used */
        const dateString = [];
        /** handle prefixes */
        if (suffix === 'ago' && this.intl.strings.prefixAgo) {
            dateString.push(normalize(this.intl.strings.prefixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.prefixFromNow) {
            dateString.push(normalize(this.intl.strings.prefixFromNow));
        }
        /** Handle Main number and unit */
        const isPlural = value > 1;
        if (isPlural) {
            const stringFn = this.intl.strings[unit + 's'] || this.intl.strings[unit] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        else {
            const stringFn = this.intl.strings[unit] || this.intl.strings[unit + 's'] || '%d ' + unit;
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
        const wordSeparator = typeof this.intl.strings.wordSeparator === 'string' ? this.intl.strings.wordSeparator : ' ';
        return dateString.join(wordSeparator);
    }
    /**
       * If the numbers array is present, format numbers with it,
       * otherwise just cast the number to a string and return it
      */
    normalizeNumber(numbers, value) {
        return numbers && numbers.length === 10
            ? String(value).split('')
                .map((digit) => digit.match(/^[0-9]$/) ? numbers[parseInt(digit, 10)] : digit)
                .join('')
            : String(value);
    }
    /**
       * Take a string or a function that takes number of days and returns a string
       * and provide a uniform API to create string parts
      */
    normalizeFn(value, millisDelta, numbers) {
        return (stringOrFn) => typeof stringOrFn === 'function'
            ? stringOrFn(value, millisDelta).replace(/%d/g, this.normalizeNumber(numbers, value))
            : stringOrFn.replace(/%d/g, this.normalizeNumber(numbers, value));
    }
}
TimeagoCustomFormatter.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
TimeagoCustomFormatter.ctorParameters = () => [
    { type: timeago_intl_1.TimeagoIntl, },
];
exports.TimeagoCustomFormatter = TimeagoCustomFormatter;
//# sourceMappingURL=timeago.formatter.js.map