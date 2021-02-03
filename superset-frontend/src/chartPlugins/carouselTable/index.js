import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumbnail from "./table.png";
import transformProps from "./transformProps"
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "",
    name: "carousel table",
    thumbnail,
    useLegacyApi: true,
})

export default class CarouselTable extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./CarouselTable"),
            metadata,
            transformProps,
        })
    }
}