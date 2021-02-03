const consolidateMetricShape = (metric) => {
    if (typeof metric === 'string') return metric;
    // even thought `metric.optionName` is more unique, it's not used
    // anywhere else in `queryData` and cannot be used to access `data.records`.
    // The records are still keyed by `metric.label`.
    return metric.label;
  };

export default function transformProps(chartProps) {
    console.log(chartProps)
    const { height, datasource, formData, queryData } = chartProps;
    const {
        alignPn,
        colorPn,
        includeSearch,
        orderDesc,
        pageLength,
        metrics: metrics_,
        percentMetrics: percentMetrics_,
        tableTimestampFormat,
      } = formData;
      const { columnFormats, verboseMap } = datasource;
      const { records, columns: columns_ } = queryData.data;
      const metrics = metrics_ ? (metrics_ ).map(consolidateMetricShape) : [];
      // percent metrics always starts with a '%' sign.
      const percentMetrics = (percentMetrics_  || [])
        .map(consolidateMetricShape)
        .map((x) => `%${x}`);
      const columns = columns_.map((key) => {
        let label = verboseMap[key] || key;
    
        // make sure there is a " " after "%" for percent metrics
        if (label[0] === '%' && label[1] !== ' ') {
          label = `% ${label.slice(1)}`;
        }
    
        return {
          key,
          label,
          format: columnFormats ? columnFormats[key] : null,
        };
      });
    
      return {
        height,
        width: chartProps.width,
        data: records,
        columns,
        metrics,
        percentMetrics,
        alignPositiveNegative: alignPn,
        colorPositiveNegative: colorPn,
        includeSearch,
        orderDesc,
        pageLength: pageLength && parseInt(pageLength, 10),
        tableTimestampFormat,
      };
}