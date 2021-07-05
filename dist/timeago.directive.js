"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const timeago_clock_1 = require("./timeago.clock");
const timeago_formatter_1 = require("./timeago.formatter");
const timeago_intl_1 = require("./timeago.intl");
const util_1 = require("./util");
class TimeagoDirective {
    constructor(intl, cd, formatter, element, clock) {
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
            this.intlSubscription = intl.changes.subscribe(() => this.stateChanges.next());
        }
        this.stateChanges.subscribe(() => {
            this.setContent(element.nativeElement, formatter.format(this.date));
            this.cd.markForCheck();
        });
    }
    /** The Date to display. An actual Date object or something that can be fed to new Date. */
    get date() {
        return this._date;
    }
    set date(date) {
        this._date = util_1.dateParser(date).valueOf();
        if (this._date) {
            if (this.clockSubscription) {
                this.clockSubscription.unsubscribe();
                this.clockSubscription = undefined;
            }
            this.clockSubscription = this.clock.tick(this.date)
                .pipe(operators_1.filter(() => this.live, this))
                .subscribe(() => this.stateChanges.next());
        }
        else {
            throw new SyntaxError(`Wrong parameter in TimeagoDirective. Expected a valid date, received: ${date}`);
        }
    }
    /** If the directive should update itself over time */
    get live() {
        return this._live;
    }
    set live(live) {
        this._live = util_1.coerceBooleanProperty(live);
    }
    ngOnChanges() {
        this.stateChanges.next();
    }
    setContent(node, content) {
        if (util_1.isDefined(node.textContent)) {
            node.textContent = content;
        }
        else {
            node.data = content;
        }
    }
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
    { type: core_1.Directive, args: [{
                selector: '[timeago]',
                exportAs: 'timeago',
            },] },
];
/** @nocollapse */
TimeagoDirective.ctorParameters = () => [
    { type: timeago_intl_1.TimeagoIntl, decorators: [{ type: core_1.Optional },] },
    { type: core_1.ChangeDetectorRef, },
    { type: timeago_formatter_1.TimeagoFormatter, },
    { type: core_1.ElementRef, },
    { type: timeago_clock_1.TimeagoClock, },
];
TimeagoDirective.propDecorators = {
    "date": [{ type: core_1.Input },],
    "live": [{ type: core_1.Input },],
};
exports.TimeagoDirective = TimeagoDirective;
//# sourceMappingURL=timeago.directive.js.map