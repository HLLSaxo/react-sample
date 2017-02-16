iimport React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar } from 'react-bootstrap';
import { noop } from 'lodash';
import API from '../../utils/API';
import Instrument from './InstrumentTemplates'

const AllAssetTypes = [
  'FxSpot', 'Bond', 'Cash', 'Stock', 'ManagedFund', 'StockIndex', 
  'CfdOnFutures', 'CfdOnIndex', 'CfdOnStock',
  'ContractFutures', 'FuturesStrategy',
  'StockOption', 'StockIndexOption', 'FuturesOption',
  'FxVanillaOption', 'FxKnockInOption', 'FxKnockOutOption', 'FxOneTouchOption', 'FxNoTouchOption'];

class Instruments extends React.PureComponent {
  constructor(props) {
    super(props);

    // Supported request parameters from '/openapi/ref/v1/instruments/'   
    this.instrumentsRequestParams = {
      $skip: undefined,             // Int,   Query-String, Optional number of elements to skip
      $top: undefined,              // Int,   Query-String, Optional number of elements to retrieve
      AssetTypes: undefined,        // String,Query-String, assest type. its could also be comma separated list of asset types. e.g 'Stock,FxSpot'
      ExchangeId: undefined,        // String,Query-String,	ID of the exchange that the instruments must match
      IncludeNonTradable: undefined,// Bool, 	Query-String	Should the search include instruments, which are not online client tradable?
      Keywords: undefined,          // String	Query-String	Search for matching keywords in the instruments. Separate keywords with spaces
      SectorId: undefined,          // String	Query-String	ID of the sector that the instruments must match
    }

    this.instruments = undefined;
    this.state = {
      hasInstruments:false
    };
  }

  handleAssetTypeSelection(eventKey) {
    /* UI
      clear instrument list for UI
    */
    this.instruments = [];
    /* Open API 
      first set parameters as required, e.g AssetTypes below
      then call to open api, API.getInstruments for more details
    */
    this.instrumentsRequestParams.AssetTypes = eventKey;
    API.getInstruments(this.instrumentsRequestParams,
     result => this.onSuccess(result, eventKey),
     result => console.log(result),
    );
  }

  // success callback for API.getInstruments
  onSuccess(result, eventKey) {
    // notify if any UI component using it and want to listen to asset change
    if (this.props.onAssetTypeSelected) {
      this.props.onAssetTypeSelected(eventKey, result.Data);
    }
    // show instruments on UI.
    this.instruments = result.Data;
    // react specific to refresh UI
    this.setState({ hasInstruments: !this.state.hasInstruments });
  }

  // action when user select instrument
  handleInstrumentSelection(eventKey) {
    // notify if any UI component using it and want to listen to asset change
    this.props.onInstrumentSelected(eventKey);
  }

  // react : UI to render html.
  render() {
    return (
      <div className='pad-box'>
        {/*Instrument is child react component, for more details please check './InstrumentTemplates.jsx' file */ }
        <Instrument 
          assetTypes={this.props.assetTypes ? this.props.assetTypes: AllAssetTypes  } 
          onAssetTypeChange={this.handleAssetTypeSelection} 
          instruments={this.instruments} 
          onInstrumentChange={this.handleInstrumentSelection}
          title='Select Instruments' >
          {this.props.children}
        </Instrument>
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

export default bindHandlers(Instruments);
