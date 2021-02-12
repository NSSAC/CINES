import React,{useEffect} from 'react';
import {Button} from '@material-ui/core';
import sciductService from 'app/services/sciductService';
import * as authActions from 'app/auth/store/actions';
import * as Actions from 'app/store/actions';
import {useDispatch} from 'react-redux';

function SciDuctLoginTab(props)
{
     const dispatch = useDispatch();

     useEffect(() => {

       showDialog();

      sciductService.onAuthenticated(() => {

          dispatch(Actions.showMessage({message: 'Logging in with SciDuct'}));

          sciductService.getUserData().then(tokenData => {

               dispatch(authActions.setUserData(tokenData));

                dispatch(Actions.showMessage({message: 'Logged in with SciDuct'}));
           });
        });
     }, [dispatch]);

     function showDialog()
     {
         sciductService.login();
    }

     return (
        <div className="w-full">
          
        </div>
     );
}

export default SciDuctLoginTab;
