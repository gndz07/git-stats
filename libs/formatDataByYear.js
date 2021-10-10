export const formatDataByYear = (data) => {
    //get only the year of each item
    const occurencePerYear = data.map((datum) => ({ year: datum.created_at.split("-").slice(0,1)[0] }));
    //group and count items by year
    const itemCounts =occurencePerYear.reduce((p, c) => {
        const year = c.year;
        if (!p.hasOwnProperty(year)) {
            p[year] = 0;
        }
        p[year]++;
        return p;
      }, {});
    const itemCountsExtended = Object.keys(itemCounts).map(year => {
        return {year, count: itemCounts[year]};
    });
    return itemCountsExtended;
}