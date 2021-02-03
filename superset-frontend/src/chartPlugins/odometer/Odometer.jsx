import React from "react";
import Odometer from 'react-odometerjs';
import "./odometer-theme-car.css"
import "./odometer-theme-minimal.css"
import "./odometer-theme-digital.css"
import "./odometer.less"
import { computeMaxFontSize } from '@superset-ui/dimension';

const PROPORTION = {
    HEADER: 0.3,
    SUBHEADER: 0.125,
    TRENDLINE: 0.3,
  };
export default class OdometerCompo extends React.Component {
    getClassName() {
        const { className, showTrendLine } = this.props;
        const names = `superset-legacy-chart-big-number ${className}`;
        if (showTrendLine) {
          return names;
        }
    
        return `${names} no-trendline`;
    }

    createTemporaryContainer() {
        const container = document.createElement('div');
        container.className = this.getClassName();
        container.style.position = 'absolute'; // so it won't disrupt page layout
        container.style.opacity = 0; // and not visible
    
        return container;
      }
    
      calcFontSize(maxHeight) {
        const { bigNumber, formatBigNumber, width } = this.props;
        const text = bigNumber === null ? 'No data' : bigNumber.toString();
    
        const container = this.createTemporaryContainer();
        document.body.append(container);
        const fontSize = computeMaxFontSize({
          text,
          maxWidth: Math.floor(width),
          maxHeight,
          className: 'header-line',
          container,
        });
        document.body.removeChild(container);
        return fontSize;
      }
    render() {

        const { showTrendLine, height, headerFontSize, subheaderFontSize, bigNumber, formData, theme , color, yAxisFormat} = this.props;
        let fontSize = this.props.fontSize;
        if(!fontSize) {
            fontSize = this.calcFontSize(Math.ceil(headerFontSize * (1 - PROPORTION.TRENDLINE) * height)) + 'px';
        }
        const {r, g, b, a} = color;
        const styles = {
          fontSize,
          color: `rgba(${r},${g},${b},${a})`,
        }

        return (
          <div style={styles} >
            <Odometer value={bigNumber} theme ={theme} format={yAxisFormat} />
          </div>
        )
      // return (<div style={styles}></div>)
    }
}