import { FileService } from "node-sciduct";
export const GET_FILE_TYPES = '[FILEMANAGER] GET FILE TYPES';
export const GET_FILE_TYPES_FAILED = '[FILEMANAGER] GET FILE TYPES FAILED';

export function getFileTypes()
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)

  return (dispatch) =>
    filesvc.query("type","&limit(99999)").then((response) => {
      dispatch({
        type: GET_FILE_TYPES,
        payload: response
      });
    })
    .catch((err)=>{
        dispatch({
          type: GET_FILE_TYPES_FAILED,
          payload: {
            error: err
          }
        })
    });
}
