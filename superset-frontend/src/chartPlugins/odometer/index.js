import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumb from "./37472571-b13b0080-286c-11e8-8495-ef6aba591646.gif";
import transformProps from "./transformProps";
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "",
    name: "odometer",
    thumbnail: thumb,
    useLegacyApi: true,
})

export default class Odometer extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./Odometer"),
            metadata,
            transformProps
        })
    }
}