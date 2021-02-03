// function transformData(data, formData) {
//     const { metric, series } = formData;
  
//     // const transformedData = data.map(datum => ({
//     //   count: datum[metric.label || metric],
//     //   name: datum[series],
//     // }));
  
//     return transformedData;
//   }
  
  export default function transformProps(chartProps) {
    const { width, height, formData, queryData } = chartProps;
    const { colorScheme, rotation, sizeTo, sizeFrom, metric, series, autoRefreshInterval } = formData;
      const transformedData = queryData.data.map(datum => ({
      count: datum[metric.label || metric],
      name: datum[series],
    }));
    return {
      width,
      height,
      data: transformedData,
      colorScheme,
      rotation,
      sizeRange: [sizeFrom, sizeTo],
      autoRefreshInterval,
      sliceId: formData.sliceId
  }
}