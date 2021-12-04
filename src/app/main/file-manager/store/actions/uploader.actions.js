import axios from 'axios'
import { FileService } from "node-sciduct";
import FILEUPLOAD_CONFIG from "../../FileManagerAppConfig";

export const UPLOADS_ADDED = '[FILEMANAGER] UPLOADS ADDED'
export const UPLOAD_PROGRESS = '[FILEMANAGER] UPLOAD PROGRESS'
export const UPLOAD_COMPLETED = '[FILEMANAGER] UPLOAD COMPLETED'
export const UPLOAD_FAILED = '[FILEMANAGER] UPLOAD FAILED'
export const VALIDATION_RESULTS = '[FILEMANAGER] FILE VALIDATION RESULTS'
var uploadableTypes = FILEUPLOAD_CONFIG.fileTypes

var queue=[]
const completed=[]

const fsurl = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`

function uploadFile(dispatch,f){
  const token = localStorage.getItem('id_token');
  const fileServiceInstance = new FileService(fsurl, token)
  return fileServiceInstance.create(f.path, {name: f.fileName, type:f.type}).then(fileRef => {
    console.log("fileRef: ", fileRef)
    f.file_created=true
    f.id = fileRef.id
    return axios({
      method: 'put',
      url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${fileRef.id}`,
      headers: {
        'Content-Type': 'application/octet-stream',
        "accept": "application/json",
        'Access-Control-Allow-Origin': '* ',
        'Authorization': token,

      },
      data: f.contents,
      onUploadProgress: (progress) => {
        f.loaded = progress.loaded
        f.total = progress.total
        f.percentage = Math.floor(progress.loaded * 100 / progress.total)
        dispatch({
          type   : UPLOAD_PROGRESS,
          payload: queue
        })
      }
    }).then(()=>{
      f.completed = true
      var recent=[]
      queue = queue.filter((f)=>{
        if (f.completed){
          completed.push(f)
          recent.push(f)
          return false
        }
        return true
      })
      if (recent.length>0){
        dispatch({
          type   : UPLOAD_COMPLETED,
          payload: {completed,queue,recent}
        })
      }
    })
  }).catch(err=>{
    f.failed = true
    f.error = err
    var recent=[]
    queue = queue.filter((f)=>{
      if (f.failed){
        completed.push(f)
        recent.push(f)
        return false
      }
      return true
    })
    if (recent.length>0){
      dispatch({
        type   : UPLOAD_FAILED,
        payload: {completed,queue,recent: recent}
      })
    }
  })
}

function startUploads(dispatch){
  console.log("startUploads()")
    var defs = queue.map((f)=>{
      if (!f.file_created){
        return uploadFile(dispatch,f)
      }
      return false
    }).filter((d)=>!!d)

    Promise.all(defs)
      .then((results)=>{
        console.log("All uploads completed ", results)
      })
}

export function addToUploadQueue(files)
{
  queue.splice(queue.length-1,0,...files)

  return (dispatch) => {
    dispatch({
        type   : UPLOADS_ADDED,
        payload: queue
    })
    startUploads(dispatch)
  }
}

export function validateFiles(files){
  var validated = files.map((f)=>{ 
    if (uploadableTypes.indexOf(f.type)>=0){
      f.valid=true
    }else{
      f.valid=false; 
    }
    return f
  })

  return (dispatch) =>
  dispatch({
    type   : VALIDATION_RESULTS,
    payload: validated
  })
  
}

export function getUploaderStatus(){
  return (dispatch) =>
    dispatch({
      type   : UPLOAD_PROGRESS,
      payload: {queue,completed}
    })
}
