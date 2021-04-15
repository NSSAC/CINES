const AUTH_CONFIG = {
  callbackUrl: "http://localhost:3000/callback",
  userServiceURL: `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`,
  app_id: "net.science_dev",
  refresh_time: 15480000,
  // domain     : "YOUR_DOMAIN",
  // clientId   : "YOUR_CLIENT_ID",
  refresh_token: `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}/refresh`,
  logout_local_dev: "http://localhost:3000",
  logout_production: "",
};

export default AUTH_CONFIG;
