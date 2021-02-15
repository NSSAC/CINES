export const SET_SELECTED_ITEM_ID = '[My Jobs APP] SET SELECTED ITEM';

var token = localStorage.getItem('id_token')
export function setSelectedItem(id){
    


    var axios = require('axios');
   
    let url = `https://sciduct.bii.virginia.edu/jobsvc/job_definition/${id}`
        var config = {
      method: 'get',
      url: url,
      headers: {

        'Accept': 'application/json',

        'Authorization': token
      }
    }

    const request = axios(config)

    return (dispatch) =>
      request.then((response) => {
        dispatch({
          type: SET_SELECTED_ITEM_ID,
          payload: response,
          
        })
      });
}
