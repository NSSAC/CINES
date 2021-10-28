export const GET_ALL_JOB_DEFINITIONS = "[JOBSERVICE] GET ALL JOB DEFINITIONS";
export const CLEAR_ALL_JOB_DEFINITIONS = '[JOBSERVICE] CLEAR ALL JOB DEFINITIONS'

var token = localStorage.getItem("id_token");
let arr = [];

export function clearData(){
  return (dispatch) =>
      dispatch({
        type: CLEAR_ALL_JOB_DEFINITIONS,
        payload: [],
      })
    };


export function getJobDefinitionFiles() {
arr=[];
    var axios = require('axios');
    let url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_definition?&eq(enabled,true)&limit(9999)`
    var config = {
      method: 'get',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    };

  const request = axios(config)
  return (dispatch) =>
    request.then((response) => {
      if(response !== undefined && response.data.length > 0){
        arr.push(...response.data)
      }
      dispatch({
        type: GET_ALL_JOB_DEFINITIONS,
        payload: arr,
        totalFiles: response.headers,
      });
    });
}
