import { FileService } from "node-sciduct";
export const GET_FILE_META = '[FILEMANAGER] GET FILE META';
export const GET_FILE_META_FAILED = '[FILEMANAGER] GET FILE META FAILED';

export function getFileMeta(path)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)

  return (dispatch) =>
    filesvc.show(path).then((response) => {
      dispatch({
        type: GET_FILE_META,
        payload: response
      });
    })
    .catch((err)=>{
        dispatch({
          type: GET_FILE_META_FAILED,
          payload: {
            error: err
          }
        })
    });
}
