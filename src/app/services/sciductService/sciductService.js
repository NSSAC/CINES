import jwtDecode from 'jwt-decode';
import AUTH_CONFIG from './sciductServiceConfig';
import axios from 'axios';
import React from 'react';

var timeOutHandle;
class SciDuctService {

    init(success) {
        if (Object.entries(AUTH_CONFIG).length === 0 && AUTH_CONFIG.constructor === Object) {
            if (process.env.NODE_ENV === 'development') {
                console.warn("Missing SciDuct configuration at src/app/services/sciDuctService/sciductServiceConfig.js");
            }
            success(false);
            return;
        }

        success(true);
    }

    login = () => {
        window.open(`${AUTH_CONFIG.userServiceURL}/authenticate/${AUTH_CONFIG.app_id}`, "_self")
    };

    register = () => {
        window.open(`${AUTH_CONFIG.userServiceURL}/register/${AUTH_CONFIG.app_id}`, "_self")
    };

    onAuthenticated = (token, callback) => {
        this.setSession(token)
        this.fileserviceInit(token).then(() => {
            if (callback) {
                callback()
            }
        })
    };

    setSession = (token) => {
        localStorage.setItem('id_token', token);
        window.clearTimeout(timeOutHandle)
        this.setRefreshTime(token);
    };
 
    setRefreshTime(token) {

        //setTimeout(function(){ alert("Hello"); }, 8000);
        timeOutHandle = window.setTimeout(

            this.refreshAPI

            , `${AUTH_CONFIG.refresh_time}`);
    }

    refreshAPI = () => {
        const userToken = localStorage.getItem('id_token')
        axios.get(`${AUTH_CONFIG.refresh_token}`, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '* ',
                'Authorization': userToken,
            },
        }).then(res => {

            localStorage.removeItem("id_token")
            this.setSession(res.data)


        })

    }

    fileserviceInit(token) {
        // const dispatch = useDispatch();
        return axios({
            method: "get",
            url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/initialize`,
            headers: {
                Accept: "application/json",
                Authorization: token
            }
        }).then((response) => {
            localStorage.setItem("home_folder",response.data[0])
            return response.data[0]
        })
    }

    onRefreshGetUserData = () => {
        this.refreshAPI();
        return new Promise((resolve, reject) => {
            return resolve(this.getTokenData());
        });

    }

    logout = () => {
        // Clear access token and ID token from local storage
        localStorage.removeItem('id_token');
        localStorage.removeItem('home_folder');
        localStorage.removeItem('loggedIn')
        ;
        // I don't think we should clear out local storage - DJM
        // localStorage.clear();

        sessionStorage.clear();

        window.clearTimeout(timeOutHandle)
        const logout_url = encodeURIComponent(AUTH_CONFIG.logout_url)
        // console.log("Logout redirect url: ", logout_url)
        window.open(`${AUTH_CONFIG.userServiceURL}/logout?redirect=${logout_url}`, "_self")
    };

    isAuthenticated = () => {

        if (localStorage.getItem('id_token')) {
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

    };

    getIdToken = () => {
        return localStorage.getItem('id_token');
    };

    getTokenData = () => {
        const token = this.getIdToken();
        let decoded;
        if (token) {
            decoded = jwtDecode(token);
            localStorage.setItem('loggedIn', 'true');
            if (!decoded) {
                return null;
            }
            decoded.home_folder = localStorage.getItem("home_folder");
            // console.log("Decoded: ", decoded)
            return decoded;
        }
        return null;
    }

    render() {

        return (
            <div>

            </div>

        );
    }
}

const instance = new SciDuctService();

export default instance;
