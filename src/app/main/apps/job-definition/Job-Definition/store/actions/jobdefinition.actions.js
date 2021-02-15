
export const GET_FILES = '[FILE MANAGER APP] GET FILES';
var token = localStorage.getItem('id_token')
let arr = []
let url1 = ''

export function getJobDefinitionFiles() {
arr=[];
    var axios = require('axios');
    let url = "https://sciduct.bii.virginia.edu/jobsvc/job_definition?limit(99999)"
    var config = {
      method: 'get',
      url: url,
      headers: {

        'Accept': 'application/json',

        'Authorization': token
      }
    };
  

  // else {
  //   sessionStorage.removeItem("selectedTypeArray");
  //   sessionStorage.removeItem("preStateValue");
  //   sessionStorage.removeItem("preJobTypeValue");
  //   if (descShort) {
  //     let count1 = count;
  //     let start1 = start;
  //     var axios = require('axios');
  //     let url = 'https://sciduct.bii.virginia.edu/jobsvc/job_instance?&in(state,(Completed,Running,Cancelled,Failed))&limit(' + count1 + ',' + start1 + ')&sort(' + ('-' + type) + ')'
  //     var config = {
  //       method: 'get',
  //       url: url,
  //       headers: {

  //         'Accept': 'application/json',

  //         'Authorization': token
  //       }
  //     };
  //   }
  //   else {
  //     let count1 = count;
  //     let start1 = start;
  //     var axios = require('axios');
  //     let url = 'https://sciduct.bii.virginia.edu/jobsvc/job_instance?&in(state,(Completed,Running,Cancelled,Failed))&limit(' + count1 + ',' + start1 + ')&sort(' + ('+' + type) + ')'
  //     var config = {
  //       method: 'get',
  //       url: url,
  //       headers: {

  //         'Accept': 'application/json',

  //         'Authorization': token
  //       }
  //     }
  //   };
  // }

  const request = axios(config)

  return (dispatch) =>
    request.then((response) => {
      arr.push(...response.data)
      dispatch({
        type: GET_FILES,
        payload: arr,
        totalFiles: response.headers
      })
    });
}
