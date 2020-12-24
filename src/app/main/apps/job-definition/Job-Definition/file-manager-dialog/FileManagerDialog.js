import { FuseAnimate } from "@fuse";
import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Icon, IconButton, Input, Tooltip } from "@material-ui/core"
import withReducer from "app/store/withReducer";
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "./Breadcrumb";
import Filelist from "./FileList";
import * as Actions from './store/actions';
import reducer from './store/reducers';
import clsx from 'clsx';
import './FileManagerDialog.css'
import { FileUpload } from "app/main/apps/file-manager/FileUpload/FileUploadDialog";
import sciductService from "app/services/sciductService";
import { makeStyles } from "@material-ui/styles";

function FMPopup({ showModal, setShowModal, handleFMClose, setFileChosen })  {

    const useStyles = makeStyles({
        table: {
          minWidth: 450,
        },
        customeButton: {
          alignSelf: 'baseline',
          border: '2px solid ',
          color: 'black',
          backgroundColor: 'white',
          width: '100px',
          height: '31px',
    
        },
        input: {
          padding: 10,
          display: "none",
        },
        typeIcon: {
          '&.clear:before': {
            content: "'clear'",
            color: 'white'
          },
          '&:before': {
            content: "'clear'",
            color: '#1565C0'
          }
        }
    })

    const dispatch = useDispatch()
    const files = useSelector(({fMApp}) => fMApp.files);
    const selectedItemId = useSelector(({fMApp}) => fMApp.selectedItemId);
    const selectedItem = useSelector(({fMApp}) => files[fMApp.selectedItemId]);
    const [targetPath, setTargetPath] = useState('/')
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [checkFlag, setcheckFlag] = useState(false);
    const [showDialog, setshowDialog] = useState(false);
    const [uploadFile, setUploadFile] = useState("");
    const classes = useStyles();
    var token = localStorage.getItem('id_token')

    if(uploadFile !== ""){
        files !== {} && Object.values(files).map(node => {
            if(node.name == uploadFile){
                dispatch(Actions.setSelectedItem(node.id))
                setFileChosen("")
                if(selectedItem){
                    localStorage.setItem('selectedSnapFile',JSON.stringify(selectedItem))
                setFileChosen(selectedItem.name)
                setUploadFile("")
                setTargetPath("/")
                setSearch("")
                handleFMClose()
                }
                
            }
        })
    }

    const onCancel = () => {
        setSearch("")
        setTargetPath("/")
        handleFMClose()
    }

    const onSelect = () => {
        setSearch("")
        setTargetPath("/")
        localStorage.setItem('selectedSnapFile',JSON.stringify(selectedItem))
        setFileChosen(selectedItem.name)
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
        handleFMClose()
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

    async function getMetadata(targetMeta) {
        setcheckFlag(false);

        var axios = require('axios');
        if (typeof (token) == "string") {
            var config = {
                method: 'get',
                url: `https://sciduct.bii.virginia.edu/filesvc/file${targetMeta}`,
                headers: {
                    'Accept': 'application/vsmetadata+json',
                    'Authorization': token
                }
            };
        }
        addData()
        async function addData() {
            const request = axios(config)
            await request.then((response) => {
                let metaData = response.data.writeACL
                let ownerId = response.data.owner_id;
                let type = response.data.type;        
                checkPermission(metaData, ownerId, type)



            })

        }
    }
    const checkPermission = (metaData, ownerId, type) => {
        let tokenData = sciductService.getTokenData().teams;
        let fileMetaDate = metaData;
        if (sciductService.getTokenData().sub === ownerId) {

            setcheckFlag(true);
        }
        else {
            tokenData.forEach(element => {
                fileMetaDate.forEach(item => {

                    if (item.includes(element)) {
                        setcheckFlag(true);
                    }
                });
            });
        }
    }

    useEffect(() => {
        dispatch(Actions.getFiles(targetPath, 'GET_FILES'))
        var targetMeta = ""
        if (token === null || !showModal || targetPath == "/") {
            setcheckFlag(false)
        }
        else {
            targetMeta = targetPath.slice(0, -1)
            getMetadata(targetMeta)
        }
    },[targetPath]);

    console.log(uploadFile)

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
                {/* <div id="fileUpload"> */}
                {/* <FileUpload setUploadFile={(p)=>setUploadFile(p)} dialogTargetPath={targetPath} showModal={showDialog} handleClose={handleClose} /> */}
                {/* </div> */}
                         <div class="flex items-end items-center">
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
                            {checkFlag && <FuseAnimate className="hidden md:flex flex-col" animation="transition.expandIn" delay={600}>
                              <Tooltip title="Click to Upload" aria-label="add">
                                <Fab className="hidden sm:flex flex-col" color="secondary" aria-label="add" size="small" >
                                    <Icon className="hidden sm:flex flex-col" onClick={showFileUploadDialog}>add</Icon>
                                </Fab>
                              </Tooltip>
                            </FuseAnimate>}
                </div>
            </div>
            <h5>Please select a file</h5>

        </DialogTitle>
        <DialogContent style={dialogcontentStyle} >
          <Breadcrumb  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)}></Breadcrumb>
         <Filelist search={search}  setSearch={(p)=>setSearch(p)} targetPath={targetPath} setTargetPath={(p)=>setTargetPath(p)}></Filelist>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" id='selectFile' className="buttonDisabled " size='small' onClick={onSelect}>
            SELECT
          </Button>
          <Button size='small' onClick={onCancel}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <FileUpload setUploadFile={(p)=>setUploadFile(p)} dialogTargetPath={targetPath} showModal={showDialog} setShowModal={(p)=>setShowModal(p)} handleClose={handleClose} />
    </div>
  )

}

export default withReducer('fMApp', reducer)(FMPopup);
