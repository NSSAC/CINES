export const GET_FILES = 'GET_FILES';
export const DELETE_FILE = 'DELETE_FILE';

var token=localStorage.getItem('id_token')
export function getFiles(path, type, id)
{
            
        var axios = require('axios');
        if(typeof(token) == "string") {
        var config = {
          method: 'get',
          url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${path}`,
          headers: { 
            'Accept': '*/*',
            'Authorization': token
          }
       };
    }

    if(typeof(token) == "object") {
     config = {
        method: 'get',
        url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${path}`,
        headers: { 
          'Accept': '*/*',
        }
     };
  }

    const request = axios(config)

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : type,
                payload: response.data,
                delete_id: id
            })
        );

}
