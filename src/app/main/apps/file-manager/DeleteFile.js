import React, { useState, useEffect } from 'react';
import 'react-responsive-modal/styles.css';
import * as Actions from './store/actions';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom';

function DeleteFile(props) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  var token = localStorage.getItem('id_token')
  var currPath = window.location.pathname.replace("/apps/files", "")
  const dispatch = useDispatch();

  var axios = require('axios')

  var config = {
    method: 'delete',
    url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.fileId}?recursive=true`,
    headers: {
      'Accept': '*/*',
      'Authorization': token
    },
  }
  useEffect(() => {
    DeleteData()
    // eslint-disable-next-line
  }, [])

  if (success) { }


  function DeleteData() {
    setDeleteId(props.fileId)
    var request = axios(config)
    request.then(response => {
      setSuccess(true)
      setTimeout(() => {
        props.setDeleteFile(false)
        dispatch(Actions.getFiles(currPath, 'DELETE_FILE', props.fileId))
      }, 3000);

      props.pageLayout.current.toggleRightSidebar()
    })
      .catch(error => {
        setError(true)
        if (error.response)
          setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
        else
          setErrorMsg("An internal error occured. Please try again")
        setTimeout(() => {
          props.setDeleteFile(false)
        }, 3000);
      });
  }

  return (
    ReactDOM.createPortal(<div>
      {error === true && deleteId === props.fileId && <div> {toast.error(errorMsg)}</div>}

      {success === true && deleteId === props.fileId && <div> {toast.success(`'${props.name}'  deleted successfully`)}</div>}
      <ToastContainer limit={1} bodyStyle={{fontSize:"14px"}} position="top-right" />
    </div>, document.getElementById("portal"))
  )
}
export default DeleteFile;