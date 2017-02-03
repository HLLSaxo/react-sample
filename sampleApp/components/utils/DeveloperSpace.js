import React from 'react'
import { Button, Panel, Row, Col, FormControl, ControlLabel } from 'react-bootstrap'

class DeveloperSpace extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {update: false}
    this.oldValue = ''
  }

  action () {
    if (this.props.onAction) {
      this.props.onAction(this.requestText)
    }
  }

  onChangeRequestParams (event) {
    this.setState({update: true})
  }

  render () {
    if (this.oldValue != this.props.requestParams) {
      this.requestText = this.props.requestParams
      this.oldValue = this.props.requestParams
    }

    return (
        <Panel header="Developer's Space" className="panel-primary" collapsible>
          <Row>
            <div className="padBox" >
            <Col sm={6}>
              <ControlLabel>Request Parameters</ControlLabel>
              <FormControl componentClass="textarea" placeholder="Request Parameter" rows={6} value={this.requestText} onChange={this.onChangeRequestParams.bind(this)} />
            </Col>
            <Col sm={6}>
            <ControlLabel>Response Data</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Response Data" readOnly rows={6} value={this.props.responsText} />
            </Col>
            </div>
          </Row>
          <Row>
            <Col sm={4}>
              <div className="padBox">
                <Button bsStyle="primary" block onClick={this.action.bind(this)}>{this.props.actionText}</Button>
              </div>
            </Col>
          </Row>
        </Panel>
    )
  }
};

DeveloperSpace.propTypes = {
  actionText: React.PropTypes.string.isRequired,
  onAction: React.PropTypes.func.isRequired,
  requestParams: React.PropTypes.string.isRequired,
  responseText: React.PropTypes.string.isRequired
}

export default DeveloperSpace
