import React, { useEffect, useRef, useState } from 'react';
import { Fab, Icon, IconButton, Typography, Tooltip ,ClickAwayListener,Input} from '@material-ui/core';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import JobDefinitionFileList from './JobDefinitionFileList';
import Paper from '@material-ui/core/Paper';
import DetailSidebarHeader from './DetailSidebarHeader';
import DetailSidebarContent from './DetailSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import MainSidebarContent from './MainSidebarContent';
import Breadcrumb from './Breadcrumb';
import { MyJobFilter } from 'app/main/apps/my-jobs/MyJobFilter-dialog/Filterdialog';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
//import "./JobDefinitionApp.css"
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'inline-block',
        justifyContent: 'start',

        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        display: 'inline-block',
        margin: theme.spacing(0.5),
        paddingTop: "5px"

    },
    dialogwidth: {
        minWidth: "100px !important"
    }
}));

function JobDefinitionApp(props) {

    const dispatch = useDispatch();
    const files = useSelector(({ JobDefinitionApp }) => JobDefinitionApp.jobdefinition);
    const [showDialog, setshowDialog] = useState(false);
    const pageLayout = useRef(null);
    const [flag, setFilterFlag] = useState(false);
    const [searchbool, setSearchbool] = useState(false);
    const [search, setSearch] = useState("");
    const [editContent, setEditContent] = useState(true);
    const [preview, setPreview] = useState(true);

    useEffect(() => {
        let start = 0
        let type = 'creation_date';
        let descShort = true;
        sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
        dispatch(Actions.getJobDefinitionFiles(10, 1, descShort, type, false, false));
        sessionStorage.setItem("count", start);
        sessionStorage.setItem("shortOrder", JSON.stringify(descShort));

        sessionStorage.removeItem("selectedTypeArray")
        sessionStorage.removeItem("preStateValue")
        sessionStorage.removeItem("preJobTypeValue")
    }, [dispatch]);

    function showFileUploadDialog() {
        setshowDialog(true)
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
    
    function handleClickAway() {
        setSearchbool(false);
        document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
        }
    }

    const childRef = useRef();
    function handleClose() {
        setshowDialog(false)
        setFilterFlag(true)
        //  childRef.current.getAlert()
    }
    const classes = useStyles();

    return (
        <FusePageSimple
            classes={{
                root: "bg-red",
                header: "h-96 min-h-96 sm:h-160 sm:min-h-160",
                sidebarHeader: "h-96 min-h-96 sm:h-160 sm:min-h-160",
                rightSidebar: "w-320"
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
                                <Icon className="text-18" color="action">home</Icon>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography style={{ width: '100px' }} color="textSecondary">Job Definition</Typography>
                            </div>

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
            rightSidebarHeader={
                <DetailSidebarHeader />
            }
            rightSidebarContent={
                <DetailSidebarContent />
            }
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('JobDefinitionApp', reducer)(JobDefinitionApp);
