"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
;
/**
 * To modify the text displayed, create a new instance of TimeagoIntl and
 * include it in a custom provider
 */
var TimeagoIntl = /** @class */ (function () {
    function TimeagoIntl() {
        /**
           * Stream that emits whenever the l10n strings are changed
           * Use this to notify directives if the l10n strings have changed after initialization.
           */
        this.changes = new rxjs_1.Subject();
    }
    TimeagoIntl.decorators = [
        { type: core_1.Injectable },
    ];
    return TimeagoIntl;
}());
exports.TimeagoIntl = TimeagoIntl;
//# sourceMappingURL=timeago.intl.js.map