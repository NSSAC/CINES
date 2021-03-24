import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconButton, Typography, Tooltip ,ClickAwayListener,Input} from '@material-ui/core';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import JobDefinitionFileList from './JobDefinitionFileList';
// import DetailSidebarHeader from './DetailSidebarHeader';
// import DetailSidebarContent from './DetailSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import MainSidebarContent from './MainSidebarContent';
import { MyJobFilter } from 'app/main/apps/my-jobs/MyJobFilter-dialog/Filterdialog';
import clsx from 'clsx';
import { useHistory } from "react-router-dom";

function JobDefinitionApp(props) {

    const dispatch = useDispatch();
    const [showDialog, setshowDialog] = useState(false);
    const pageLayout = useRef(null);
    const [flag, setFilterFlag] = useState(false);
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const history = useHistory();
    // const [preview, setPreview] = useState(true);
    var path = window.location.pathname

    useEffect(() => {
        let start = 0
        let type = 'creation_date';
        let descShort = true;
        sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
        sessionStorage.setItem("count", start);
        sessionStorage.setItem("shortOrder", JSON.stringify(descShort));
        dispatch(Actions.getJobDefinitionFiles(10, 1, descShort, type, false, false));
        sessionStorage.removeItem("selectedTypeArray")
        sessionStorage.removeItem("preStateValue")
        sessionStorage.removeItem("preJobTypeValue")
    }, [dispatch]);

    // useEffect(()=>{
    //     let start = 0
    //     let type = 'creation_date';
    //     let descShort = true;
    // dispatch(Actions.getJobDefinitionFiles(10, 1, descShort, type, false, false));
    //     return () => dispatch(Actions.clearData());
    // })

    function showSearch() {
        setSearchbool(true);
        document.addEventListener("keydown", escFunction, false);
    }

    function hideSearch() {
        setSearchbool(false);
        setSearch("");
        document.removeEventListener("keydown", escFunction, false);
    }
    
    function handleClickAway() {
        setSearchbool(false);
        document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
        }
    }

    function handleClose() {
        setshowDialog(false)
        setFilterFlag(true)
    }

    function navigateHome() {
        history.push('/home/')
    }

    return (
        <FusePageSimple
            classes={{
                root: "bg-red",
                header: "h-128 min-h-128",
                sidebarHeader: "h-128 min-h-128",
                rightSidebar: "w-320",
                contentWrapper: "jobBody"
            }}
            header={
                <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
                    {<div>
                        <MyJobFilter
                            showModal={showDialog}
                            props={props}
                            handleClose={handleClose} />
                    </div>}

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col" style={{ flexGrow: "1" }}>
                            <div className="flex items-center mb-16">
                                <Icon className="text-18 cursor-pointer" color="action" onClick={navigateHome}>home</Icon>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography style={{ width: '100px' }} color="textSecondary">Job Definition</Typography>
                            </div>
                            <Typography variant="h6">Job Definition</Typography>
                        </div>

                        {/* <div >

                            {
                                sessionStorage.getItem("preJobTypeValue") && JSON.parse(sessionStorage.getItem("preJobTypeValue")).length != 0 ? <span> Job Type :</span> : null
                            }
                            {sessionStorage.getItem("preJobTypeValue") && JSON.parse(sessionStorage.getItem("preJobTypeValue")).length != 0 ? JSON.parse(sessionStorage.getItem("preJobTypeValue")).map((data) => {
                                let icon;
                                return (
                                    <span className="chips">{data}</span>
                                );
                            }) : null}



                            {
                                sessionStorage.getItem("preStateValue") && JSON.parse(sessionStorage.getItem("preStateValue")).length != 0 ? <span style={{ marginLeft: "4px" }}> Status :</span> : null
                            }
                            {sessionStorage.getItem("preStateValue") && JSON.parse(sessionStorage.getItem("preStateValue")).length != 0 ? JSON.parse(sessionStorage.getItem("preStateValue")).map((data) => {
                                let icon;
                                return (
                                    <span className="chips">{data}</span>
                                );
                            }) : null}


                        </div>

                        <FuseAnimate animation="transition.expandIn" delay={200}>
                        <Tooltip title="Filter" placement="bottom">
                            <IconButton aria-label="search">
                                <Icon onClick={showFileUploadDialog}>filter_list</Icon>
                            </IconButton>
                            </Tooltip>
                        </FuseAnimate> */}

{(
                            <FuseAnimate animation="transition.expandIn" delay={200}>
                                <span>
                                {path.endsWith('job-definition/') && <div className={clsx("flex", props.className)}>
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
                                    </div>}
                                </span>
                            </FuseAnimate>
                        )}

                    </div>


                    <div className="flex flex-1 items-end">
                        {/* <FuseAnimate animation="transition.expandIn" delay={600}>
                            <Fab color="secondary" aria-label="add" className="absolute bottom-0 left-0 ml-16 -mb-28 z-999">
                                <Icon>add</Icon>
                            </Fab>
                        </FuseAnimate> */}
                        {/* <FuseAnimate delay={200}>
                            <div>
                                {selectedItem && (
                                    <Breadcrumb selected={selectedItem} className="flex flex-1 pl-72 pb-12 text-16 sm:text-24"/>
                                )}
                            </div>
                        </FuseAnimate> */}
                    </div>
                </div>
            }
            content={
                <JobDefinitionFileList flag={flag} pageLayout={pageLayout} search={search} />
            }
            leftSidebarVariant="temporary"

            leftSidebarHeader={
                <MainSidebarHeader />
            }
            leftSidebarContent={
                <MainSidebarContent />
            }
            
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('JobDefinitionApp', reducer)(JobDefinitionApp);
