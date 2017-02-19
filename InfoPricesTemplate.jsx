import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';
import { Panel } from 'react-bootstrap';

export default (props) => {
	return (
		<div className='pad-box' >
			{ props.instruments && (
				<Panel bsStyle="primary" >
					<ButtonToolbar>
						<Button
							bsStyle='primary'
							onClick= {()=> props.handleSubscribeInstruments(props.instruments.AssetType) }>
							{props.instruments.subscription ? 'Unsubscribe' : 'Subscribe' }
						</Button>
						<Button
							bsStyle='primary'
							onClick={()=>props.handleFetchInstrumentsData(props.instruments.AssetType)}
							disabled = {props.instruments.subscription}>
							Get Prices
						</Button>
					</ButtonToolbar>
					<CustomTable
						data={props.instruments.Data}
						keyField='Uic'
						dataSortFields={['Uic', 'AssetType']}
						width={'150'}
						hidden={['DisplayAndFormat.Decimals', 'DisplayAndFormat.Format', 'DisplayAndFormat.OrderDecimals']}
						formatter={'DisplayAndFormat.Decimals'}
						priceFields={['Quote.Ask', 'Quote.Bid', 'Quote.Mid', 'PriceInfoDetails.LastClose', 'PriceInfoDetails.LastTraded', 'PriceInfo.High', 'PriceInfo.Low']} />
				</Panel>
			)}
		</div>
	)
};
