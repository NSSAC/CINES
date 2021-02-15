import React, { useEffect, useRef } from 'react';
import { ClickAwayListener, Tooltip, Typography, Icon, IconButton, Input, Fab } from '@material-ui/core';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import FileList from './FileList';
import DetailSidebarHeader from './DetailSidebarHeader';
import DetailSidebarContent from './DetailSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import MainSidebarContent from './MainSidebarContent';
import Breadcrumb from './Breadcrumb';
import { useState } from 'react';
import clsx from 'clsx';
import { FileUpload } from 'app/main/apps/file-manager/FileUpload/FileUploadDialog';
import sciductService from 'app/services/sciductService/sciductService.js'

function FileManagerApp(props) {

    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [editContent, setEditContent] = useState(true);
    const [preview, setPreview] = useState(true);
    const [showDialog, setshowDialog] = useState(false);
    const [checkFlag, setcheckFlag] = useState(false);
    const [prompt, setPrompt] = useState(true);
    var path = window.location.pathname
    var pathEnd = path.charAt(path.length - 1);
    var token = localStorage.getItem('id_token')

    const style = {
        width: "100%",
        flexWrap: "wrap"
    }

    function showSearch() {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }

    function showFileUploadDialog() {
        setshowDialog(true)
    }

    function handleClose() {
        setshowDialog(false)
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
                url: `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file${targetMeta}`,
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


    const dispatch = useDispatch();
    const files = useSelector(({ fileManagerApp }) => fileManagerApp.files);
    const selectedItem = useSelector(({ fileManagerApp }) => files[fileManagerApp.selectedItemId]);
    const pageLayout = useRef(null);
    var targetPath = props.location.pathname.replace("/apps/files", "")
    var path = window.location.pathname
    var pathEnd = path.charAt(path.length - 1)
    var targetMeta = ""
    if (pathEnd === '/') {
        targetMeta = targetPath.slice(0, -1)

    }

    useEffect(() => {
        if (pathEnd === "/") {
            dispatch(Actions.getFiles(targetPath, 'GET_FILES'))
        }
        if (props.location.pathname === "/apps/files/" || token === null || pathEnd !== '/') {
            setcheckFlag(false)
        }
        else {
            targetMeta = targetPath.slice(0, -1).replace("/apps/files", "")
            getMetadata(targetMeta)
        }

        setSearch("")
    }, [dispatch, props, props.location, props.history]);

    return (
        <FusePageSimple

            classes={{
                root: "bg-red",
                header: "h-auto min-h-128 sm:h-auto sm:min-h-160",
                sidebarHeader: "h-auto min-h-128 sm:h-auto sm:min-h-160",
                rightSidebar: "w-320"
            }}
            header={
                <div className="flex flex-col flex-1 p-8 sm:p-12 relative" style={{ width: '100%' }} >
                    <div className="flex items-center justify-between">
                        <div style={{ minWidth: '40%' }}>
                            <div className="flex flex-1 items-center justify-between ">
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-16">
                                        <Icon className="text-18" color="action">home</Icon>
                                        <Icon className="text-16" color="action">chevron_right</Icon>
                                        <Typography color="textSecondary">File Manager</Typography>
                                    </div>
                                    <Typography variant="h6">File Manager</Typography>
                                </div>
                            </div>
                        </div>
                        <div>
                            <FileUpload
                                showModal={showDialog}
                                props={props}
                                handleClose={handleClose} />
                        </div>
                        {preview && (
                            <FuseAnimate animation="transition.expandIn" delay={200}>
                                <span>
                                    <div className={clsx("flex", props.className)}>
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
                        )}
                    </div>
                    <div className="flex flex-1 items-end">
                    {checkFlag && <FuseAnimate className="hidden md:flex flex-col" animation="transition.expandIn" delay={600}>
                            <Tooltip title="Click to Upload" aria-label="add">
                                <Fab color="secondary" aria-label="add" size="medium" className=" hidden sm:flex flex-col absolute bottom-0 d-none d-sm-block  left-0 ml-16 -mb-12 z-999">
                                    <Icon className="hidden sm:flex flex-col" onClick={showFileUploadDialog}>add</Icon>
                                </Fab>
                            </Tooltip>
                        </FuseAnimate>

                        }
                        <FuseAnimate delay={200}>
                            <div>
                                {

                                    <Breadcrumb props={props} path={targetPath} className="flex pl-72 text-16 sm:text-16" styles={style} />
                                }
                            </div>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                <FileList pageLayout={pageLayout} prompt={prompt} setPrompt={(p)=>setPrompt(p)}  editContent={editContent} setEditContent={(p)=>setEditContent(p)}  search={search} setPreview={(p) => setPreview(p)} />
            }
            leftSidebarVariant="temporary"
            leftSidebarHeader={
                <MainSidebarHeader />
            }
            leftSidebarContent={
                <MainSidebarContent />
            }
            rightSidebarHeader={pathEnd == "/" &&
                <DetailSidebarHeader />
            }
            rightSidebarContent={pathEnd == "/" &&
                <DetailSidebarContent  setPrompt={(p)=>setPrompt(p)} editContent={editContent} setEditContent={(p)=>setEditContent(p)}  />
            }
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);
