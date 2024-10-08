"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../types/common");
const common_2 = require("../types/common");
const sort_1 = __importDefault(require("./pipelines/sort"));
const filter_1 = __importDefault(require("./pipelines/filter"));
const populate_1 = __importDefault(require("./pipelines/populate"));
const validateFetchRequest_1 = __importDefault(require("./validateFetchRequest"));
exports.default = async ({ collection, req, res, allowedSortProps, allowedFilterProps, populate = "", }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const sortField = (((_a = req.query) === null || _a === void 0 ? void 0 : _a.sortField) || "")
        .trim()
        .toLowerCase();
    const sortBy = (((_b = req.query) === null || _b === void 0 ? void 0 : _b.sortBy) || "")
        .trim()
        .toLowerCase();
    const filterField = (((_c = req.query) === null || _c === void 0 ? void 0 : _c.filterField) || "")
        .trim()
        .toLowerCase();
    const filterTerm = (((_d = req.query) === null || _d === void 0 ? void 0 : _d.filterTerm) || "")
        .trim()
        .toLowerCase();
    const withinRange = (_e = req.query) === null || _e === void 0 ? void 0 : _e.withinRange;
    const isValid = (0, validateFetchRequest_1.default)({
        sortField,
        sortBy,
        allowedSortProps,
        res,
        filterField,
        filterTerm,
        withinRange,
        allowedFilterProps,
    });
    if (!isValid) {
        return {};
    }
    const perPage = Number(req.query.perPage) || 30;
    const currentPage = Number(req.params.currentPage) || 1;
    const skippedDataCount = (currentPage - 1) * perPage;
    const filterValue = filterTerm.includes(",")
        ? filterTerm
            .split(",")
            .map((item) => item.includes("-") ? new Date(item) : Number(item))
        : !["true", "false"].includes(filterTerm)
            ? filterTerm
            : filterTerm === "true"
                ? true
                : false;
    const sortOrder = common_1.sortType[sortBy];
    const sortProp = allowedSortProps[sortField];
    const filterProp = allowedFilterProps[filterField];
    const isWithinRange = [undefined, null].includes(withinRange)
        ? true
        : withinRange === "false"
            ? false
            : true;
    const sortQuery = !Object.keys(common_2.computedSortProps).includes(sortField)
        ? sort_1.default.get(sortProp)(sortOrder)
        : sort_1.default[sortProp](sortOrder);
    const filterQuery = !Object.keys(common_2.computedFilterProps).includes(filterField)
        ? filter_1.default.get(filterProp)(filterValue, isWithinRange)
        : filter_1.default[filterProp](filterValue, isWithinRange);
    const populateQuery = populate_1.default[populate];
    const query = [];
    filterField && query.push(...filterQuery);
    sortField && query.push(...sortQuery);
    populate && query.push(...populateQuery);
    const result = await collection
        .aggregate([
        ...query,
        {
            $facet: {
                data: [{ $skip: skippedDataCount }, { $limit: perPage }],
                count: [{ $count: "count" }],
            },
        },
    ], { collation: { locale: "en", strength: 2 } })
        .exec();
    const data = result[0].data;
    const count = ((_g = (_f = result[0]) === null || _f === void 0 ? void 0 : _f.count[0]) === null || _g === void 0 ? void 0 : _g.count) || 0;
    const lastPage = Math.ceil(count / perPage);
    return {
        data,
        lastPage,
    };
};
