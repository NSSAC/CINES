export const GET_JOBS = "GET JOBS";
var token = localStorage.getItem("id_token");
var jobs = []

export function getJobDefinitionList() {
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
    jobs = response.data

    dispatch({
        type: GET_JOBS,
        payload: jobs,
      })
 })

}
