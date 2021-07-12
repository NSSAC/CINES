import { JobService } from "node-sciduct";

export const SET_SELECTED_ITEM_ID = "[My Jobs APP] SET SELECTED ITEM";

export function setSelectedItem(id) {
  const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const jobServiceInstance = new JobService(url, token)

  return (dispatch) =>
    jobServiceInstance.getJobDefinition(id).then((response) => {
      dispatch({
        type: SET_SELECTED_ITEM_ID,
        payload: response,
      });
    });
}
