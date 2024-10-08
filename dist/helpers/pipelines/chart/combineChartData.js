"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sortByDate(arr) {
    return arr.sort((a, b) => {
        if (a._id.year !== b._id.year) {
            return a._id.year - b._id.year;
        }
        if (a._id.month !== b._id.month) {
            return a._id.month - b._id.month;
        }
        return a._id.day - b._id.day;
    });
}
async function combineChartData(aggregationOne, aggregationTwo) {
    const [dataOne, dataTwo] = await Promise.all([
        aggregationOne,
        aggregationTwo,
    ]);
    const mergedData = [...dataOne, ...dataTwo];
    const sortedMergedData = sortByDate(mergedData);
    const idProps = Object.keys(dataOne[0]);
    const finalMergedData = sortedMergedData.reduce((result, currentItem) => {
        const previousItem = result[result.length - 1];
        const canBeMerged = previousItem ? idProps.every((idProp) => currentItem._id[idProp] === previousItem._id[idProp]) : false;
        if (previousItem && canBeMerged) {
            const mergedItem = {
                ...previousItem,
                ...currentItem,
            };
            result[result.length - 1] = mergedItem;
        }
        else {
            result.push(currentItem);
        }
        return result;
    }, []);
    return finalMergedData;
}
exports.default = combineChartData;
