function sortByDate(arr: Record<string, any>[]) {
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

async function combineChartData(aggregationOne: any, aggregationTwo: any) {
  const [dataOne, dataTwo] = await Promise.all([
    aggregationOne,
    aggregationTwo,
  ]);
  const mergedData = [...dataOne, ...dataTwo];
  const sortedMergedData = sortByDate(mergedData);
  const idProps = Object.keys(dataOne[0]);

  const finalMergedData = sortedMergedData.reduce(
    (result: Record<string, any>[], currentItem: Record<string, any>) => {
      const previousItem = result[result.length - 1];
      const canBeMerged = previousItem ? idProps.every(
        (idProp) => currentItem._id[idProp] === previousItem._id[idProp]
      ) : false;
      if (previousItem && canBeMerged) {
        const mergedItem = {
          ...previousItem,
          ...currentItem,
        };
        result[result.length - 1] = mergedItem;
      } else {
        result.push(currentItem);
      }
      return result;
    },
    [] as Record<string, any>[]
  );
  return finalMergedData;
}

export default combineChartData;
