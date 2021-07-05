"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
;
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
        this.changes = new rxjs_1.Subject();
    }
}
TimeagoIntl.decorators = [
    { type: core_1.Injectable },
];
exports.TimeagoIntl = TimeagoIntl;
//# sourceMappingURL=timeago.intl.js.map