"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async ({ term, fields, autoComplete, model, nextStages = [], }) => {
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
    const data = await model.aggregate(query);
    if (autoComplete) {
        const valuesArray = [];
        data.forEach((item) => fields.forEach((field) => new RegExp(term, "i").test(item[field])
            ? valuesArray.push(item[field])
            : null));
        const values = [...new Set(valuesArray)].slice(0, 10);
        return values;
    }
    return data;
};
