import { Injectable, Directive, Input, ElementRef, Optional, ChangeDetectorRef, Pipe, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { expand, skip, filter } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}
/**
 * @param {?} value
 * @return {?}
 */
function coerceBooleanProperty(value) {
    return value != null && `${value}` !== 'false';
}
/**
 * @param {?} date
 * @return {?}
 */
function dateParser(date) {
    const /** @type {?} */ parsed = new Date(date);
    if (!Number.isNaN(parsed.valueOf())) {
        return parsed;
    }
    const /** @type {?} */ parts = String(date).match(/\d+/g);
    if (parts === null || parts.length <= 2) {
        return parsed;
    }
    else {
        const [firstP, secondP, ...restPs] = parts.map(x => parseInt(x, 10));
        return new Date(Date.UTC(firstP, secondP - 1, ...restPs));
    }
}
const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
class TimeagoClock {
}
class TimeagoDefaultClock extends TimeagoClock {
    /**
     * @param {?} then
     * @return {?}
     */
    tick(then) {
        return of(0)
            .pipe(expand(() => {
            const /** @type {?} */ now = Date.now();
            const /** @type {?} */ seconds = Math.round(Math.abs(now - then) / 1000);
            const /** @type {?} */ period = seconds < MINUTE
                ? 1000
                : seconds < HOUR
                    ? 1000 * MINUTE
                    : seconds < DAY
                        ? 1000 * HOUR
                        : 0;
            return period ? timer(period) : Observable.empty();
        }), skip(1));
    }
}
TimeagoDefaultClock.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */


/**
 * To modify the text displayed, create a new instance of TimeagoIntl and
 * include it in a custom provider
 */
class TimeagoIntl {
    constructor() {
        /**
         * Stream that emits whenever the l10n strings are changed
         * Use this to notify directives if the l10n strings have changed after initialization.
         */
        this.changes = new Subject();
    }
}
TimeagoIntl.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const defaultFormattter = function (then) {
    const /** @type {?} */ now = Date.now();
    const /** @type {?} */ seconds = Math.round(Math.abs(now - then) / 1000);
    const /** @type {?} */ suffix = then < now ? 'ago' : 'from now';
    const [value, unit] = seconds < MINUTE
        ? [Math.round(seconds), 'second']
        : seconds < HOUR
            ? [Math.round(seconds / MINUTE), 'minute']
            : seconds < DAY
                ? [Math.round(seconds / HOUR), 'hour']
                : seconds < WEEK
                    ? [Math.round(seconds / DAY), 'day']
                    : seconds < MONTH
                        ? [Math.round(seconds / WEEK), 'week']
                        : seconds < YEAR
                            ? [Math.round(seconds / MONTH), 'month']
                            : [Math.round(seconds / YEAR), 'year'];
    return { value, unit, suffix };
};
/**
 * @abstract
 */
class TimeagoFormatter {
}
class TimeagoDefaultFormatter extends TimeagoFormatter {
    /**
     * @param {?} then
     * @return {?}
     */
    format(then) {
        const { suffix, value, unit } = defaultFormattter(then);
        return this.parse(value, unit, suffix);
    }
    /**
     * @param {?} value
     * @param {?} unit
     * @param {?} suffix
     * @return {?}
     */
    parse(value, unit, suffix) {
        if (value !== 1) {
            unit += 's';
        }
        return value + ' ' + unit + ' ' + suffix;
    }
}
TimeagoDefaultFormatter.decorators = [
    { type: Injectable },
];
class TimeagoCustomFormatter extends TimeagoFormatter {
    /**
     * @param {?} intl
     */
    constructor(intl) {
        super();
        this.intl = intl;
    }
    /**
     * @param {?} then
     * @return {?}
     */
    format(then) {
        const { suffix, value, unit } = defaultFormattter(then);
        return this.parse(value, unit, suffix, Date.now(), then);
    }
    /**
     * @param {?} value
     * @param {?} unit
     * @param {?} suffix
     * @param {?} now
     * @param {?} then
     * @return {?}
     */
    parse(value, unit, suffix, now, then) {
        /** convert weeks to days if strings don't handle weeks */
        if (unit === 'week' && !this.intl.strings.week && !this.intl.strings.weeks) {
            const /** @type {?} */ days = Math.round(Math.abs(now - then) / (1000 * 60 * 60 * 24));
            value = days;
            unit = 'day';
        }
        /**
         * create a normalize function for given value
         */
        const /** @type {?} */ normalize = this.normalizeFn(value, now - then, this.intl.strings.numbers);
        /**
         * The eventual return value stored in an array so that the wordSeparator can be used
         */
        const /** @type {?} */ dateString = [];
        /** handle prefixes */
        if (suffix === 'ago' && this.intl.strings.prefixAgo) {
            dateString.push(normalize(this.intl.strings.prefixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.prefixFromNow) {
            dateString.push(normalize(this.intl.strings.prefixFromNow));
        }
        /**
         * Handle Main number and unit
         */
        const /** @type {?} */ isPlural = value > 1;
        if (isPlural) {
            const /** @type {?} */ stringFn = this.intl.strings[unit + 's'] || this.intl.strings[unit] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        else {
            const /** @type {?} */ stringFn = this.intl.strings[unit] || this.intl.strings[unit + 's'] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        /** Handle Suffixes */
        if (suffix === 'ago' && this.intl.strings.suffixAgo) {
            dateString.push(normalize(this.intl.strings.suffixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.suffixFromNow) {
            dateString.push(normalize(this.intl.strings.suffixFromNow));
        }
        /**
         * join the array into a string and return it
         */
        const /** @type {?} */ wordSeparator = typeof this.intl.strings.wordSeparator === 'string' ? this.intl.strings.wordSeparator : ' ';
        return dateString.join(wordSeparator);
    }
    /**
     * If the numbers array is present, format numbers with it,
     * otherwise just cast the number to a string and return it
     * @param {?} numbers
     * @param {?} value
     * @return {?}
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
     * @param {?} value
     * @param {?} millisDelta
     * @param {?=} numbers
     * @return {?}
     */
    normalizeFn(value, millisDelta, numbers) {
        return (stringOrFn) => typeof stringOrFn === 'function'
            ? stringOrFn(value, millisDelta).replace(/%d/g, this.normalizeNumber(numbers, value))
            : stringOrFn.replace(/%d/g, this.normalizeNumber(numbers, value));
    }
}
TimeagoCustomFormatter.decorators = [
    { type: Injectable },
];
/** @nocollapse */
TimeagoCustomFormatter.ctorParameters = () => [
    { type: TimeagoIntl, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class TimeagoDirective {
    /**
     * @param {?} intl
     * @param {?} cd
     * @param {?} formatter
     * @param {?} element
     * @param {?} clock
     */
    constructor(intl, cd, formatter, element, clock) {
        this.cd = cd;
        this.clock = clock;
        /**
         * Emits on:
         * - Input change
         * - Intl change
         * - Clock tick
         */
        this.stateChanges = new Subject();
        this._live = true;
        if (intl) {
            this.intlSubscription = intl.changes.subscribe(() => this.stateChanges.next());
        }
        this.stateChanges.subscribe(() => {
            this.setContent(element.nativeElement, formatter.format(this.date));
            this.cd.markForCheck();
        });
    }
    /**
     * The Date to display. An actual Date object or something that can be fed to new Date.
     * @return {?}
     */
    get date() {
        return this._date;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set date(date) {
        this._date = dateParser(date).valueOf();
        if (this._date) {
            if (this.clockSubscription) {
                this.clockSubscription.unsubscribe();
                this.clockSubscription = undefined;
            }
            this.clockSubscription = this.clock.tick(this.date)
                .pipe(filter(() => this.live, this))
                .subscribe(() => this.stateChanges.next());
        }
        else {
            throw new SyntaxError(`Wrong parameter in TimeagoDirective. Expected a valid date, received: ${date}`);
        }
    }
    /**
     * If the directive should update itself over time
     * @return {?}
     */
    get live() {
        return this._live;
    }
    /**
     * @param {?} live
     * @return {?}
     */
    set live(live) {
        this._live = coerceBooleanProperty(live);
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.stateChanges.next();
    }
    /**
     * @param {?} node
     * @param {?} content
     * @return {?}
     */
    setContent(node, content) {
        if (isDefined(node.textContent)) {
            node.textContent = content;
        }
        else {
            node.data = content;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.intlSubscription) {
            this.intlSubscription.unsubscribe();
            this.intlSubscription = undefined;
        }
        if (this.clockSubscription) {
            this.clockSubscription.unsubscribe();
            this.clockSubscription = undefined;
        }
        this.stateChanges.complete();
    }
}
TimeagoDirective.decorators = [
    { type: Directive, args: [{
                selector: '[timeago]',
                exportAs: 'timeago',
            },] },
];
/** @nocollapse */
TimeagoDirective.ctorParameters = () => [
    { type: TimeagoIntl, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: TimeagoFormatter, },
    { type: ElementRef, },
    { type: TimeagoClock, },
];
TimeagoDirective.propDecorators = {
    "date": [{ type: Input },],
    "live": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class TimeagoPipe {
    /**
     * @param {?} intl
     * @param {?} cd
     * @param {?} formatter
     * @param {?} clock
     */
    constructor(intl, cd, formatter, clock) {
        this.clock = clock;
        this.live = true;
        /**
         * Emits on:
         * - Input change
         * - Intl change
         * - Clock tick
         */
        this.stateChanges = new Subject();
        if (intl) {
            this.intlSubscription = intl.changes.subscribe(() => this.stateChanges.next());
        }
        this.stateChanges.subscribe(() => {
            this.value = formatter.format(this.date);
            cd.markForCheck();
        });
    }
    /**
     * @param {?} date
     * @param {...?} args
     * @return {?}
     */
    transform(date, ...args) {
        const /** @type {?} */ _date = dateParser(date).valueOf();
        let /** @type {?} */ _live;
        _live = isDefined(args[0])
            ? coerceBooleanProperty(args[0])
            : this.live;
        if (this.date === _date && this.live === _live) {
            return this.value;
        }
        this.date = _date;
        this.live = _live;
        if (this.date) {
            if (this.clockSubscription) {
                this.clockSubscription.unsubscribe();
                this.clockSubscription = undefined;
            }
            this.clockSubscription = this.clock.tick(this.date)
                .pipe(filter(() => this.live, this))
                .subscribe(() => this.stateChanges.next());
            this.stateChanges.next();
        }
        else {
            throw new SyntaxError(`Wrong parameter in TimeagoPipe. Expected a valid date, received: ${date}`);
        }
        return this.value;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.intlSubscription) {
            this.intlSubscription.unsubscribe();
            this.intlSubscription = undefined;
        }
        if (this.clockSubscription) {
            this.clockSubscription.unsubscribe();
            this.clockSubscription = undefined;
        }
        this.stateChanges.complete();
    }
}
TimeagoPipe.decorators = [
    { type: Injectable },
    { type: Pipe, args: [{
                name: 'timeago',
                pure: false,
            },] },
];
/** @nocollapse */
TimeagoPipe.ctorParameters = () => [
    { type: TimeagoIntl, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: TimeagoFormatter, },
    { type: TimeagoClock, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class TimeagoModule {
    /**
     * Use this method in your root module to provide the TimeagoModule
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: TimeagoClock, useClass: TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: TimeagoFormatter, useClass: TimeagoDefaultFormatter },
            ],
        };
    }
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {?=} config
     * @return {?}
     */
    static forChild(config = {}) {
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: TimeagoClock, useClass: TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: TimeagoFormatter, useClass: TimeagoDefaultFormatter },
            ],
        };
    }
}
TimeagoModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TimeagoDirective,
                    TimeagoPipe,
                ],
                exports: [
                    TimeagoDirective,
                    TimeagoPipe,
                ],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { TimeagoDirective, TimeagoPipe, TimeagoIntl, TimeagoClock, TimeagoDefaultClock, TimeagoFormatter, TimeagoDefaultFormatter, TimeagoCustomFormatter, TimeagoModule };
//# sourceMappingURL=ngx-timeago.js.map
