"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var timeago_directive_1 = require("./timeago.directive");
var timeago_pipe_1 = require("./timeago.pipe");
var timeago_clock_1 = require("./timeago.clock");
var timeago_formatter_1 = require("./timeago.formatter");
var TimeagoModule = /** @class */ (function () {
    function TimeagoModule() {
    }
    /**
     * Use this method in your root module to provide the TimeagoModule
     */
    /**
       * Use this method in your root module to provide the TimeagoModule
       */
    TimeagoModule.forRoot = /**
       * Use this method in your root module to provide the TimeagoModule
       */
    function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: timeago_clock_1.TimeagoClock, useClass: timeago_clock_1.TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: timeago_formatter_1.TimeagoFormatter, useClass: timeago_formatter_1.TimeagoDefaultFormatter },
            ],
        };
    };
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     */
    /**
       * Use this method in your other (non root) modules to import the directive/pipe
       */
    TimeagoModule.forChild = /**
       * Use this method in your other (non root) modules to import the directive/pipe
       */
    function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: timeago_clock_1.TimeagoClock, useClass: timeago_clock_1.TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: timeago_formatter_1.TimeagoFormatter, useClass: timeago_formatter_1.TimeagoDefaultFormatter },
            ],
        };
    };
    TimeagoModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        timeago_directive_1.TimeagoDirective,
                        timeago_pipe_1.TimeagoPipe,
                    ],
                    exports: [
                        timeago_directive_1.TimeagoDirective,
                        timeago_pipe_1.TimeagoPipe,
                    ],
                },] },
    ];
    return TimeagoModule;
}());
exports.TimeagoModule = TimeagoModule;
//# sourceMappingURL=timeago.module.js.map