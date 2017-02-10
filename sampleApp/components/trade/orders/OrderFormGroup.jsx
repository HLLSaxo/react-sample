import React from 'react';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';


export default (props) => {
  const  getSelectCtrl = (item, onChangeCB) => {
    return ( 
      <FormControl componentClass='select' onChange={onChangeCB}>
        {item.value.map(data => <option>{data}</option>)}
      </FormControl>
    )
  }

  const getTextCtrl = (item, onChangeCB) => <FormControl type='text' value={item.value} onChange={onChangeCB} />

  return (
    <FormGroup>
      <Row>
      {
        props.data.map((item) => (
            <Col sm={3}>
              <ControlLabel>{item.label}</ControlLabel>
              { item.componentClass ==='select' ? getSelectCtrl(item, props.OnChange) : getTextCtrl(item, props.OnChange) }
            </Col>)
        )
      }
      </Row>
    </FormGroup>
  );
}

  // //Define Form
  //   let symbolAssestTypeAskBid = [{label:`Instrument (UIC: ${this.currentOrder.Uic})`, value:this.Symbol, componentClass:'text'},
  //     {label:'AssetType', value: this.currentOrder.AssetType, componentClass:'text'},
  //     {label:'AskPrice', value: this.Ask, componentClass:'text'},
  //     {label:'BidPrice', value: this.Bid, componentClass:'text'}];

  //   let buySellPriceAmount = [{label:'BuySell', value:this.currentOrder.BuySell, componentClass:'text'},
  //     {label:'OrderPrice', value:this.currentOrder.OrderPrice, componentClass:'text'},
  //     {label:'OrderAmount', value:this.currentOrder.Amount, componentClass:'text'}];
          
  //   let orderTypeOrderDurationsAccounts = [{label:'OrderType', value:OrderTypes, componentClass:'select'},
  //     {label:'OrderDuration', value:OrderDurationTypes, componentClass:'select'},
  //     {label:'Account', value:this.state.accounts, componentClass:'select'}];
    
  //   let optionCtrlData = [ { label:'Expiry', data: this.optionRootData.OptionSpace, componentClass:'select', valueProp:'expiry' },
  //     { label:'Call/Put', data: [CALL,PUT], componentClass:'select' },
  //     { label:'StrikePrice', data: specificOptions, componentClass:'select' },
  //     { label:'ToOpenClose', data: ['ToOpen','ToClose'], componentClass:'select' }];

  //   return (
  //     <div className='pad-box' >
  //       <Row><Instruments onInstrumentSelected={this.handleInstrumentChange} onAssetTypeSelected={this.handleAssetTypeChange} /></Row>
  //       <Row>
  //         <Col sm={6}>
  //           <Panel header='Order Details' className='panel-primary'>
  //             <Form>
  //               <OrderFormGroup readOnly="true" data = {symbolAssestTypeAskBid} />
  //               {this.state.isOptionOrder && {optionCtrlData} }
  //               <OrderFormGroup data = {buySellPriceAmount} />
  //               <OrderFormGroup data = {orderTypeOrderDurationsAccounts} />
  //               <FormGroup bsSize='large'>
  //                 <Row>
  //                   <Col sm={3}><Button bsStyle='primary' block onClick={this.handlePlaceOrder}>Place Order</Button></Col>
  //                 </Row>
  //               </FormGroup>
  //             </Form>
  //           </Panel>
  //         </Col>
  //         <Col sm={6}>
  //             <DeveloperSpace actionText='Place Order' onAction={this.handleDeveloperAction} requestParams={this.currentOrder} responsData={this.state.responsData}></DeveloperSpace>
  //         </Col>
  //       </Row>
  //     </div>);