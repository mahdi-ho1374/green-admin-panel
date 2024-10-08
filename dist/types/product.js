"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedSearchFields = exports.allowedMinMaxProps = exports.allowedFilterProps = exports.allowedSortProps = exports.ProductCategory = void 0;
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["TechEssentials"] = "Tech Essentials";
    ProductCategory["OutdoorAdventures"] = "Outdoor Adventures";
    ProductCategory["HomeAndLifestyle"] = "Home & Lifestyle";
    ProductCategory["FashionForward"] = "Fashion Forward";
    ProductCategory["HealthAndWellness"] = "Health & Wellness";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
;
exports.allowedSortProps = {
    id: "_id",
    _id: "_id",
    name: "name",
    quantity: "quantity",
    price: "price",
    revenue: "revenue",
    salesnumber: "salesNumber",
};
exports.allowedFilterProps = {
    quantity: "quantity",
    price: "price",
    salesnumber: "salesNumber",
    revenue: "revenue"
};
exports.allowedMinMaxProps = exports.allowedFilterProps;
var AllowedSearchFields;
(function (AllowedSearchFields) {
    AllowedSearchFields["Name"] = "name";
    AllowedSearchFields["Category"] = "category";
    AllowedSearchFields["Description"] = "description";
})(AllowedSearchFields || (exports.AllowedSearchFields = AllowedSearchFields = {}));
