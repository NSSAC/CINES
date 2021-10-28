// import { JobService } from "node-sciduct";
import axios from "axios";


export const CLEAR_JOB_DEFINITION = "[JOBSERVICE] CLEAR JOB DEFINITION";
export const GET_JOB_DEFINITION = "[JOBSERVICE] GET JOB DEFINITION";
export const GET_JOB_DEFINITION_FAILED = "[JOBSERVICE] GET JOB DEFINITION FAILED";
export const SWITCH_JOB_DEFINITION_VERSION = "[JOBSERVICE] SWITCH JOB DEFINITION VERSION";

// this function is broken because js.getJobDefinition() encodes the entire passed
// string which in this case includes a / and when that gets encoded it messes
// up the interpretation on the server.
// export function getJobDefinition(id) {
//   const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
//   const token = localStorage.getItem('id_token');
//   const jobServiceInstance = new JobService(url, token)

//   return (dispatch) =>
//     jobServiceInstance.getJobDefinition(id).then((response) => {
//       dispatch({
//         type: GET_JOB_DEFINITION,
//         payload: response,
//       });
//     })
//     .catch((err)=>{
//         dispatch({
//           type: GET_JOB_DEFINITION_FAILED,
//           payload: {
//             failed: true
//           }
//         })
//     });
// }

export function clearJobDefinition(){
  return (dispatch) =>
    dispatch({
      type: CLEAR_JOB_DEFINITION
    });
}

export function switchVersion(ver){
  return (dispatch)=>{
    dispatch({
      type: SWITCH_JOB_DEFINITION_VERSION,
      payload: ver
    })
  }
}
export function getJobDefinition(target) {
  const token = localStorage.getItem('id_token');
  let url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_definition/${target}`
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
      dispatch({
        type: GET_JOB_DEFINITION,
        payload: response.data
      });
    }).catch((err)=>{
      dispatch({
        type: GET_JOB_DEFINITION,
        payload: {
          failed: true,
          error: err
        }
      });
    });
}