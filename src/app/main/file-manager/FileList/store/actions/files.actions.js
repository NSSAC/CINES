import { FileService } from "node-sciduct";

export const GET_FILES = '[FileList] GET FILES';
export const GET_FILES_FAILED = '[FileList] GET FILES FAILED';
export const CLEAR_FILES = '[FileList] CLEAR FILES';
export const REMOVING_FILES = '[FileList] REMOVING FILES';
export const FILE_REMOVED = '[FileList] FILE REMOVED';
export const FILE_REMOVAL_COMPLETE = '[FileList] FILE REMOVAL COMPLETE';
export const FILTERED_FILES = '[FileList] FILTERED FILES';
export const CLEAR_FILTER = '[FileList] CLEAR FILTER';


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
  var re = new RegExp(filter.trim(),"gi")
  var filtered = files.filter((f)=>{
    return f.name.match(re)
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

export function deleteFiles(files){
  const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
  const token = localStorage.getItem('id_token');
  const filesvc = new FileService(url, token)

  return (dispatch) =>{
    dispatch({
      type: REMOVING_FILES,
      payload: files
    });

    var proms = files.map((f)=>{
        return filesvc.remove(f,true).then((response)=>{
          dispatch({
            type: FILE_REMOVED,
            payload: f
          })
        })
    })

    Promise.all(proms).then((results)=>{
      dispatch({
        type: FILE_REMOVAL_COMPLETE,
        payload: results
      })
    })
  }
}