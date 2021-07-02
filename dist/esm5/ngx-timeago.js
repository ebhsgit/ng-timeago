import { __read, __spread, __extends } from 'tslib';
import { Injectable, Directive, Input, ElementRef, Optional, ChangeDetectorRef, Pipe, NgModule } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { expand, skip, filter } from 'rxjs/operators';

function isDefined(value) {
    return typeof value !== 'undefined' && value !== null;
}
function coerceBooleanProperty(value) {
    return value != null && "" + value !== 'false';
}
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
        var _a = __read(parts.map(function (x) { return parseInt(x, 10); })), firstP = _a[0], secondP = _a[1], restPs = _a.slice(2);
        return new Date(Date.UTC.apply(Date, __spread([firstP, secondP - 1], restPs)));
    }
}
var MINUTE = 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365;
var TimeagoClock = /** @class */ (function () {
    function TimeagoClock() {
    }
    return TimeagoClock;
}());
var TimeagoDefaultClock = /** @class */ (function (_super) {
    __extends(TimeagoDefaultClock, _super);
    function TimeagoDefaultClock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeagoDefaultClock.prototype.tick = function (then) {
        return of(0)
            .pipe(expand(function () {
            var now = Date.now();
            var seconds = Math.round(Math.abs(now - then) / 1000);
            var period = seconds < MINUTE
                ? 1000
                : seconds < HOUR
                    ? 1000 * MINUTE
                    : seconds < DAY
                        ? 1000 * HOUR
                        : 0;
            return period ? timer(period) : Observable.empty();
        }), skip(1));
    };
    return TimeagoDefaultClock;
}(TimeagoClock));
TimeagoDefaultClock.decorators = [
    { type: Injectable },
];
var TimeagoIntl = /** @class */ (function () {
    function TimeagoIntl() {
        this.changes = new Subject();
    }
    return TimeagoIntl;
}());
TimeagoIntl.decorators = [
    { type: Injectable },
];
var defaultFormattter = function (then) {
    var now = Date.now();
    var seconds = Math.round(Math.abs(now - then) / 1000);
    var suffix = then < now ? 'ago' : 'from now';
    var _a = __read(seconds < MINUTE
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
                            : [Math.round(seconds / YEAR), 'year'], 2), value = _a[0], unit = _a[1];
    return { value: value, unit: unit, suffix: suffix };
};
var TimeagoFormatter = /** @class */ (function () {
    function TimeagoFormatter() {
    }
    return TimeagoFormatter;
}());
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
    return TimeagoDefaultFormatter;
}(TimeagoFormatter));
TimeagoDefaultFormatter.decorators = [
    { type: Injectable },
];
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
        if (unit === 'week' && !this.intl.strings.week && !this.intl.strings.weeks) {
            var days = Math.round(Math.abs(now - then) / (1000 * 60 * 60 * 24));
            value = days;
            unit = 'day';
        }
        var normalize = this.normalizeFn(value, now - then, this.intl.strings.numbers);
        var dateString = [];
        if (suffix === 'ago' && this.intl.strings.prefixAgo) {
            dateString.push(normalize(this.intl.strings.prefixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.prefixFromNow) {
            dateString.push(normalize(this.intl.strings.prefixFromNow));
        }
        var isPlural = value > 1;
        if (isPlural) {
            var stringFn = this.intl.strings[unit + 's'] || this.intl.strings[unit] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        else {
            var stringFn = this.intl.strings[unit] || this.intl.strings[unit + 's'] || '%d ' + unit;
            dateString.push(normalize(stringFn));
        }
        if (suffix === 'ago' && this.intl.strings.suffixAgo) {
            dateString.push(normalize(this.intl.strings.suffixAgo));
        }
        if (suffix === 'from now' && this.intl.strings.suffixFromNow) {
            dateString.push(normalize(this.intl.strings.suffixFromNow));
        }
        var wordSeparator = typeof this.intl.strings.wordSeparator === 'string' ? this.intl.strings.wordSeparator : ' ';
        return dateString.join(wordSeparator);
    };
    TimeagoCustomFormatter.prototype.normalizeNumber = function (numbers, value) {
        return numbers && numbers.length === 10
            ? String(value).split('')
                .map(function (digit) { return digit.match(/^[0-9]$/) ? numbers[parseInt(digit, 10)] : digit; })
                .join('')
            : String(value);
    };
    TimeagoCustomFormatter.prototype.normalizeFn = function (value, millisDelta, numbers) {
        var _this = this;
        return function (stringOrFn) { return typeof stringOrFn === 'function'
            ? stringOrFn(value, millisDelta).replace(/%d/g, _this.normalizeNumber(numbers, value))
            : stringOrFn.replace(/%d/g, _this.normalizeNumber(numbers, value)); };
    };
    return TimeagoCustomFormatter;
}(TimeagoFormatter));
TimeagoCustomFormatter.decorators = [
    { type: Injectable },
];
TimeagoCustomFormatter.ctorParameters = function () { return [
    { type: TimeagoIntl, },
]; };
var TimeagoDirective = /** @class */ (function () {
    function TimeagoDirective(intl, cd, formatter, element, clock) {
        var _this = this;
        this.cd = cd;
        this.clock = clock;
        this.stateChanges = new Subject();
        this._live = true;
        if (intl) {
            this.intlSubscription = intl.changes.subscribe(function () { return _this.stateChanges.next(); });
        }
        this.stateChanges.subscribe(function () {
            _this.setContent(element.nativeElement, formatter.format(_this.date));
            _this.cd.markForCheck();
        });
    }
    Object.defineProperty(TimeagoDirective.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (date) {
            var _this = this;
            this._date = dateParser(date).valueOf();
            if (this._date) {
                if (this.clockSubscription) {
                    this.clockSubscription.unsubscribe();
                    this.clockSubscription = undefined;
                }
                this.clockSubscription = this.clock.tick(this.date)
                    .pipe(filter(function () { return _this.live; }, this))
                    .subscribe(function () { return _this.stateChanges.next(); });
            }
            else {
                throw new SyntaxError("Wrong parameter in TimeagoDirective. Expected a valid date, received: " + date);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeagoDirective.prototype, "live", {
        get: function () {
            return this._live;
        },
        set: function (live) {
            this._live = coerceBooleanProperty(live);
        },
        enumerable: true,
        configurable: true
    });
    TimeagoDirective.prototype.ngOnChanges = function () {
        this.stateChanges.next();
    };
    TimeagoDirective.prototype.setContent = function (node, content) {
        if (isDefined(node.textContent)) {
            node.textContent = content;
        }
        else {
            node.data = content;
        }
    };
    TimeagoDirective.prototype.ngOnDestroy = function () {
        if (this.intlSubscription) {
            this.intlSubscription.unsubscribe();
            this.intlSubscription = undefined;
        }
        if (this.clockSubscription) {
            this.clockSubscription.unsubscribe();
            this.clockSubscription = undefined;
        }
        this.stateChanges.complete();
    };
    return TimeagoDirective;
}());
TimeagoDirective.decorators = [
    { type: Directive, args: [{
                selector: '[timeago]',
                exportAs: 'timeago',
            },] },
];
TimeagoDirective.ctorParameters = function () { return [
    { type: TimeagoIntl, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: TimeagoFormatter, },
    { type: ElementRef, },
    { type: TimeagoClock, },
]; };
TimeagoDirective.propDecorators = {
    "date": [{ type: Input },],
    "live": [{ type: Input },],
};
var TimeagoPipe = /** @class */ (function () {
    function TimeagoPipe(intl, cd, formatter, clock) {
        var _this = this;
        this.clock = clock;
        this.live = true;
        this.stateChanges = new Subject();
        if (intl) {
            this.intlSubscription = intl.changes.subscribe(function () { return _this.stateChanges.next(); });
        }
        this.stateChanges.subscribe(function () {
            _this.value = formatter.format(_this.date);
            cd.markForCheck();
        });
    }
    TimeagoPipe.prototype.transform = function (date) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _date = dateParser(date).valueOf();
        var _live;
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
                .pipe(filter(function () { return _this.live; }, this))
                .subscribe(function () { return _this.stateChanges.next(); });
            this.stateChanges.next();
        }
        else {
            throw new SyntaxError("Wrong parameter in TimeagoPipe. Expected a valid date, received: " + date);
        }
        return this.value;
    };
    TimeagoPipe.prototype.ngOnDestroy = function () {
        if (this.intlSubscription) {
            this.intlSubscription.unsubscribe();
            this.intlSubscription = undefined;
        }
        if (this.clockSubscription) {
            this.clockSubscription.unsubscribe();
            this.clockSubscription = undefined;
        }
        this.stateChanges.complete();
    };
    return TimeagoPipe;
}());
TimeagoPipe.decorators = [
    { type: Injectable },
    { type: Pipe, args: [{
                name: 'timeago',
                pure: false,
            },] },
];
TimeagoPipe.ctorParameters = function () { return [
    { type: TimeagoIntl, decorators: [{ type: Optional },] },
    { type: ChangeDetectorRef, },
    { type: TimeagoFormatter, },
    { type: TimeagoClock, },
]; };
var TimeagoModule = /** @class */ (function () {
    function TimeagoModule() {
    }
    TimeagoModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: TimeagoClock, useClass: TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: TimeagoFormatter, useClass: TimeagoDefaultFormatter },
            ],
        };
    };
    TimeagoModule.forChild = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: TimeagoClock, useClass: TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: TimeagoFormatter, useClass: TimeagoDefaultFormatter },
            ],
        };
    };
    return TimeagoModule;
}());
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

export { TimeagoDirective, TimeagoPipe, TimeagoIntl, TimeagoClock, TimeagoDefaultClock, TimeagoFormatter, TimeagoDefaultFormatter, TimeagoCustomFormatter, TimeagoModule };
//# sourceMappingURL=ngx-timeago.js.map
