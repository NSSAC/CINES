import React, {useEffect, useRef} from 'react';
import {ClickAwayListener,Tooltip, Typography, Icon, IconButton,Input, Fab} from '@material-ui/core';
import {FuseAnimate, FusePageSimple} from '@fuse';
import {useDispatch, useSelector} from 'react-redux';
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
import {FileUpload} from 'app/main/apps/file-manager/FileUpload/FileUploadDialog';


function FileManagerApp(props){

    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [preview, setPreview] = useState(true);
    const [showDialog, setshowDialog] = useState(false);
    var path = window.location.pathname
    var pathEnd=path.charAt(path.length-1)

    const style={
        width : "100%",
        flexWrap : "wrap"
    }

    function showSearch()
    {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }

    function showFileUploadDialog () {
        setshowDialog(true)
    }

    function handleClose()
    {
        setshowDialog(false)
    }

    function hideSearch()
    {
        setSearchbool(false);
        setSearch(""); 
        document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event)
    {
        if ( event.keyCode === 27 )
        {
            hideSearch();
        }
    }

    function handleClickAway()
    {
        setSearchbool(false);
        document.removeEventListener("keydown", escFunction, false);
    }
    
    const dispatch = useDispatch();
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);
    const pageLayout = useRef(null);
    var targetPath = props.location.pathname.replace("/apps/files","")
    var path = window.location.pathname
    var pathEnd=path.charAt(path.length-1)
    var targetMeta = ""
    if(pathEnd === '/')
     targetMeta = targetPath.slice(0, -1)

    useEffect(() => {
        if(pathEnd === "/"){
        dispatch(Actions.getFiles(targetPath, 'GET_FILES'));
       }
        setSearch("")
    }, [dispatch,props,props.location, props.history]);

    return (
        <FusePageSimple
        
            classes={{
                root         : "bg-red",
                header       : "h-auto min-h-128 sm:h-auto sm:min-h-160",
                sidebarHeader: "h-auto min-h-128 sm:h-auto sm:min-h-160",
                rightSidebar : "w-320"
            }}
            header={  
                 <div className="flex flex-col flex-1 p-8 sm:p-12 relative" style={{width: '100%'}} >
                    <div className="flex items-center justify-between">
                        <div style={{minWidth: '40%'}}>
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
                showModal = {showDialog}
                                props={props}
                 handleClose ={handleClose} /> 
                </div>
                     {preview && (
                      <FuseAnimate animation="transition.expandIn" delay={200}>
                         <span>
                            <div className={clsx( "flex", props.className)}>
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
                                                    onChange={(event)=>setSearch(event.target.value)}
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
                    <FuseAnimate animation="transition.expandIn" delay={600}>
                            <Fab color="secondary" aria-label="add" size="medium" className="absolute bottom-0 left-0 ml-16 -mb-12 z-999">
                                <Icon  onClick ={showFileUploadDialog}>add</Icon>
                            </Fab>
                        </FuseAnimate>
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
                <FileList pageLayout={pageLayout} search={search} setPreview={(p)=>setPreview(p)}/>
            }
            leftSidebarVariant="temporary"
            leftSidebarHeader={
                <MainSidebarHeader/>
            }
            leftSidebarContent={
               <MainSidebarContent/>
            }
            rightSidebarHeader={pathEnd=="/" &&
                <DetailSidebarHeader/>
            }
            rightSidebarContent={pathEnd=="/" &&
                <DetailSidebarContent/>
            }
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('fileManagerApp', reducer)(FileManagerApp);
