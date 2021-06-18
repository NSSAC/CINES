import React, { Component } from 'react';
import { FuseSplashScreen } from '@fuse';
import { connect } from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import * as Actions from 'app/store/actions';
import sciductService from 'app/services/sciductService';
import * as FuseActions from 'app/store/actions/fuse';
class Auth extends Component {

    state = {
        waitAuthCheck: true
    }

    componentDidMount() {
        return Promise.all([
            // Comment the lines which you do not use
            this.sciductCheck(),
        ]).then(() => {
            this.setState({ waitAuthCheck: false })
        })
    }



    sciductCheck = () => new Promise(resolve => {
        sciductService.init(
            success => {
                if (!success) {
                    resolve();
                }
            }
        );
        /**
         * Retrieve user data from Auth0
         */
        if (sciductService.isAuthenticated() && localStorage.getItem('loggedIn')) {
            sciductService.onRefreshGetUserData().then(tokenData => {

                this.props.setUserDataSciDuct(tokenData);

                resolve();

                // This broadcasts the home dir to update the files menu
                this.props.setHomeDir('filehome', {
                    'url': "/apps/files" + tokenData.home_folder
                })
                //this.props.showMessage({message: 'Logging in with Sciduct'});
            })
        }
        else {
            resolve();
        }

        return Promise.resolve();
    })

    render() {
        return this.state.waitAuthCheck ? <FuseSplashScreen /> : <React.Fragment children={this.props.children} />;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout: userActions.logoutUser,
        setUserData: userActions.setUserData,
        showMessage: Actions.showMessage,
        hideMessage: Actions.hideMessage,
        setUserDataSciDuct: userActions.setUserDataSciDuct,
        setHomeDir: FuseActions.updateNavigationItem
    },
        dispatch);
}

export default connect(null, mapDispatchToProps)(Auth);
