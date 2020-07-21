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


function FileManagerApp(props){

    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    var path = window.location.pathname
    var pathEnd=path.charAt(path.length-1)
    const width = window.innerWidth >= 767

    function showSearch()
    {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }

    function hideSearch()
    {
        setSearchbool(false);
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
        hideSearch();
    }
    
    const dispatch = useDispatch();
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);
    const pageLayout = useRef(null);
    var targetPath = props.location.pathname.replace("/apps/files","")

    useEffect(() => {
        //FIXME: Figure out how to get the routes base path.
        dispatch(Actions.getFiles(targetPath));
        setSearch("")
    }, [dispatch,props,props.location, props.history]);

    return (
        <FusePageSimple
        
            classes={{
                root         : "bg-red",
                header       : "h-96 min-h-96 sm:h-160 sm:min-h-160",
                sidebarHeader: "h-96 min-h-96 sm:h-160 sm:min-h-160",
                rightSidebar : "w-320"
            }}
            header={  
                 <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
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
                    <FuseAnimate animation="transition.expandIn" delay={200}>
                      <span  >
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
                                                    className="flex flex-1"
                                                    value={search}
                                                    inputProps={{
                                                        'aria-label': 'Search'
                                                    }}
                                                    onChange={(event)=>setSearch(event.target.value)}
                                                    autoFocus
                                                />
                                                <IconButton onClick={hideSearch} className="mx-8">
                                                    <Icon>close</Icon>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </ClickAwayListener>
                                )}
                            </div>
                      </span>
                    </FuseAnimate>
                </div>
                <div className="flex flex-1 items-end">
                    <FuseAnimate animation="transition.expandIn" delay={600}>
                            <Fab color="secondary" aria-label="add" className="absolute bottom-0 left-0 ml-16 -mb-28 z-999">
                                <Icon>add</Icon>
                            </Fab>
                        </FuseAnimate>
                        <FuseAnimate delay={200}>
                            <div>
                                { 

                                    <Breadcrumb width={width} props={props} path={targetPath} className="flex flex-1 pl-72 text-16 sm:text-16"/>
                                }
                            </div>
                        </FuseAnimate>
                    </div>
                </div>
            }
            content={
                <FileList pageLayout={pageLayout} search={search}/>
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
