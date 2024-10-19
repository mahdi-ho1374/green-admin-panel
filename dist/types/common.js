"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computedFilterProps = exports.allowedDateSortProps = exports.allowedDateFilterProps = exports.computedSortProps = exports.sortType = void 0;
exports.sortType = {
    asc: 1,
    desc: -1,
    descending: -1,
    ascending: 1,
};
exports.computedSortProps = {
    orderscount: "ordersCount",
    itemscount: "itemsCount",
    productscount: "productsCount",
    revenue: "revenue",
    user: "user",
};
exports.allowedDateFilterProps = {
    createdat: "createdAt",
    updatedat: "updatedAt"
};
exports.allowedDateSortProps = {
    createdat: "createdAt",
    updatedat: "updatedAt"
};
const { user } = exports.computedSortProps, otherKeys = __rest(exports.computedSortProps, ["user"]);
exports.computedFilterProps = otherKeys;
