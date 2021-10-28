// import { JobService } from "node-sciduct";
import axios from "axios"
export const SET_SELECTED_ITEM_ID = "[My Jobs APP] SET SELECTED ITEM";

// export function setSelectedItem(id) {
//   const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
//   const token = localStorage.getItem('id_token');
//   const jobServiceInstance = new JobService(url, token)

//   return (dispatch) => {
//     console.log("setSelectedId: ", id)
//     jobServiceInstance.getJobDefinition(id).then((response) => {
//       dispatch({
//         type: SET_SELECTED_ITEM_ID,
//         payload: response,
//       });
//     });
//   }
// }

export function setSelectedItem(target) {
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
        type: SET_SELECTED_ITEM_ID,
        payload: response.data
      });
    }).catch((err)=>{
      dispatch({
        type: SET_SELECTED_ITEM_ID,
        payload: err
      });
    });
}
