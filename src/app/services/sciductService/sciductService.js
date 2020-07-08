import jwtDecode from 'jwt-decode';
import AUTH_CONFIG from './sciductServiceConfig';
import axios from 'axios';
import React from 'react';
var timeOutHandle;
class SciDuctService {

    init(success)
    {
        if ( Object.entries(AUTH_CONFIG).length === 0 && AUTH_CONFIG.constructor === Object )
        {
            if ( process.env.NODE_ENV === 'development' )
            {
                console.warn("Missing SciDuct configuration at src/app/services/sciDuctService/sciductServiceConfig.js");
            }
            success(false);
            return;
        }

        success(true);
    }

    login = () => {
        console.log("Redirect to sciduct login here")
        window.open(`${AUTH_CONFIG.userServiceURL}/authenticate/${AUTH_CONFIG.app_id}`, "_self")
    };

    register = () => {
        window.open(`${AUTH_CONFIG.userServiceURL}/register/${AUTH_CONFIG.app_id}`, "_self")
    };

    onAuthenticated = (token, callback) => {
        this.setSession(token)
        if (callback){
            callback()
        }
    };

    setSession = (token) => {

        localStorage.setItem('id_token', token);
        window.clearTimeout (timeOutHandle)
      
        this.setRefreshTime(token);
    };
    setRefreshTime(token){
       
        //setTimeout(function(){ alert("Hello"); }, 8000);
         timeOutHandle = window.setTimeout(
            
                this.refreshAPI
             
          ,`${AUTH_CONFIG.refresh_time}`);
    }

    refreshAPI = () => {
        const userToken = localStorage.getItem('id_token')
         axios.get(`${AUTH_CONFIG.refresh_token}`, {
            headers: { 
               'Content-Type': 'application/json',
           'Access-Control-Allow-Origin' : '* ',
           'Authorization' : userToken,
        } ,
        }).then(res => {
          
            localStorage.removeItem("id_token")
            this.setSession(res.data)
         

        })

   }
   onRefreshGetUserData =() =>{
    this.refreshAPI();
    return new Promise((resolve, reject) => {
        return resolve(this.getTokenData());
    });

}

    
   logout = () => {
    // Clear access token and ID token from local storage
    localStorage.removeItem('id_token');
    localStorage.clear();
    window.clearTimeout (timeOutHandle)
    window.open(`${AUTH_CONFIG.userServiceURL}/logout?redirect=${encodeURIComponent(`${AUTH_CONFIG.logout_local_dev}`)}`,"_self")
};

    isAuthenticated = () => {
       
        if (localStorage.getItem('id_token')){
            return true;
        }
        return false;
    };

    getUserData = () => {
        return new Promise((resolve, reject) => {
            return resolve(this.getTokenData());
        });
    };

    updateUserData = (user_metadata) => {
        console.log("updateUserData", user_metadata)
    };

    getIdToken = () => {
        console.log("getIdToken()")
        return localStorage.getItem('id_token');
    };

    getTokenData = () => {
        const token = this.getIdToken();
        const decoded = jwtDecode(token);
        localStorage.setItem('loggedIn' ,'true')
        console.log(decoded)
        console.log("Decoded: ", JSON.stringify(decoded,null,4))
        if ( !decoded )
        {
            return null;
        }

        return decoded;
    }

    render(){
       
        return   (
            <div>
         
        </div>

        );
    }
}

const instance = new SciDuctService();

export default instance;
