import React from "react";
import WordCloud from "./word-cloud";
import "./word-cloud.css";
import withAutoRefresh from "../withAutoRefresh";

class WordCloudCompo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }
    componentDidMount() {
        const {sizeRange, width} =  this.props;
        const wordClound = new WordCloud(this.containerRef.current, {
            minFont: sizeRange[0],
            maxFont: sizeRange[1],
            radius:   width * 0.35
        });
        wordClound.setData(this.props.data);
        this.wordClound = wordClound;
    }
    componentDidUpdate() {
        const {sizeRange, width} =  this.props;
        if(this.wordClound) {
            this.wordClound.setOption({
                minFont: sizeRange[0],
                maxFont: sizeRange[1],
                radius:   width * 0.35
            })
            this.wordClound.setData(this.props.data)
        }
    }
    render() {
        return (<div ref={this.containerRef}></div>)
    }
}

export default withAutoRefresh(WordCloudCompo);
