"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var timeago_clock_1 = require("./timeago.clock");
var timeago_formatter_1 = require("./timeago.formatter");
var timeago_intl_1 = require("./timeago.intl");
var util_1 = require("./util");
var operators_1 = require("rxjs/operators");
var TimeagoPipe = /** @class */ (function () {
    function TimeagoPipe(intl, cd, formatter, clock) {
        var _this = this;
        this.clock = clock;
        this.live = true;
        /**
           * Emits on:
           * - Input change
           * - Intl change
           * - Clock tick
          */
        this.stateChanges = new rxjs_1.Subject();
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
        var _date = util_1.dateParser(date).valueOf();
        var _live;
        _live = util_1.isDefined(args[0])
            ? util_1.coerceBooleanProperty(args[0])
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
                .pipe(operators_1.filter(function () { return _this.live; }, this))
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
    TimeagoPipe.decorators = [
        { type: core_1.Injectable },
        { type: core_1.Pipe, args: [{
                    name: 'timeago',
                    pure: false,
                },] },
    ];
    /** @nocollapse */
    TimeagoPipe.ctorParameters = function () { return [
        { type: timeago_intl_1.TimeagoIntl, decorators: [{ type: core_1.Optional },] },
        { type: core_1.ChangeDetectorRef, },
        { type: timeago_formatter_1.TimeagoFormatter, },
        { type: timeago_clock_1.TimeagoClock, },
    ]; };
    return TimeagoPipe;
}());
exports.TimeagoPipe = TimeagoPipe;
//# sourceMappingURL=timeago.pipe.js.map