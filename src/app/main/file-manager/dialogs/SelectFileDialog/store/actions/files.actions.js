import { FileService } from "node-sciduct";

export const GET_FILES = '[Select File Dlg] GET FILES';
export const GET_FILES_FAILED = '[Select File Dlg] GET FILES FAILED';
export const CLEAR_FILES = '[Select File Dlg] CLEAR FILES';
export const REMOVING_FILES = '[Select File Dlg] REMOVING FILES';
export const FILE_REMOVED = '[Select File Dlg] FILE REMOVED';
export const FILE_REMOVAL_COMPLETE = '[Select File Dlg] FILE REMOVAL COMPLETE';
export const FILTERED_FILES = '[Select File Dlg] FILTERED FILES';
export const CLEAR_FILTER = '[Select File Dlg] CLEAR FILTER';


export function clearFiles(){
  return (dispatch)=>
    dispatch({
      type: CLEAR_FILES
    })
}

export function filterFiles(files,filter){
  if (!filter){
    return (dispatch)=>
      dispatch({
        type: CLEAR_FILTER
      })
  }
  var re=false;
  if (filter.search){
    re = new RegExp(filter.search,"gi")
  }
  
  var filtered = files.filter((f)=>{
    if (filter.file_types){
      if ((filter.file_types.indexOf(f.type)<0) &&  !f.isContainer){
        return false
      }
    }
    if (re){
      return f.name.match(re)
    }
    return true
  })

  return (dispatch)=>
    dispatch({
      type: FILTERED_FILES,
      payload: {
        filter: filter,
        filtered: filtered
      }
    })
}
export function getFiles(path)
{
  path = path || "/"

  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)

  return (dispatch) =>
    filesvc.list(path).then((response) => {
      dispatch({
        type: GET_FILES,
        payload: response
      });
    })
    .catch((err)=>{
        dispatch({
          type: GET_FILES_FAILED,
          payload: {
            error: err
          }
        })
    });
}
