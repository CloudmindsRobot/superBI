import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumbnail from   "./pie-legend.jpg"
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "",
    name: "echart pie chart",
    thumbnail,
    useLegacyApi: true,
})

export default class EchartsPie extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./EchartsPie"),
            metadata,
            transformProps(props) {
                return {...props};
            }
        })
    }
}