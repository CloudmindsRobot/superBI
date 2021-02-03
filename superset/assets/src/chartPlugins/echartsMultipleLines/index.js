import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "",
    name: "echarts multiple line",
    thumbnail: "https://www.echartsjs.com/examples/data/thumb/dynamic-data.jpg",
    useLegacyApi: true,
})

export default class EchartsMultipleLines extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsMultipleLines"),
            metadata,
            transformProps(props) {
                return {...props};
            }
        })
    }
}