"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedSearchFields = exports.allowedFilterProps = exports.allowedSortProps = void 0;
const common_1 = require("./common");
exports.allowedSortProps = Object.assign({ _id: "_id", id: "_id", user: "user", approved: "approved", seen: "seen", replied: "replied" }, common_1.allowedDateSortProps);
exports.allowedFilterProps = Object.assign({ approved: "approved", seen: "seen", replied: "replied" }, common_1.allowedDateFilterProps);
var AllowedSearchFields;
(function (AllowedSearchFields) {
    AllowedSearchFields["Text"] = "text";
    AllowedSearchFields["RepliedText"] = "repliedText";
})(AllowedSearchFields || (exports.AllowedSearchFields = AllowedSearchFields = {}));
