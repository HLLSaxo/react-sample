import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Instruments from './Instruments';
import CustomTable from '../../utils/CustomTable';
import { Col } from 'react-bootstrap';

class InstrumentDetails extends React.Component {
  constructor() {
    super();
    this.state = { instrumentDetails: undefined };
  }

  handleInstrumentSelection(instrumentDetail) {
    this.setState({
      instrumentDetails: instrumentDetail
    });
  }

  render() {
    let instData = []
    for(let name in this.state.instrumentDetails) {
        instData.push({Data:name, value: this.state.instrumentDetails[name]});
    }

    return (
      <div>
        <Col sm={9} >
          <Instruments onInstrumentSelected={this.handleInstrumentSelection} />
          <CustomTable data={instData} width={'300'} keyField='Data' /></Col>
      </div>
    );
  }
}

export default bindHandlers(InstrumentDetails);
