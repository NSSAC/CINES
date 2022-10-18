import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Input } from "@material-ui/core"
import clsx from 'clsx';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import SimpleFileList from "../../FileList/SimpleFileList";
import CreateFolder from "../CreateFolderDialog";
import FileUploadDialog from "../FileUpload/FileUploadDialog";
import Breadcrumb from "./Breadcrumb";
import * as Actions from './store/actions';
import * as Perms from '../../permissions';
import selectFileReducer from './store/reducers';
import {combineReducers} from 'redux';
import fileAppReducer from 'app/main/file-manager/store/reducers'
import FILEUPLOAD_CONFIG from "../../FileManagerAppConfig";

const reducer = combineReducers({
  "SelectFileApp": selectFileReducer,
  "fileManagerApp": fileAppReducer
})

function SelectFileDialog({ showModal, handleFMClose, target, fileTypes, multiple, onSelect, requireWritePermissions, enableUploads, title}) {

  var tf,fname;
  if (target){
    if (target.charAt(target.length-1)==="/"){
      tf = target
    }else{
      var parts = target.split("/")
      fname = parts.pop()
      tf = parts.join("/")
    }
  }else {
    tf=localStorage.getItem("last_selected_folder")|| localStorage.getItem("home_folder") || "/"
  }

  const dispatch = useDispatch()
  const target_meta = useSelector(({ ComboReducer }) => ComboReducer.SelectFileApp.target)
  const files = useSelector(({ ComboReducer }) => ComboReducer.SelectFileApp.files);
  const filtered_files = useSelector(({ ComboReducer }) => ComboReducer.SelectFileApp.filtered_files);
  const uploader = useSelector(({ ComboReducer }) => ComboReducer.fileManagerApp.uploader);
  const user = useSelector(({auth}) => auth.user)
  const contentRef = useRef()
  const [targetFolder, setTargetFolder] = useState(tf)
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [tname,setTname] = useState(fname||false)
  const [selection, setSelection] = useState({})
  const [search, setSearch] = useState("");
  const [droppedFiles,setDroppedFiles] = useState(false)
  const [filter,setFilter] = useState({file_types: fileTypes})
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFileUploadDialog,setShowFileUploadDialog] = useState(false)
  const [uploadButtonClickFlag, setUploadButtonClickFlag] = useState(false);
  var uploadableTypes = fileTypes || FILEUPLOAD_CONFIG.fileTypes

  const onCancel = () => {
    setSearch("");
    handleFMClose();
  }

  const onClickSelect = () => {

    if (onSelect) {
      var tf = []
      files.forEach((f) => {
        if (selection[f.id]) {
          tf.push(`${targetFolder}/${f.name}`)
        }
      })
      onSelect(tf)
    }

    localStorage.setItem("last_selected_folder",targetFolder)

    handleFMClose()

  }

  function showCreateFolderDialog() {
    setShowCreateDialog(true);
  }

  function closefileUploadDialog() {
    setShowFileUploadDialog(false);
    return refreshFolder();
  }

  function closeCreateFolderDialog() {
    setShowCreateDialog(false);
  }

  function openFileUpload(){
    setShowFileUploadDialog(true);
    setUploadButtonClickFlag(false);
  }

  function showSearch() {
    setShowSearchBox(true);
    document.addEventListener("keydown", escFunction, false);
  }


  function hideSearch() {
    setShowSearchBox(false);
    setSearch("");
    document.removeEventListener("keydown", escFunction, false);
  }

  function escFunction(event) {
    if (event.keyCode === 27) {
      hideSearch();
    }
  }

  function handleClickAway() {
    setShowSearchBox(false);
    document.removeEventListener("keydown", escFunction, false);
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

  async function refreshFolder(){
    return await dispatch(Actions.getFiles((target_meta.id==="root")?'/':target_meta.id))
  }

  function navigateToFolder(folder_path) {
    setTargetFolder(folder_path)
  }

  function onDragEnter(evt){
    evt.preventDefault()
    evt.stopPropagation();
}

function onDragLeave(evt){
    evt.preventDefault()
    evt.stopPropagation();
}

function onDragOver(evt){
    evt.preventDefault()
    evt.stopPropagation();
}

function handleDrop(e){
    e.preventDefault()
    e.stopPropagation();
    const droppedFiles = [];
    if (e.dataTransfer.items) {
      Array.from(e.dataTransfer.items).forEach((item, i) => {
        if (item.kind === "file") {
          let file = item.getAsFile();
          let tempObj = {};
          if (uploadableTypes.length===1){
            tempObj.type = uploadableTypes[0]
          }else{
            tempObj.type = uploadableTypes.indexOf(file.name.split('.').pop()) !== -1 && file.name.split('.').pop();
          }
          tempObj.fileName = file.name;
          tempObj['contents'] = file;
          droppedFiles.push(tempObj);
        }
      });

      setDroppedFiles(droppedFiles)
      setShowFileUploadDialog(true)

      //after the droppedFiles array has been passed
      //to the uplaoder we can clear the local dropped state reference
      setTimeout(()=>{
          setDroppedFiles(false)
      },500)
    }
}


  const onSelectFile = (selection)=>{
    var ids = Object.keys(selection).filter((s)=>{return selection[s]})
    var valid = files.filter((f)=>{
      if (requireWritePermissions && !Perms.canWriteFile(f,user)){
        return false
      }
      return ((ids.indexOf(f.id)>=0) && (fileTypes.indexOf(f.type)>=0))
    })
  
    if (valid.length===ids.length){
      setSelection(selection)
    }else{
      setSelection({})
    }
  }

  // useEffect(()=>{
  //   if (uploadedSelection){
  //     const s = uploadedSelection
  //     setTimeout(()=>{
  //       setSelection(s)
  //       setUploadedSelection(false)
  //       setShowFileUploadDialog(false)
  //     },500)
  //   }
  // },[files,uploadedSelection])

  useEffect(() => {
    setTimeout(() => {
      setTargetFolder(tf)
    }, 200);
  }, [tf]);

  useEffect(() => {
    if (uploader && uploader.recent && uploader.recent.length > 0) {
      var sel = {};
      if (multiple) {
        uploader.recent.forEach((f) => {
          sel[f.id] = true;
        });
      } else {
        sel[uploader.recent[0].id] = true;
      }

      if (uploadButtonClickFlag) {
        if (uploader && uploader.queue.length === 0) {
          closefileUploadDialog().then(()=>{
            setSelection(sel);
          })
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, uploader, uploader.recent, targetFolder, multiple, uploadButtonClickFlag]);

  useEffect(()=>{
    var filter ={file_types: fileTypes}
    if (search){
      filter.search = search
    }
    setFilter(filter)
  }, [fileTypes,search])

  useEffect(()=>{
    if (files && filter){
      dispatch(Actions.filterFiles(files,filter))
    }
  },[dispatch,filter,files,selection])

  useEffect(()=>{
    var found = false;
    if (files){
      if (files.some((f)=>{if (f.name===tname){ found= f; return true} return false})){
        const sel = {}  
        sel[found.id]=true
        setSelection(sel)
        setTname(false)
      }
    }
  },[dispatch,files,tname])

  useEffect(()=>{
    const _files = ((filtered_files && filtered_files.filtered)?filtered_files.filtered:files) || []
    var fIds = _files.map((f)=>f.id)

    if (Object.keys(selection).some((id)=>{
      return selection[id] && (fIds.indexOf(id)<0)
    })){
      setSelection({})
    }
  },[dispatch,filter,files,filtered_files,selection])


  useEffect(() => {
    dispatch(Actions.getTargetMeta(targetFolder))
    setSearch('')
  }, [dispatch, targetFolder])

  useEffect(() => {
    if (target_meta && target_meta.id && target_meta.isContainer) {
      if (target_meta.id==="root"){
        dispatch(Actions.getFiles("/"));
      } else if(targetFolder.split("/").pop() === target_meta.name){
        dispatch(Actions.getFiles(target_meta.id))
      }
    }
  }, [dispatch,target_meta,targetFolder])

  const handleUploadButtonClicked = (clickFlag) => {
    setUploadButtonClickFlag(clickFlag);
  }

  const selectedIds = Object.keys(selection).filter((s) => { return selection[s] })
  const _files = filtered_files ? filtered_files.filtered : files;
  const fileTypeList = fileTypes.map((t,idx)=>{
    if (fileTypes.length===1){
      return  <span key={idx} className="text-orange-600">{t}</span>
    }else if (idx<fileTypes.length-1){
      return <span key={idx}><span className="text-orange-600">{t}</span>,</span>
    }else{
      return <span key={idx}> or <span className="text-orange-600">{t}</span></span>
    }
  })

  const canWriteFolder = Perms.canWriteFile(target_meta,user)
  
  return (
    <div >
      <Dialog
        open={showModal}
        onClose={handleFMClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth='lg'
        disableBackdropClick
        onEntered={onEntered}
        onExiting={onExiting}
        onDragEnter={onDragEnter} 
        onDragOver={onDragOver} 
        onDragLeave={onDragLeave} 
        onDrop={handleDrop}
      >
        <DialogTitle id="alert-dialog-title" className="p-8 m-0">
          <div className="flex items-center justify-between">
            <h2>{title || "Select Target"}</h2>
            <div className="flex items-end items-center">

                <span>
                  <div className={clsx("flex")}>
                      <div onClick={showSearch}>
                        <IconButton title="Click to search" className="w-64 h-64 p-0 m-0"><Icon>search</Icon></IconButton>    
                      </div>
                    {showSearchBox && (
                      <ClickAwayListener onClickAway={handleClickAway}>
                        <div>
                          <div className="flex items-end ">
                            <Input
                              placeholder="&nbsp;Search"
                              className="flex flex-1 mb-8"
                              value={search}
                              inputProps={{
                                'aria-label': 'Search'
                              }}
                              onChange={(event) => setSearch(event.target.value)}
                              autoFocus
                            />
                              <IconButton title="Click to clear and hide the search box" onClick={hideSearch} className="mx-8 mt-8" >
                                <Icon>close</Icon>
                              </IconButton>
                          </div>
                        </div>
                      </ClickAwayListener>
                    )}

                  </div>
                </span>

                {target_meta && target_meta.type==="folder" && canWriteFolder && title === "Select File" &&  (
                     <IconButton title="Upload files" className="w-64 h-64 p-0 m-0" onClick={openFileUpload}>
                        <Icon
                          className="flex flex-col"
                        >
                        cloud_upload
                      </Icon>
                     </IconButton>

              )}  

              {target_meta && target_meta.type==="folder" && canWriteFolder && (
                    <IconButton title="Create folder" className="w-64 h-64 p-0 m-0" onClick={showCreateFolderDialog}>
                      <Icon
                        className="flex flex-col"

                      >
                        create_new_folder
                      </Icon>
                    </IconButton>

              )}
            </div>
          </div>
          <div className="-mt-12 mb-4 text-sm font-normal">
            {(fileTypeList.length===1) && (
                <React.Fragment>
                <p>Click on a row to select a {fileTypeList[0]} and then click SELECT to finalize your choice.</p>
                <p>Click on the name of a folder to descend into the folder.</p>
                </React.Fragment>
            )}
            {(fileTypeList.length>1) && (
              <React.Fragment>
                <p>Click on a row to select a valid target and then click SELECT to finalize your choice.</p>
                <p className="ml-4">Valid Types: {fileTypeList}</p>
                <p>Click on the name of a folder to descend into the folder.</p>
              </React.Fragment>
            )}
          </div>
          <Breadcrumb className="p-0 pt-0" targetPath={targetFolder} setTargetPath={navigateToFolder}></Breadcrumb>
        </DialogTitle>
        <DialogContent className="overflow-auto p-8 pt-0 mt-0 m-0" ref={contentRef}>
          {files && (
            <SimpleFileList  selected={{...selection}} files={_files} selectableTypes={fileTypes} folder={targetFolder} multiple={multiple} onSelect={onSelectFile} navigateToFolder={navigateToFolder} rowClass="bg-black" />
          )}

        </DialogContent>
        <DialogActions>
          <Button variant="contained" id='selectFile' disabled={!selectedIds || selectedIds.length < 1} onClick={onClickSelect}>
            SELECT
          </Button>
          <Button size='small' onClick={onCancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

        {showFileUploadDialog && (<FileUploadDialog
            showModal={showFileUploadDialog}
            path={targetFolder}
            handleClose={closefileUploadDialog }
            multiple={multiple}
            fileTypes={fileTypes.filter(e => e !== 'csonnet_simulation_container')}
            dropped={droppedFiles}
            uploadButtonClicked={handleUploadButtonClicked}
            // setSelected={setSelection}
        />)}
        {showCreateDialog && (<CreateFolder
          showModal={showCreateDialog}
          targetPath={targetFolder}
          handleClose={closeCreateFolderDialog}
          onCreate={refreshFolder}
          // setSelected={setSelection}
      />)}
    </div>
  )

}

export default withReducer('ComboReducer', reducer)(SelectFileDialog);