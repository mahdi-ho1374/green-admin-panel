"use strict";
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
const { user, ...otherKeys } = exports.computedSortProps;
exports.computedFilterProps = otherKeys;
