export const GET_HOME = 'GET_HOME';

var token=localStorage.getItem('id_token')
export function getHome(path)
{
            
        var axios = require('axios');
        if(typeof(token) == "string") {
        var config = {
          method: 'get',
          url: `https://sciduct.bii.virginia.edu/filesvc/file/home/${path}`,
          headers: { 
            'Accept': '*/*',
            'Authorization': token
          }
       };
    }

    if(typeof(token) == "object") {
      var config = {
        method: 'get',
        url: `https://sciduct.bii.virginia.edu/filesvc/file/home/${path}`,
        headers: { 
          'Accept': '*/*',
        }
     };
  }

    const request = axios(config)

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_HOME,
                payload: response.data,
            })
        );

}
