import React from 'react'
import Details from '../../Details'
import InstrumentTemplate from '../../ref/instruments/InstrumentTemplate'
import { merge, forEach } from 'lodash'
import { Col, Row, Panel, Tabs, Tab, Table } from 'react-bootstrap'
import CustomTable from '../../utils/CustomTable'
import API from '../../utils/API'
import OrderForm from './OrderForm'

export default class Order extends React.Component {
  constructor (props) {
    super(props)
    this.orderSubscription = {}
    this.positionSubscription = {}
    this.openOrders = {}
    this.positions = {}
    this.accountInfo = {}
    this.state = {
      IsSubscribedForOrders: false,
      IsSubscribedForPositions: false,
      updated: false,
      selectedInstrument: undefined,
      selectedAssetType: ''
    }

    this.createOrderSubscription = this.createOrderSubscription.bind(this)
    this.creatPositionSubscription = this.creatPositionSubscription.bind(this)
    this.onInstrumentChange = this.onInstrumentChange.bind(this)

    this.handleAssetTypeChange = this.handleAssetTypeChange.bind(this)
  }

  handleAssetTypeChange (assetType, instruments) {
    debugger
    this.setState({selectedAssetType: assetType})
  }

  // react Event: Get Account information on mount\loading component
  componentDidMount () {
    API.getAccountInfo(this.onAccountInfo.bind(this))
  }

  // react Event: Unsubscribe or dispose on component unmount
  componentWillUnmount () {
    API.disposeSubscription()
  }

  // calback: successfully got account information
  onAccountInfo (response) {
    this.accountInfo = response.Data[0]
    // create Order subscription
    this.createOrderSubscription()
    // create Positions subscription
    this.creatPositionSubscription()
  }

  // Callback for Orders and delta from streaming server
  onOrderUpdate (response) {
    const data = response.Data
    forEach(data, (value, index) => {
      if (this.openOrders[data[index].OrderId]) {
        merge(this.openOrders[data[index].OrderId], data[index])
      } else {
        this.openOrders[data[index].OrderId] = data[index]
      }
    })
    this.setState({ updated: true })
  }

  // Get inforprice for instrument selected in UI
  onInstrumentChange (instrument) {
    const queryParams = {
      AssetType: instrument.AssetType,
      Uic: instrument.Identifier,
      FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote']
    }
    API.getInfoPrices(queryParams, this.onInfoPrice.bind(this))
  }

  // callback on successful inforprice call
  onInfoPrice (response) {
    this.setState({ selectedInstrument: response })
  }

  // callback for positions and delta from streaming server
  onPositionUpdate (response) {
    const data = response.Data
    forEach(data, (value, index) => {
      if (this.positions[data[index].PositionId]) {
        merge(this.positions[data[index].PositionId], data[index])
      } else {
        this.positions[data[index].PositionId] = data[index]
      }
    })
    this.setState({ updated: true })
  }

  // called after getting accountInfo successfully while loading component
  creatPositionSubscription () {
    const subscriptionArgs = {
      Arguments: {
        AccountKey: this.accountInfo.AccountKey,
        ClientKey: this.accountInfo.ClientKey,
        FieldGroups: ['DisplayAndFormat', 'PositionBase', 'PositionView']
      }
    }
    this.positionSubscription = API.createPositionsSubscription(subscriptionArgs, this.onPositionUpdate.bind(this))
    this.setState({ IsSubscribedForPositions: true })
  }

  // called after getting accountInfo successfully while loading component
  createOrderSubscription () {
    const subscriptionArgs = {
      Arguments: {
        AccountKey: this.accountInfo.AccountKey,
        ClientKey: this.accountInfo.ClientKey,
        FieldGroups: ['DisplayAndFormat']
      }
    }
    this.orderSubscription = API.createOrderSubscription(subscriptionArgs, this.onOrderUpdate.bind(this))
    this.setState({ IsSubscribedForOrders: true })
  }

  render () {
    return (
      <Details Title="Orders" Description={this.description}>
        <InstrumentTemplate onInstrumentSelected={this.onInstrumentChange} onAssetTypeSelected={this.handleAssetTypeChange} />
        <div className="padBox">
          <Row>
            <OrderForm accountInfo={this.accountInfo} instrumentInfo={this.state.selectedInstrument} assetType={this.state.selectedAssetType} />
          </Row>
          <Row>
            <div className="padBox">
              <Tabs className="primary" defaultActiveKey={1} animation={false} id="noanim-tab-example">
                <Tab eventKey={1} title="Orders">
                  <Row>
                    <div className="padBox">
                      <CustomTable data={this.openOrders} keyField="OrderId" dataSortFields={['OrderId']} width="150" />
                    </div>
                  </Row>
                </Tab>
                <Tab eventKey={2} title="Positions">
                  <Row>
                    <div className="padBox">
                      <CustomTable data={this.positions} keyField="PositionId" dataSortFields={['PositionId']} width="150" />
                    </div>
                  </Row>
                </Tab>
              </Tabs>
            </div>
          </Row>
        </div>
      </Details>)
  }
}
