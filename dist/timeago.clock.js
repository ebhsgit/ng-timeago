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
var rxjs_1 = require("rxjs");
var of_1 = require("rxjs/observable/of");
var timer_1 = require("rxjs/observable/timer");
var operators_1 = require("rxjs/operators");
var util_1 = require("./util");
var TimeagoClock = /** @class */ (function () {
    function TimeagoClock() {
    }
    return TimeagoClock;
}());
exports.TimeagoClock = TimeagoClock;
var TimeagoDefaultClock = /** @class */ (function (_super) {
    __extends(TimeagoDefaultClock, _super);
    function TimeagoDefaultClock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimeagoDefaultClock.prototype.tick = function (then) {
        return of_1.of(0)
            .pipe(operators_1.expand(function () {
            var now = Date.now();
            var seconds = Math.round(Math.abs(now - then) / 1000);
            var period = seconds < util_1.MINUTE
                ? 1000
                : seconds < util_1.HOUR
                    ? 1000 * util_1.MINUTE
                    : seconds < util_1.DAY
                        ? 1000 * util_1.HOUR
                        : 0;
            return period ? timer_1.timer(period) : rxjs_1.Observable.empty();
        }), operators_1.skip(1));
    };
    TimeagoDefaultClock.decorators = [
        { type: core_1.Injectable },
    ];
    return TimeagoDefaultClock;
}(TimeagoClock));
exports.TimeagoDefaultClock = TimeagoDefaultClock;
//# sourceMappingURL=timeago.clock.js.map