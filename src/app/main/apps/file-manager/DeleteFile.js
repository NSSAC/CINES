import React, {useState, useEffect} from 'react';
import 'react-responsive-modal/styles.css';
import * as Actions from './store/actions';
import { useDispatch } from 'react-redux';
import {ToastsContainer, ToastsStore} from 'react-toasts';


function DeleteFile(props){
  const [error, setError] = useState(false);
  const [success, setSuccess]= useState(false);
  var token=localStorage.getItem('id_token')
  var currPath = window.location.pathname.replace("/apps/files","")
  const dispatch = useDispatch();

        var axios = require('axios')

        var config = {
          method: 'delete',
          url: `https://sciduct.bii.virginia.edu/filesvc/file/${props.fileId}?recursive=true`,
          headers: { 
            'Accept': 'application/vsmetadata+json',
            'Authorization': token
          },
       }
   useEffect(() => {
        DeleteData()
    },[]) 

  function DeleteData() {
      var request = axios(config)
       request.then(response=> {
        setSuccess(true)
        setTimeout(() => {
          dispatch(Actions.getFiles(currPath,'DELETE_FILE', props.fileId))
          props.setDeleteFile(false)
        }, 2000);
      })
      .catch(err => {
        setError(true)
        setTimeout(() => {
          props.setDeleteFile(false)
        }, 3000);
      });
}
 
if(error === true)
return (
  <div> {ToastsStore.error("An error occurred. Please try again.")}
  <ToastsContainer store={ToastsStore}/></div>
 )
else 
return (
     <div> {ToastsStore.success(`'${props.name}'` + " deleted successfully")}
     <ToastsContainer store={ToastsStore}/></div>
 )
}
export default DeleteFile;