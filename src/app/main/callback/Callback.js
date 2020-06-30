import React, {useEffect} from 'react';
import {FuseSplashScreen} from '@fuse';
import auth0Service from 'app/services/auth0Service';
import * as userActions from 'app/auth/store/actions';
import * as Actions from 'app/store/actions';
import {useDispatch} from 'react-redux';
import sciductService from 'app/services/sciductService';

function Callback(props)
{
    const dispatch = useDispatch();

    useEffect(() => {
        let searchParam = window.location.search;
        let params = new URLSearchParams(searchParam);
        let tokenData = params.get('token');
      sciductService.onAuthenticated(tokenData, () => {
        sciductService.getUserData().then(tokenData => {
            console.log("tokenData: ", tokenData)
            dispatch(userActions.setUserDataSciDuct(tokenData));
        });
    });
}, [dispatch,props,props.location]);


    return (
        <FuseSplashScreen/>
    );
}

export default Callback;
