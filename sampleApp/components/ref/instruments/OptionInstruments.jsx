import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar } from 'react-bootstrap';
import { noop } from 'lodash';
import refDataAPI from '../refDataAPI';
import Instruments from './Instruments'

class OptionInstruments extends React.PureComponent {
  constructor(props) {
    super(props);

    this.optionRootData = {}
    this.state = {
      selectedOptionSpace: undefined,
      flag: false 
    };
  }

  // action when user select instrument
  handleInstrumentSelection(eventKey) {
    let instrumentInfo = eventKey
    if(instrumentInfo.AssetType === 'FuturesOption') {
      // this means it Option Root information, please get underlying instruments from OptionRootId. e.g instrumentInfo.Identifier
      refDataAPI.getOptionRootInstruments(instrumentInfo.Identifier, this.onSuccess);
    }
    /* 
      Options are handled little differently, AssetType -> OptionRoots -> Specific Option (Expiry + PutOrCall + StrickPrice).
      For other instruments please refer file : Instruments.jsx 
    */
  }

  onSuccess(response) {
    // response is all options avilable for OptionRootId, see 'handleInstrumentSelection'' function
    this.optionRootData = response;
    // getFormattedExpiry is kind of hack, work is progress to have same expiry format in different places in response json.
    this.expiry = this.getFormattedExpiry(response.DefaultExpiry);
    // set option space data for UI.
    this.setOptionSpace();
    // select specific option on UI, generally DefaultOption in response json.
    this.strikePrice = response.DefaultOption.StrikePrice;
    this.callPut = response.DefaultOption.PutCall;
    this.setInstrument();
  }

  // format date strinf to YYYY-MM-DD format.
  getFormattedExpiry(dateStr) {
    // getMonth() is zero-based
    let date = new Date(dateStr), mm = date.getMonth() + 1, dd = date.getDate();
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, ( dd > 9 ? '' : '0') + dd].join('-');
  }

  setOptionSpace() {
    forEach(this.optionRootData.OptionSpace, (optionSpace) => {
      if(optionSpace.Expiry === this.expiry) {
        this.setState({selectedOptionSpace: optionSpace });
        return;
      }
    })
  }

  setInstrument() {
    this.currentOrder.Uic = '';
    forEach(this.state.selectedOptionSpace.SpecificOptions, (option)=>{
      if(option.StrikePrice === parseFloat(this.strikePrice) && option.PutCall === this.callPut) {
        this.getIntrumentPrice({AssetType:this.optionRootData.AssetType, Identifier:option.Uic});
        return;
      }
    })

    this.setState({ flag: !this.state.flag });
  }

  // react : UI to render html.
  render() {
    return (
      <div className='pad-box'>
        {/*Instrument is child react component, for more details please check './InstrumentTemplates.jsx' file */ }
        <Instruments 
          onInstrumentChange={this.handleInstrumentSelection}
          title='Select OptionRoot' >
          {this.props.children}
        </Instruments>
      </div>
    );
  }
}

Instruments.propTypes = {
  onInstrumentSelected: React.PropTypes.func,
  onAssetTypeSelected: React.PropTypes.func,
  onInstrumentPrice: React.PropTypes.func,
};

Instruments.defaultProps = {
  onInstrumentSelected: noop,
};

export default bindHandlers(OptionInstruments);
