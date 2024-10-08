"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (prop) => [
    {
        $group: {
            _id: null,
            min: { $min: `$${prop}` },
            max: { $max: `$${prop}` },
        },
    },
    {
        $project: {
            _id: 0,
            range: ["$min", "$max"]
        },
    },
];
