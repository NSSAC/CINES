import { FuseAnimate } from "@fuse";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Icon, IconButton, Input, Tooltip } from "@material-ui/core"
import withReducer from "app/store/withReducer";
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Breadcrumb from "./Breadcrumb";
import Filelist from "./FileList";
import * as Actions from './store/actions';
import reducer from './store/reducers';
import clsx from 'clsx';
import './FileManagerDialog.css'

function FMPopup({ showModal, handleFMClose }) {

    const dispatch = useDispatch()
    const [targetPath, setTargetPath] = useState('/')
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [showDialog, setshowDialog] = useState(false);

    const onCancel = () => {
        setSearch("")
        setTargetPath("/")
        handleFMClose()
    }

   

    const dialogcontentStyle={
      overflowY:'hidden',
      paddingBottom:'0px',
      paddingTop:'0px',
      overflowX:'hidden',
    }

    function showFileUploadDialog() {
        setshowDialog(true)
    }

    function handleClose() {
        setshowDialog(false)
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
        dispatch(Actions.getFiles(targetPath, 'GET_FILES'))
    });

return (
    <div >
      <Dialog 
        open={showModal}
        onClose={handleFMClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            <div class="flex items-center justify-between">
                <h2>File Manager</h2>
                {/* <FileUpload showModal={showDialog} handleClose={handleClose} /> */}
                         <div class="flex items-end">
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
                            {/* <FuseAnimate className="hidden md:flex flex-col" animation="transition.expandIn" delay={600}>
                              <Tooltip title="Click to Upload" aria-label="add">
                                <Fab className="hidden sm:flex flex-col" color="secondary" aria-label="add" size="small" >
                                    <Icon className="hidden sm:flex flex-col" onClick={showFileUploadDialog}>add</Icon>
                                </Fab>
                              </Tooltip>
                            </FuseAnimate> */}
                </div>
            </div>
            <h5>Please select a file</h5>

        </DialogTitle>
        <DialogContent style={dialogcontentStyle} >
          <Breadcrumb  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)}></Breadcrumb>
         <Filelist search={search}  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)}></Filelist>
        </DialogContent>
        <DialogActions>
          <Button id='selectFile' className="buttonDisabled dialogButton" size='small' onClick={onCancel} color="primary">
            SELECT
          </Button>
          <Button size='small' className="dialogButton" onClick={onCancel} color="primary" autoFocus>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

export default withReducer('fMApp', reducer)(FMPopup);
