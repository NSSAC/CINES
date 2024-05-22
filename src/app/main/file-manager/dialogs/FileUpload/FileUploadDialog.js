import React from 'react';

import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';

import Slide from '@material-ui/core/Slide';

import * as Actions from 'app/main/file-manager/store/actions';
import reducer from "app/main/file-manager/store/reducers";
import withReducer from "app/store/withReducer";
import FILEUPLOAD_CONFIG from "../../FileManagerAppConfig";
// import MenuTableCell from "./MenuTableCell";
import { useDispatch, useSelector } from "react-redux";
// import filesize from 'filesize';

import './FileUpload.css'

// //Start of import custom elements
import '../../../CustomWebComponents/cwe-fileUploader'
// //End of custom elements


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



function FileUpload({ fileTypes, path, showModal, handleClose, breadcrumbArr, dropped, setSelected, uploadButtonClicked, dialogCloseFlag, test }) {
  const dispatch = useDispatch();
  const file_types = useSelector(({ fileManagerApp }) => fileManagerApp.file_types);
  const uploader = useSelector(({ fileManagerApp }) => fileManagerApp.uploader);
  var uploadableTypes = fileTypes || FILEUPLOAD_CONFIG.fileTypes
  const fullWidth = true;
  const maxWidth = 'sm';


  React.useEffect(() => {
    if (!file_types) {
      dispatch(Actions.getFileTypes())
    }else{
      setTimeout(() => {
        let cwe_fwiz = document.querySelector("cwe-fwiz")
        let temp_fileType = Object.values(file_types)
        if(cwe_fwiz){
          cwe_fwiz.setAttribute('file_types', JSON.stringify(temp_fileType))
        }
      },1000)

    }
    // console.log(file_types)
  }, [dispatch, file_types])

  React.useEffect(() => {
    window.addEventListener('cancel-wizard', onCancelll )
    return () => {
    window.removeEventListener('cancel-wizard', onCancelll )
    }
  },[])

  React.useEffect(() => {
    window.addEventListener('end-upload', onUploadd)
    return () => {
    window.removeEventListener('end-upload', onUploadd )
    }
  },[])

  React.useEffect(() => {
    // this useEffect is added to send the active upload status 
    let cwe_fwiz = document.querySelector("cwe-fwiz")
      if(cwe_fwiz){
        cwe_fwiz.setAttribute('uploader_stat', JSON.stringify(uploader))
      }
  }, [uploader])

  const onCancelll = (e) => {
    handleClose()
  }

  // const onCancel = () => {
  //   setUploadFiles([]);
  //   handleClose()
  // }

  const onUploadd = (event) => {
    const up_files = event.detail
    if(up_files.hasOwnProperty('uploadData')){

      const mapped = up_files['uploadData'].map((f) => {
        f['path'] = path
        return f
      })
      dispatch(Actions.addToUploadQueue(mapped))
    }
  }

  function onEntered() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    }
  }

  function onExiting() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
    }
  }

  return (
    <Dialog
      open={showModal}
      TransitionComponent={Transition}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      onEntered={onEntered}
      onExiting={onExiting}
      // onDragEnter={handleDragStart}
      // onDrop={handleDrop}
      // onDragOver={handleDragOver}
      // onDragLeave={handleDragLeave}
      // onClose={handleClose}
    >
      <DialogContent style={{backgroundColor: "#ffffff", color: "rgba(0, 0, 0, 0.87)"}}>
        <cwe-fwiz path={JSON.stringify(path)} uploadableTypes={JSON.stringify(uploadableTypes)} ></cwe-fwiz>
      </DialogContent>  

      <hr></hr>

    </Dialog>

  );
}

export default withReducer("fileManagerApp", reducer)(FileUpload);