import { FileService } from "node-sciduct";

export const GET_TARGET_META = '[SELECT FILE DLG] GET FILE META';
export const GET_TARGET_META_FAILED = '[SELECT FILE DLG] GET FILE META FAILED';

export function getTargetMeta(path)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)

  return (dispatch) =>
    filesvc.show(path).then((response) => {
      dispatch({
        type: GET_TARGET_META,
        payload: response
      });
    })
    .catch((err)=>{
        dispatch({
          type: GET_TARGET_META_FAILED,
          payload: {
            error: err
          }
        })
    });
}