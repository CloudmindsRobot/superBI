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
    name: "echarts bar chart",
    thumbnail: "https://www.echartsjs.com/examples/data/thumb/bar-tick-align.jpg",
    useLegacyApi: true,
})

export default class EchartsExample extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsBar"),
            metadata,
            transformProps(props) {
                const {formData: {autoRefreshInterval, sliceId}} = props
                return {...props, autoRefreshInterval, sliceId};
            }
        })
    }
}