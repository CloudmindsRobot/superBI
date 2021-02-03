import React from "react";
import { triggerQuery } from "../chart/chartAction";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(
          {
            triggerQuery,
          },
          dispatch,
        ),
      };
}

export default function withAutoRefresh(WrappedComponent) {
     class AutoRefreshWrapper extends React.PureComponent {
        constructor(pops) {
            super(pops);
            this.timerId = null;
        }
        componentDidMount() {
            const {hooks, sliceId} = this.props;
            let autoRefreshInterval = parseInt(this.props.autoRefreshInterval);
            if(!autoRefreshInterval) {
                return;
            }

            this.timerId = setInterval(() => {
                //hooks.onQuery();
                this.props.actions.triggerQuery(true, sliceId)
            }, autoRefreshInterval * 1000)
        }
        componentWillUnmount() {
            clearInterval(this.timerId);
        }
        render() {
            const {hooks, sliceId} = this.props;
            if(!this.props.hasOwnProperty('autoRefreshInterval')) {
                throw new Error("Can Not Found 'autoRefreshInterval' Property  In Props, Have You Ever Added It Before?")
            }
            let {autoRefreshInterval} = this.props;
            
            const autoRefreshEnabled = autoRefreshInterval !== 0;
            if(autoRefreshEnabled) {
                if(autoRefreshInterval < 0) {
                    throw new Error("The Interval Of Auto Refresh Should > 0s"); 
                }
    
                if(sliceId === undefined) {
                    throw new Error("Auto Refresh Need Chart Supply  'sliceId' Property In Props, Have You Ever Added It Or Ensure This Chart Has Been Saved?");
                }
            }

            return <WrappedComponent {...this.props}/>
        }
    }

    return connect(null, mapDispatchToProps)(AutoRefreshWrapper);
}