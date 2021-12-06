import { toast } from "material-react-toastify";
import { FileService } from "node-sciduct";
export const UPDATING_USER_META = '[FILEMANAGER] UPDATING USER META';
export const UPDATE_USER_META_FAILED = '[FILEMANAGER] USER META UPDATE FAILED';
export const UPDATE_USER_META_SUCCESS = '[FILEMANAGER] USER META UPDATE SUCCESS';
export const RESET_USER_META_EDITOR = '[FILEMANAGER] RESET USER META EDITOR';

export function setUserMeta(file,property,value){
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)
  return (dispatch) =>{
        dispatch({
            type: UPDATING_USER_META
        });

        filesvc.set(file.id,[property,value])
        .then((response)=>{
            dispatch({
                type: UPDATE_USER_META_SUCCESS
            });
        })
        .catch((err)=>{
            dispatch({
                type: UPDATE_USER_META_FAILED,
                payload: err
            });
        })
    }
}
export function resetUsermetaEditor(){
    return (dispatch) =>{
        dispatch({
            type: RESET_USER_META_EDITOR
        });
    }
}
export function removeUsermetaProp(file,property){
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const filesvc = new FileService(url, token)
    return (dispatch)=>{
        return filesvc.unset(file.id,property)
            .then((response)=>{
            toast.success(`Property '${property}' removed.`)
            dispatch({
                type: RESET_USER_META_EDITOR
            });
            })
            .catch((err)=>{
                toast.error(`Error removing property: ${err}`)
                dispatch({
                    type: RESET_USER_META_EDITOR
                });
            })
    }
}