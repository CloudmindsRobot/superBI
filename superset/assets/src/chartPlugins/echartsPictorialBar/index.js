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
    thumbnail: "https://echarts.cdn.apache.org/examples//data/thumb/pictorialBar-vehicle.jpg",
    useLegacyApi: true,
})

export default class EchartsPictorialBar extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsPictorialBar"),
            metadata,
            transformProps(props) {
                const {formData: {autoRefreshInterval, sliceId}} = props
                return {...props, autoRefreshInterval, sliceId};
            }
        })
    }
}