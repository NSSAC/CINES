const AUTH_CONFIG = {
  callbackUrl: `${process.env.REACT_APP_CALLBACK_URL}`,
  userServiceURL: `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}`,
  app_id: `${process.env.REACT_APP_SCIDUCT_APP_ID}`,
  refresh_time: 15480000,
  refresh_token: `${process.env.REACT_APP_SCIDUCT_USER_SERVICE}/refresh`,
  logout_url: `${process.env.REACT_APP_LOGOUT_URL}`
};

export default AUTH_CONFIG;
