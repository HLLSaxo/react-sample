import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar, Form } from 'react-bootstrap';
import { noop } from 'lodash';
import refDataAPI from '../refDataAPI';
import Instruments from './Instruments'
import FormGroupTemplate from '../../utils/FormGroupTemplate'

const CALL = 'Call';
const PUT = 'Put';

class OptionInstruments extends React.PureComponent {
  constructor(props) {
    super(props);

    this.optionRootData = {}
    this.state = {
      selectedOptionSpace: undefined,
      flag: false 
    };

    this.callPut = '';
    this.strikePrice = 0.0;
    this.expiry = '';

    this.selectedOption
  }

  // action when user select instrument
  handleOptionRootSelection(optionRoot) {
    if(optionRoot.AssetType === 'FuturesOption') {
      if(this.props.onOptionRootSelected) {
        this.props.onOptionRootSelected(optionRoot)
      }
      // OptionRoot information - please get underlying instruments from OptionRootId. e.g instrumentInfo.Identifier
      refDataAPI.getOptionRootInstruments(instrumentInfo.Identifier, this.onSuccess);
    }
    else {
      // notify if any UI component using it and want to listen to asset change
      this.props.onInstrumentSelected(eventKey);
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
    this.selectOptionSpace();
    // select specific option on UI, generally DefaultOption in response json.
    this.strikePrice = response.DefaultOption.StrikePrice;
    this.callPut = response.DefaultOption.PutCall;
    this.selectInstrument();
  }

  // format date strinf to YYYY-MM-DD format.
  getFormattedExpiry(dateStr) {
    // getMonth() is zero-based
    let date = new Date(dateStr), mm = date.getMonth() + 1, dd = date.getDate();
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, ( dd > 9 ? '' : '0') + dd].join('-');
  }

  selectOptionSpace() {
    forEach(this.optionRootData.OptionSpace, (optionSpace) => {
      if(optionSpace.Expiry === this.expiry) {
        this.setState({selectedOptionSpace: optionSpace });
        return;
      }
    })
  }

  selectInstrument() {
    forEach(this.state.selectedOptionSpace.SpecificOptions, (option)=>{
      if(option.StrikePrice === parseFloat(this.strikePrice) && option.PutCall === this.callPut) {
        this.getInstrumentdetails(option.Uic);
        return;
      }
    })

    this.setState({ flag: !this.state.flag });
  }

// action when user select instrument
  getInstrumentdetails(uic) {
      /* Open API 
        first set parameters as required, e.g AssetTypes & Uic
        then call to open api, see API.getInstruments for more details
      */
      var instrumentDetailsRequestParams = { AssetType: this.optionRootData.AssestType, Uic:uic };
      refDataAPI.getInstrumentDetails(instrumentDetailsRequestParams,
      result => this.getInstrumentDetailsCallBack(instrument, result),  //success callback
      result => this.getInstrumentDetailsCallBack(instrument, result) // error callback. Please note for Options, you will always land here. See OptionInstruments.jsx file.
      );
    }

  getInstrumentDetailsCallBack(instrument, instrumentDetails) {
    /*
      notify if any UI component using it.
      please note for Options, instrumentDetails will always be error. See OptionInstruments.jsx file
      this is done to avoid un-neccary condition statements
    */
    this.props.onInstrumentSelected(instrument, instrumentDetails);
  }

  handleValueChange(event) {
    let value = event.target.value;
    switch(event.target.id) {
      case 'Expiry':
        this.expiry = value;
        this.selectOptionSpace();
        break;
      case 'Call/Put':
        this.callPut = value;
        this.selectInstrument()
        break;
      case 'StrickPrice':
        this.strikePrice = value;
        this.selectInstrument()
        break;
    }
    this.setState({ flag: !this.state.flag });
  }

  // react : UI to render html.
  render() {
    let specificOptions = [];
    if(this.state.selectedOptionSpace) {
      forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
        if(option.PutCall === this.callPut) {
          specificOptions.push(option);
         }
      });
    }

    let expiryStrickCallPut = [{label:'Expiry', value: this.state.selectedOption, componentClass:'select'},
    {label:'Call/Put', value: [CALL, PUT], componentClass:'select'},
    {label:'StrickPrice', value: specificOptions, componentClass:'select'}];

    return (
      <div className='pad-box'>
        {/*Instrument is child react component, for more details please check './InstrumentTemplates.jsx' file */ }
        <Instruments 
          onInstrumentSelected={this.handleOptionRootSelection}
          title='Select OptionRoot' >
          {this.props.children}
        </Instruments>
        <Form>
          <FormGroupTemplate data = {expiryStrickCallPut} onChange={this.handleValueChange} />
        </Form>
      </div>
    );
  }
}

OptionInstruments.propTypes = {
  onOptionRootSelected: React.PropTypes.func,
  onInstrumentSelected: React.PropTypes.func
};

OptionInstruments.defaultProps = {
  onInstrumentSelected: noop,
};

export default bindHandlers(OptionInstruments);
