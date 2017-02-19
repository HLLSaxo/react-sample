import React from 'react';
import { merge, transform, uniq, forEach, map } from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import Instruments from '../../ref/instruments/Instruments';
import InfoPricesTemplate from './InfoPricesTemplate';


class InfoPrices extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { flag: false };
    this.selectedInstruments = {};
  }

  handleInstrumentSelected(instrument) {
    API.getInfoPrices({
      AssetType: instrument.AssetType,
      Uic: instrument.Uic,
    }, this.handleUpdateInstrumentData,
    result => console.log(result));
  }

  handleUpdateInstrumentData(data) {
    let instruments = undefined;
    if(this.selectedInstruments[data.AssetType]) {
      instruments = this.selectedInstruments[data.AssetType].Data;
    }
    else {
      instruments = {};
    }
    
    instruments[data.Uic] = data;
    this.selectedInstruments[data.AssetType] = { Data: instruments, subscription: undefined, AssetType: data.AssetType }
    this.setState({ flag: !this.state.flag });
  }

  handleSubscribeInstruments(forAssetType) {
    let subscription = this.selectedInstruments[forAssetType].subscription;
    if(subscription) {
      this.disposeSubscription(forAssetType);
    }
    else {
      this.subscribe(forAssetType);
    }

    this.setState({ flag: !this.state.flag });
  }

  disposeSubscription(forAssetType) {
    API.disposeIndividualSubscription(this.selectedInstruments[forAssetType].subscription, () => console.log('disposed subscription successfully'),
      () => console.log('Error disposing subscription'));
    this.selectedInstruments[forAssetType].subscription = undefined;
  }

  subscribe(forAssetType) {
    let instruments = this.selectedInstruments[forAssetType].Data;
    // concatinate uics
    let uics = this.getUics(instruments);
    // subscribe for instruments
    let subscription = API.subscribeInfoPrices({ Uics: uics, AssetType: forAssetType }, this.handleUpdateSubscribedInstruments);

    // hold subscription
    this.selectedInstruments[forAssetType].subscription = subscription;
  }

  getUics(instruments) {
    let uics = '';
    for(let uic in instruments) {
      if(uics !== '') {
        uics = `${uic},${uics}`;
      }
      else {
        uics = `${uic}`;
      }
    }
    return uics;
  }

  handleUpdateSubscribedInstruments(update) {
    const instrumentData = update.Data;
    for(let index in instrumentData) {
      let instruments = this.selectedInstruments[instrumentData[index].AssetType].Data;
      merge(Instruments[instrumentData[index].Uic], instrumentData[index]);
    }
    this.setState({ flag: !this.state.flag });
  }

  handleFetchInstrumentsData(forAssetType) {
    let instruments = this.selectedInstruments[forAssetType].Data;
    // concatinate uics
    let uics = this.getUics(instruments);
    API.getInfoPricesList({ Uics: uics, AssetType: forAssetType }, this.handleUpdateSubscribedInstruments);
  }

  render() {
    return (
      <div>
        <Instruments onInstrumentSelected={this.handleInstrumentSelected} />
        {
            map(this.selectedInstruments, (item) => (
            <InfoPricesTemplate
              instruments={item}
              handleSubscribeInstruments={this.handleSubscribeInstruments}
              handleFetchInstrumentsData={this.handleFetchInstrumentsData}
            />
          ))
        }
      </div>
    );
  } 
}

export default bindHandlers(InfoPrices);
