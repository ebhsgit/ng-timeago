"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const of_1 = require("rxjs/observable/of");
const timer_1 = require("rxjs/observable/timer");
const operators_1 = require("rxjs/operators");
const util_1 = require("./util");
class TimeagoClock {
}
exports.TimeagoClock = TimeagoClock;
class TimeagoDefaultClock extends TimeagoClock {
    tick(then) {
        return of_1.of(0)
            .pipe(operators_1.expand(() => {
            const now = Date.now();
            const seconds = Math.round(Math.abs(now - then) / 1000);
            const period = seconds < util_1.MINUTE
                ? 1000
                : seconds < util_1.HOUR
                    ? 1000 * util_1.MINUTE
                    : seconds < util_1.DAY
                        ? 1000 * util_1.HOUR
                        : 0;
            return period ? timer_1.timer(period) : rxjs_1.Observable.empty();
        }), operators_1.skip(1));
    }
}
TimeagoDefaultClock.decorators = [
    { type: core_1.Injectable },
];
exports.TimeagoDefaultClock = TimeagoDefaultClock;
//# sourceMappingURL=timeago.clock.js.map