import React from 'react';
import { last } from 'lodash';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import Details from './components/Details';
import PageDescMapper from './components/utils/PageDescMapper'
import DeveloperSpace from './components/utils/DeveloperSpace'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSideBarOpen: false}
    this.handleClick = this.handleClick.bind(this);
  }

 handleClick()  { 
   this.setState({isSideBarOpen: !this.state.isSideBarOpen }) 
  }

  render() {
    return (
      <div>
        <TopBar onToggleSideBar = {this.handleClick} />
        <SideBar />
        <Details title='titile' description='asa' >
          {this.props.children}
        </Details>
        <DeveloperSpace isOpen= {this.state.isSideBarOpen} ></DeveloperSpace>
      </div>
    );
}
}

export default App;
