export const GET_CHILDFILES = "[JOB DEFINITON CHILD JOB] GET CHILD JOBS"
export const CLEAR_CHILDJOB = "CLEAR CHILD JOB";
var token = localStorage.getItem("id_token");


export function clearChildData() {
  return (dispatch) =>
    dispatch({
      type: CLEAR_CHILDJOB,
      payload: [],
    });
}


export function getChildJobs(id) {
    let jobId = id
    var arr = [];
    let url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&eq(parent_id,${jobId})&limit(9999)`;
    // &eq(parent_id,ID OF JOB YOU ARE EXPANDING)&limit(9999)
    var axios = require("axios");
    var config = {
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    };

const request = axios(config);
return (dispatch) =>
  request.then((response) => {
    if (response !== undefined && response.data.length > 0) {
      // arr.push(...response.data)
      arr = response.data;
    }

    dispatch({
      type: GET_CHILDFILES,
      payload: arr,
      totalFiles: response.headers,
    });
  });
}