const AUTH_CONFIG = {
    callbackUrl: "http://localhost:3000/callback",
    userServiceURL: "https://sciduct.bii.virginia.edu/usersvc",
    app_id: "net.science_dev",
    refresh_time:15480000,
    // domain     : "YOUR_DOMAIN",
    // clientId   : "YOUR_CLIENT_ID",
     callbackUrl: "YOUR_DOMAIN/callback",
     refresh_token :"/usersvc/refresh",
     logout_local_dev : "http://localhost:3000",
     logout_production :""
};

export default AUTH_CONFIG;
