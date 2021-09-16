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
import { CreateFolder } from "app/main/apps/file-manager/FileUpload/CreateFolderDialog";
import sciductService from "app/services/sciductService";
import { FileService } from "node-sciduct";


function FolderPopup({ showModal, handleFMClose, folderPath, setFolderPath, fileTypes, selectedItems })  {

    const dispatch = useDispatch()
    const files = useSelector(({fMApp}) => fMApp.home);
    const selectedItem = useSelector(({fMApp}) => files[fMApp.selectedItemId]);
    const [targetPath, setTargetPath] = useState(folderPath.trim())
    const [searchbool, setSearchbool] = useState(false);
    const [selectedFlag, setSelectedFlag] = useState(false);
    const [checkFlag, setCheckFlag] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState('');
    const [search, setSearch] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const breadcrumbArr = targetPath.split("/");
    breadcrumbArr[0]="files"

    const onCancel = () => {
        setSearch("")
        if(folderPath === '')
          setTargetPath("/")
        else 
          setTargetPath(localStorage.getItem('selectedFolder'))
        handleFMClose()
    }

    const onSelect = () => {
      dispatch(Actions.getHome(targetPath + selectedItem.name + '/'))
      setSearch("")
      setTargetPath(targetPath)
      localStorage.setItem("selectedFolder",targetPath)
      setFolderPath(targetPath + selectedItem.name + '/')
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

    async function getMetadata(targetMeta, flag) {
      // setSelectedFlag(false);
      const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/`
      const token = localStorage.getItem('id_token');
      const fileServiceInstance = new FileService(url, token)
  
      addData(flag);
      async function addData(flag) {
        fileServiceInstance.show(targetMeta).then((response) => {
          let metaData = response.writeACL;
          let ownerId = response.owner_id;
          let type = response.type;
  
          if (metaData !== undefined)
          checkPermission(metaData, ownerId, type, flag);
        });
      }
    }
    const checkPermission = (metaData, ownerId, type, flag) => {
      let tokenData = sciductService.getTokenData().teams;
      let fileMetaDate = metaData;
      if (sciductService.getTokenData().sub === ownerId) {
       flag === 'parent' ? setCheckFlag(true) : setSelectedFlag(true);
      } else if(sciductService.getTokenData().roles.indexOf('superadmin') !== -1){
        flag === 'parent' ? setCheckFlag(true) : setSelectedFlag(true);
      } else if(tokenData.filter(value => fileMetaDate.includes(value)).length > 0){
        flag === 'parent' ? setCheckFlag(true) : setSelectedFlag(true);
      }
            else
            flag === 'parent' ? setCheckFlag(false) : setSelectedFlag(false)
          
        
    };

    useEffect(() => {
        dispatch(Actions.getHome(targetPath))
        let targetMetaPath = targetPath.slice(0,-1)
        getMetadata(targetMetaPath,'parent')
                // eslint-disable-next-line
    },[targetPath]);

    useEffect(() => {
      let targetMetaPath = targetPath + selectedItemName
      getMetadata(targetMetaPath)
              // eslint-disable-next-line
  },[selectedItemName]);

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
                            {targetPath !== '/' && checkFlag  && (
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
         <Filelist search={search} setSelectedItemName={(p)=>{setSelectedItemName(p)}}  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)} fileTypes={fileTypes} selectedItems={selectedItems}></Filelist>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" id='selectFile' disabled={!selectedFlag} className="buttonDisabled"  size='small' onClick={onSelect}>
            SELECT
          </Button>
          <Button size='small' onClick={onCancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <CreateFolder
          showModal={showCreateDialog}
          dialogTargetPath={targetPath}
          handleClose={closeCreateFolderDialog}
          breadcrumbArr={breadcrumbArr}
          isFolderManager={true}
        />
    </div>
  )

}

export default withReducer('fMApp', reducer)(FolderPopup);
