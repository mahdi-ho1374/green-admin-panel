"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (_a) => __awaiter(void 0, [_a], void 0, function* ({ term, fields, autoComplete, model, nextStages = [], }) {
    const regexQuery = fields.map((field) => ({
        [field]: { $regex: new RegExp(term, "i") },
    }));
    const query = [
        {
            $match: {
                $or: [...regexQuery],
            },
        },
        ...nextStages,
    ];
    const data = yield model.aggregate(query);
    if (autoComplete) {
        const valuesArray = [];
        data.forEach((item) => fields.forEach((field) => new RegExp(term, "i").test(item[field])
            ? valuesArray.push(item[field])
            : null));
        const values = [...new Set(valuesArray)].slice(0, 10);
        return values;
    }
    return data;
});
