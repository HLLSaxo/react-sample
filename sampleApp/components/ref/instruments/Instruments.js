import React from 'react'
import Details from '../../Details'
import InstrumentTemplate from './InstrumentTemplate'
import API from '../../utils/API'
import { InputGroup, SearchInput } from 'react-bootstrap'
import CustomTable from '../../utils/CustomTable'

class Instruments extends React.Component {
  constructor (props) {
    super(props)
    this.instrumentList = []
    this.description = 'Shows how to get instruments details based on Asset Type'
    this.state = { hasInstruments: false }
    this.onAssetTypeSelected = this.onAssetTypeSelected.bind(this)
    this.onSearchUpdated = this.onSearchUpdated.bind(this)
  }

  onAssetTypeSelected (assetType, instruments) {
    this.instrumentList = instruments
    this.setState({hasInstruments: true})
  }

  onSearchUpdated (term) {
    this.setState({ searchTerm: term })
  }

  render () {
    return (
      <div>
        <InstrumentTemplate onAssetTypeSelected={this.onAssetTypeSelected} />
        <div>
          <br/><br/><br/>
          <InputGroup>
            <InputGroup.Addon><img src="../images/search-icon.png" className="search-icon"></img></InputGroup.Addon>
            <SearchInput className="search-input"/>
          </InputGroup>
          <br/><br/><br/>
        <CustomTable data={this.instrumentList} keyField='Identifier' dataSortFields={['Identifier', 'Symbol']} width='150'/>
      </div>
      </div>
    )
  }
}

export default Instruments
