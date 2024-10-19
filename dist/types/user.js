"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedSearchFields = exports.allowedMinMaxProps = exports.allowedFilterProps = exports.allowedSortProps = void 0;
const common_1 = require("./common");
exports.allowedSortProps = Object.assign({ id: "_id", _id: "_id", username: "username", email: "email", totalspent: "totalSpent", orderscount: "ordersCount" }, common_1.allowedDateSortProps);
exports.allowedFilterProps = Object.assign({ totalspent: "totalSpent", orderscount: "ordersCount" }, common_1.allowedDateFilterProps);
exports.allowedMinMaxProps = exports.allowedFilterProps;
var AllowedSearchFields;
(function (AllowedSearchFields) {
    AllowedSearchFields["Username"] = "username";
    AllowedSearchFields["FirstName"] = "firstName";
    AllowedSearchFields["LastName"] = "lastName";
    AllowedSearchFields["Email"] = "email";
    AllowedSearchFields["Address"] = "address";
})(AllowedSearchFields || (exports.AllowedSearchFields = AllowedSearchFields = {}));
