export const GET_FILES = "[FILE MANAGER APP] GET FILES";
var token = localStorage.getItem("id_token");
let arr = [];

export function getJobDefinitionFiles() {
  arr = [];
  var axios = require("axios");
  let url =
    "https://sciduct.bii.virginia.edu/jobsvc/job_definition?limit(99999)";
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
      arr.push(...response.data);
      dispatch({
        type: GET_FILES,
        payload: arr,
        totalFiles: response.headers,
      });
    });
}
