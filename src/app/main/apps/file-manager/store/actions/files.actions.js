export const GET_FILES = 'GET_FILES';
var token=localStorage.getItem('id_token')
console.log(typeof(token))
console.log(token)
export function getFiles(path)
{
            
        var axios = require('axios');
        if(typeof(token) == "string") {
        var config = {
          method: 'get',
          url: `https://sciduct.bii.virginia.edu/filesvc/file/${path}`,
          headers: { 
            'Accept': '*/*',
            'Authorization': token
          }
       };
    }

    if(typeof(token) == "object") {
      var config = {
        method: 'get',
        url: `https://sciduct.bii.virginia.edu/filesvc/file/${path}`,
        headers: { 
          'Accept': '*/*',
        }
     };
  }

    const request = axios(config)

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_FILES,
                payload: response.data
            })
        );

}
