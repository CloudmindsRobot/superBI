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
    name: "echarts line chart",
    thumbnail: "https://echarts.apache.org/examples/data/thumb/area-basic.jpg",
    useLegacyApi: true,
})

export default class EchartsExample extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsExample"),
            metadata,
            transformProps(props) {
                return {...props};
            }
        })
    }
}