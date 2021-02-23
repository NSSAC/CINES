import React from 'react'
// import { Switch, Route } from 'react-router-dom'
import IdleTimer from 'react-idle-timer';
//import { DashboardPage } from './dashboard/Dashboard'
import {IdleTimeOutDialog}from  'app/main/Idletime-dialog/Idledialog'
// import PropTypes from 'prop-types';
import sciductService from 'app/services/sciductService';

// import * as  HomeContent from 'app/main/cines-static/home/HomeContent'

var timeOutHandle
class IdleTimerComponent extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            timeout: 1800000,
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        
    }
   
    _onAction(e) {
      this.setState({isTimedOut: false})
    }
   
    _onActive(e) {
      this.setState({isTimedOut: false})
    }
   
  
    _onIdle(e) {
        this.setState({showModal: true})
        this.idleTimer.reset();
        this.setState({isTimedOut: true})
        timeOutHandle = window.setTimeout(
            
          this.handleLogout
       
    ,300000);
}
     
    
    handleClose() {
      clearTimeout(timeOutHandle);
      this.setState({showModal: false})
    }

    handleLogout() {
      this.setState({showModal: false})
     sciductService.logout();
    }

    render(){
      const { match } = this.props
      return(
        <div>
<>
{localStorage.getItem("loggedIn") ? <div>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />

            <div className="">
                {<IdleTimeOutDialog 
                    showModal={this.state.showModal} 
                    handleClose={this.handleClose}
                    handleLogout={this.handleLogout}
                /> }
            </div>
            </div> :null}

        </>
        </div>
        
      )
   }

 }

 export default IdleTimerComponent