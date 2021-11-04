import { FileService } from "node-sciduct";

export const SET_INPUT_FILE_META = 'SET_INPUT_FILE_META';
export const INIT_INPUT_FILE_META = 'INIT_INPUT_FILE_META';

export function initializeInputForm(){
    return(dispatch)=>
        dispatch({
            type: INIT_INPUT_FILE_META
        })
}
export function getFileMeta(pathOrId)
{
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const fileServiceInstance = new FileService(url, token)

    return (dispatch) =>{
        fileServiceInstance.show(pathOrId).then((response) =>{
            dispatch({
                type: SET_INPUT_FILE_META,
                payload: {
                    ...response,
                    full_path: pathOrId
                }

            })}
        );
    }

}
