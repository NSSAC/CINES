import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FuseSplashScreen } from '@fuse';
import * as userActions from 'app/auth/store/actions';
import sciductService from 'app/services/sciductService';
import * as FuseActions from 'app/store/actions/fuse';

function Callback(props)
{
    const dispatch = useDispatch();

    useEffect(() => {
        let searchParam = window.location.search;
        let params = new URLSearchParams(searchParam);
        let tokenData = params.get('token');
        sciductService.onAuthenticated(tokenData, () => {
            sciductService.getUserData().then(tokenData => {
                dispatch(userActions.setUserDataSciDuct(tokenData));
                dispatch(FuseActions.updateNavigationItem('filehome',{
                    'url'  : "/files" + tokenData.home_folder
                }))
            });
        });
    }, [dispatch,props,props.location]);


    return (
        <FuseSplashScreen/>
    );
}

export default Callback;
