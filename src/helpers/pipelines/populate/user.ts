const orders = [
    {$lookup: {
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders"
    }}
];

export default {orders};