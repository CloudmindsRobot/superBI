import  {ChartMetadata, ChartPlugin} from "@superset-ui/chart";
import thumbnail from "./Sample_TagCloud_WorldPress.png"
import transformProps from "./transformProps";
/**
 *     
 * getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartControlPanelRegistry().registerValue(key, this.controlPanel);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
 */

const metadata = new ChartMetadata({
    description: "word cloud",
    name: "3D Word Cloud",
    thumbnail,
    useLegacyApi: true,
})

export default class WordCloud extends ChartPlugin {
    constructor() {
        super({
            loadChart: () => import("./WordCloud"),
            metadata,
            transformProps,
        })
    }
}