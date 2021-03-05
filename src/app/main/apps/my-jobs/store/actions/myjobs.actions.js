export const GET_FILES = '[FILE MANAGER APP] GET FILES';
var token = localStorage.getItem('id_token')
let arr = []
let url1 = ''

export function getFiles(count, start, descShort, type, clearArry) {
  if (clearArry) {
    arr = []
  }
  let filterArrayFlag = JSON.parse(sessionStorage.getItem("isFilterApplied"));
  if (filterArrayFlag) {

    let filtertypeArray = JSON.parse(sessionStorage.getItem("selectedTypeArray"));
    if (filtertypeArray.length === 1) {

      if (filtertypeArray[0] === 'State') {
        let filterStateArray = JSON.parse(sessionStorage.getItem("preStateValue"));
        let selectedState = filterStateArray.toString();
        if (descShort) {
          url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(${selectedState}))&limit(${count},${start})&sort((-${type}))`

        }
        else {
          url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(${selectedState}))&limit(${count},${start})&sort((+${type}))`
        }

      }
      else if (filtertypeArray[0] === 'Job Type') {
        let filterJobTypeArray = JSON.parse(sessionStorage.getItem("preJobTypeValue"));
        let selectedState = filterJobTypeArray.toString();
        if (descShort) {
          url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(job_definition,(${selectedState}))&limit(${count},${start})&sort((-${type}))`

        }
        else {
          url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(job_definition,(${selectedState}))&limit(${count},${start})&sort((+${type}))`
        }

      }
    }

    else {
      let filterStateArray = JSON.parse(sessionStorage.getItem("preStateValue"));
      let selectedState = filterStateArray.toString();
      let filterJobTypeArray = JSON.parse(sessionStorage.getItem("preJobTypeValue"));
      let selectedJobType = filterJobTypeArray.toString();
      if (descShort) {
        url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(${selectedState}))&in(job_definition,(${selectedJobType}))&limit(count,${start})&sort(-${type}))`
      }
      else {
        url1 = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(${selectedState}))&in(job_definition,(${selectedJobType}))&limit(count,${start})&sort(+${type}))`
      }
    }

    var axios = require('axios');
    let url = url1
    var config = {
      method: 'get',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Authorization': token
      }
    };
  }

  else {
    sessionStorage.removeItem("selectedTypeArray");
    sessionStorage.removeItem("preStateValue");
    sessionStorage.removeItem("preJobTypeValue");
    if (descShort) {
      let count1 = count;
      let start1 = start;
       axios = require('axios');
      let url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(Completed,Running,Cancelled,Failed,UserQueued,Queued,Held,UserHeld))&limit(${count1},${start1})&sort(-${type})`
       config = {
        method: 'get',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Authorization': token
        }
      };
    }
    else {
      let count1 = count;
      let start1 = start;
       axios = require('axios');
      let url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance?&in(state,(Completed,Running,Cancelled,Failed,UserQueued,Queued,Held,UserHeld))&limit(${count1},${start1})&sort(+${type})`
       config = {
        method: 'get',
        url: url,
        headers: {
          'Accept': 'application/json',
          'Authorization': token
        }
      }
    };
  }

  const request = axios(config)

  return (dispatch) =>
    request.then((response) => {
      if(response !== undefined && response.data.length > 0){
        arr.push(...response.data)
      }
     
      dispatch({
        type: GET_FILES,
        payload: arr,
        totalFiles: response.headers
      })
    });
}
