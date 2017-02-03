import React from 'react';
import API from '../../utils/API'
import { merge, map } from 'lodash'
import { ButtonToolbar, DropdownButton, MenuItem, InputGroup} from 'react-bootstrap';

const AssetTypes = ['FxSpot', 'Bond', 'Cash', 'Stock', 'CfdOnFutures', 'CfdOnIndex', 'CfdOnStock', 'ContractFutures', 'FuturesStrategy', 'StockIndex', 'ManagedFund','StockOption','StockIndexOption','FuturesOption'];

class InstrumentTemplate extends React.PureComponent {
    constructor (props) {
        super(props);
        this.instruments=[];
        this.state = { hasInstruments: false };

        this.onSuccessGetInstruments = this.onSuccessGetInstruments.bind(this);
    }

    onAssetTypeSelected (eventKey, event) {
        API.getInstruments({AssetTypes:eventKey},
            (result) => this.onSuccessGetInstruments(result, eventKey),
            (result) => console.log(result)
        );
    }

    onSuccessGetInstruments(result,assetType) {
        this.instruments = result.Data;
        this.setState({hasInstruments:true });

		if(this.props.onAssetTypeSelected) {
            this.props.onAssetTypeSelected(assetType, result.Data);
        }
    }

    onInstrumentSelected (eventKey, event) {
        if(this.props.onInstrumentSelected) {
            this.props.onInstrumentSelected(eventKey)
        }
    }

    render() {
        return (
            <div className="padBox">
                <ButtonToolbar>
                    <DropdownButton bsStyle="primary" title="Select AssetType" id="dropdown-size-large" onSelect = {this.onAssetTypeSelected.bind(this)} >
                        {AssetTypes.map((assetType) => <MenuItem eventKey = {assetType} key = {assetType}> {assetType} </MenuItem> )}
                    </DropdownButton>
                    { this.state.hasInstruments === true? (
                        <DropdownButton bsStyle="primary" title="Select Instrument" id="dropdown-size-large" onSelect = {this.onInstrumentSelected.bind(this)}>
                            {this.instruments.map((instrument) =>  <MenuItem eventKey = {instrument} key = {instrument.Symbol}> {instrument.Description} </MenuItem> )}
                        </DropdownButton>) : null
                    }
                </ButtonToolbar>
            </div>
        );
    }
}

InstrumentTemplate.propTypes = {
    onInstrumentSelected: React.PropTypes.func,
	onAssetTypeSelected: React.PropTypes.func
};

export default InstrumentTemplate;