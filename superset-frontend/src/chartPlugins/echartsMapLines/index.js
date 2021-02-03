import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumbnail from "./echarts_lines.png";
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "",
    name: "echarts map lines",
    thumbnail,
    useLegacyApi: true,
})

export default class EchartsMapLines extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsMapLines"),
            metadata,
            transformProps(props) {
                return {...props};
            }
        })
    }
}