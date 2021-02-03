import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumbnail from "./bar-tick-align.jpg"
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
    thumbnail,
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