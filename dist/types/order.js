"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedMinMaxProps = exports.allowedFilterProps = exports.allowedSortProps = exports.Status = exports.Operator = void 0;
const common_1 = require("./common");
var Operator;
(function (Operator) {
    Operator["INC"] = "increase";
    Operator["DEC"] = "decrease";
    Operator["FALSE"] = "";
})(Operator || (exports.Operator = Operator = {}));
var Status;
(function (Status) {
    Status["DELIVERED"] = "delivered";
    Status["CANCELED"] = "canceled";
    Status["PENDING"] = "pending";
})(Status || (exports.Status = Status = {}));
exports.allowedSortProps = Object.assign({ id: "_id", _id: "_id", user: "user", totalprice: "totalPrice", itemscount: "itemsCount", productscount: "productsCount" }, common_1.allowedDateSortProps);
exports.allowedFilterProps = Object.assign({ totalprice: "totalPrice", itemscount: "itemsCount", productscount: "productsCount", status: "status" }, common_1.allowedDateFilterProps);
exports.allowedMinMaxProps = exports.allowedFilterProps;
