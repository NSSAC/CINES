import { FuseAnimate } from "@fuse";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton, Input, Tooltip,} from "@material-ui/core"
import withReducer from "app/store/withReducer";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "./Breadcrumb";
import Filelist from "./FileList";
import * as Actions from './store/actions';
import reducer from './store/reducers';
import clsx from 'clsx';
import './FileManagerDialog.css'

function FolderPopup({ showModal, handleFMClose, folderPath, setFolderPath, fileTypes })  {

    const dispatch = useDispatch()
    const files = useSelector(({fMApp}) => fMApp.home);
    const selectedItem = useSelector(({fMApp}) => files[fMApp.selectedItemId]);
    const [targetPath, setTargetPath] = useState('/')
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");

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
        handleFMClose()
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
    </div>
  )

}

export default withReducer('fMApp', reducer)(FolderPopup);
