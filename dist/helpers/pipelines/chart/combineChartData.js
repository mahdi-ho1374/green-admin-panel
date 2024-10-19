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
function combineChartData(aggregationOne, aggregationTwo) {
    return __awaiter(this, void 0, void 0, function* () {
        const [dataOne, dataTwo] = yield Promise.all([
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
                const mergedItem = Object.assign(Object.assign({}, previousItem), currentItem);
                result[result.length - 1] = mergedItem;
            }
            else {
                result.push(currentItem);
            }
            return result;
        }, []);
        return finalMergedData;
    });
}
exports.default = combineChartData;
