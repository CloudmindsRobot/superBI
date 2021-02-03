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
    name: "echarts 3d lines",
    thumbnail: "https://www.echartsjs.com/examples/data-gl/thumb/globe-echarts-gl-hello-world.jpg",
    useLegacyApi: true,
})

export default class Echarts3DLines extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./Echarts3DLines"),
            metadata,
            transformProps(props) {
                return {...props};
            }
        })
    }
}