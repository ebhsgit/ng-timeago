"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const timeago_directive_1 = require("./timeago.directive");
const timeago_pipe_1 = require("./timeago.pipe");
const timeago_clock_1 = require("./timeago.clock");
const timeago_formatter_1 = require("./timeago.formatter");
class TimeagoModule {
    /**
       * Use this method in your root module to provide the TimeagoModule
       */
    static forRoot(config = {}) {
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: timeago_clock_1.TimeagoClock, useClass: timeago_clock_1.TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: timeago_formatter_1.TimeagoFormatter, useClass: timeago_formatter_1.TimeagoDefaultFormatter },
            ],
        };
    }
    /**
       * Use this method in your other (non root) modules to import the directive/pipe
       */
    static forChild(config = {}) {
        return {
            ngModule: TimeagoModule,
            providers: [
                config.clock || { provide: timeago_clock_1.TimeagoClock, useClass: timeago_clock_1.TimeagoDefaultClock },
                config.intl || [],
                config.formatter || { provide: timeago_formatter_1.TimeagoFormatter, useClass: timeago_formatter_1.TimeagoDefaultFormatter },
            ],
        };
    }
}
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
exports.TimeagoModule = TimeagoModule;
//# sourceMappingURL=timeago.module.js.map