"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const timeago_clock_1 = require("./timeago.clock");
const timeago_formatter_1 = require("./timeago.formatter");
const timeago_intl_1 = require("./timeago.intl");
const util_1 = require("./util");
const operators_1 = require("rxjs/operators");
class TimeagoPipe {
    constructor(intl, cd, formatter, clock) {
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
            this.intlSubscription = intl.changes.subscribe(() => this.stateChanges.next());
        }
        this.stateChanges.subscribe(() => {
            this.value = formatter.format(this.date);
            cd.markForCheck();
        });
    }
    transform(date, ...args) {
        const _date = util_1.dateParser(date).valueOf();
        let _live;
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
                .pipe(operators_1.filter(() => this.live, this))
                .subscribe(() => this.stateChanges.next());
            this.stateChanges.next();
        }
        else {
            throw new SyntaxError(`Wrong parameter in TimeagoPipe. Expected a valid date, received: ${date}`);
        }
        return this.value;
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
TimeagoPipe.decorators = [
    { type: core_1.Injectable },
    { type: core_1.Pipe, args: [{
                name: 'timeago',
                pure: false,
            },] },
];
/** @nocollapse */
TimeagoPipe.ctorParameters = () => [
    { type: timeago_intl_1.TimeagoIntl, decorators: [{ type: core_1.Optional },] },
    { type: core_1.ChangeDetectorRef, },
    { type: timeago_formatter_1.TimeagoFormatter, },
    { type: timeago_clock_1.TimeagoClock, },
];
exports.TimeagoPipe = TimeagoPipe;
//# sourceMappingURL=timeago.pipe.js.map