export const mergeData = (baseData, key, merge) => {
    baseData.forEach((data) => {
        merge.forEach((item) => {
            if (data.year == item.year) {
                data[key] = item.count
            }
        })
    })
}