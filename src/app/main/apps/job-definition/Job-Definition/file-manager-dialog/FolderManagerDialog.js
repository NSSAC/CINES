import { FuseAnimate } from "@fuse";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Icon, IconButton, Input, Tooltip,} from "@material-ui/core"
import withReducer from "app/store/withReducer";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "./Breadcrumb";
import Filelist from "./FileList";
import * as Actions from './store/actions';
import reducer from './store/reducers';
import clsx from 'clsx';
import './FileManagerDialog.css'
import CreateFolder from "app/main/file-manager/dialogs/CreateFolderDialog"

function FolderPopup({ showModal, handleFMClose, folderPath, setFolderPath, fileTypes })  {

    const dispatch = useDispatch()
    var formLastPath = localStorage.getItem('formLastPath')
    const files = useSelector(({fMApp}) => fMApp.home);
    const selectedItem = useSelector(({fMApp}) => files[fMApp.selectedItemId]);
    const [targetPath, setTargetPath] = useState(formLastPath ? formLastPath.replace('/home/','/') : '/')
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const breadcrumbArr = targetPath.split("/");
    breadcrumbArr[0]="home"

    const onCancel = () => {
        setSearch("")
        if(folderPath === '')
          setTargetPath("/")
        else 
          setTargetPath(localStorage.getItem('selectedFolder'))
        handleFMClose()
    }

    const onSelect = () => {
      setSearch("")
      setTargetPath(targetPath)
      localStorage.setItem("selectedFolder",targetPath)
      setFolderPath("/home" + targetPath + selectedItem.name)
      localStorage.setItem("formLastPath",'/home' + targetPath)
      handleFMClose()
    }

    
  function showCreateFolderDialog() {
    setShowCreateDialog(true);
  }

  function closeCreateFolderDialog() {
    setShowCreateDialog(false);
  }

    const dialogcontentStyle={
      overflowY:'hidden',
      paddingBottom:'0px',
      paddingTop:'0px',
      overflowX:'hidden',
    }


    function showSearch() {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }


    function hideSearch() {
        setSearchbool(false);
        setSearch("");
        document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
        }
    }

    function handleClickAway() {
        setSearchbool(false);
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

   
    useEffect(() => {
        dispatch(Actions.getHome(targetPath))
                // eslint-disable-next-line
    },[targetPath]);


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
      >
        <DialogTitle id="alert-dialog-title">
            <div className="flex items-center justify-between">
                <h2>File Manager</h2>
                         <div className="flex items-end items-center">
                            <FuseAnimate animation="transition.expandIn" delay={200}>
                                <span>
                                    <div className={clsx("flex")}>
                                        <Tooltip title="Click to search" placement="bottom">
                                            <div onClick={showSearch}>
                                                <IconButton className="w-64 h-64"><Icon>search</Icon></IconButton>    </div>
                                        </Tooltip>
                                        {searchbool && (
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
                                                        <Tooltip title="Click to clear and hide the search box" placement="bottom">
                                                            <IconButton onClick={hideSearch} className="mx-8 mt-8" >
                                                                <Icon>close</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </div>
                                </span>
                            </FuseAnimate>
                            {targetPath !== '/' && (
                <FuseAnimate
                  className="hidden md:flex flex-col"
                  animation="transition.expandIn"
                  delay={600}
                >
                  <Tooltip title="Create folder" aria-label="add">
                    <Fab
                      className="flex flex-col"
                      color="secondary"
                      aria-label="add"
                      size="small"
                      style ={{marginLeft:"3px"}}
                    >
                      <Icon
                        className="flex flex-col"
                        title="Create folder"
                        onClick={showCreateFolderDialog}
                      >
                        folder
                      </Icon>
                    </Fab>
                  </Tooltip>
                </FuseAnimate>
              )}
                </div>
            </div>
            <div><h5>Please click on a row to select a folder path. Or else, click on folder name to navigate to the folder contents.</h5></div>

        </DialogTitle>
        <DialogContent style={dialogcontentStyle} >
          <Breadcrumb  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)}></Breadcrumb>
         <Filelist search={search}  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)} fileTypes={fileTypes}></Filelist>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" id='selectFile'  className="buttonDisabled"  size='small' onClick={onSelect}>
            SELECT
          </Button>
          <Button size='small' onClick={onCancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <CreateFolder
          showModal={showCreateDialog}
          dialogTargetPath={"/home"+targetPath}
          handleClose={closeCreateFolderDialog}
          breadcrumbArr={breadcrumbArr}
          isFolderManager={true}
        />
    </div>
  )

}

export default withReducer('fMApp', reducer)(FolderPopup);
