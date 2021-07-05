"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var timeago_clock_1 = require("./timeago.clock");
var timeago_formatter_1 = require("./timeago.formatter");
var timeago_intl_1 = require("./timeago.intl");
var util_1 = require("./util");
var TimeagoDirective = /** @class */ (function () {
    function TimeagoDirective(intl, cd, formatter, element, clock) {
        var _this = this;
        this.cd = cd;
        this.clock = clock;
        /**
           * Emits on:
           * - Input change
           * - Intl change
           * - Clock tick
          */
        this.stateChanges = new rxjs_1.Subject();
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
        get: /** The Date to display. An actual Date object or something that can be fed to new Date. */
        function () {
            return this._date;
        },
        set: function (date) {
            var _this = this;
            this._date = util_1.dateParser(date).valueOf();
            if (this._date) {
                if (this.clockSubscription) {
                    this.clockSubscription.unsubscribe();
                    this.clockSubscription = undefined;
                }
                this.clockSubscription = this.clock.tick(this.date)
                    .pipe(operators_1.filter(function () { return _this.live; }, this))
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
        get: /** If the directive should update itself over time */
        function () {
            return this._live;
        },
        set: function (live) {
            this._live = util_1.coerceBooleanProperty(live);
        },
        enumerable: true,
        configurable: true
    });
    TimeagoDirective.prototype.ngOnChanges = function () {
        this.stateChanges.next();
    };
    TimeagoDirective.prototype.setContent = function (node, content) {
        if (util_1.isDefined(node.textContent)) {
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
    TimeagoDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[timeago]',
                    exportAs: 'timeago',
                },] },
    ];
    /** @nocollapse */
    TimeagoDirective.ctorParameters = function () { return [
        { type: timeago_intl_1.TimeagoIntl, decorators: [{ type: core_1.Optional },] },
        { type: core_1.ChangeDetectorRef, },
        { type: timeago_formatter_1.TimeagoFormatter, },
        { type: core_1.ElementRef, },
        { type: timeago_clock_1.TimeagoClock, },
    ]; };
    TimeagoDirective.propDecorators = {
        "date": [{ type: core_1.Input },],
        "live": [{ type: core_1.Input },],
    };
    return TimeagoDirective;
}());
exports.TimeagoDirective = TimeagoDirective;
//# sourceMappingURL=timeago.directive.js.map