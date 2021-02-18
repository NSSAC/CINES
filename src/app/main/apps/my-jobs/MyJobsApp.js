import React, { useEffect, useRef, useState } from 'react';
import { Fab, Icon, IconButton, Typography, Tooltip } from '@material-ui/core';
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
import { MyJobFilter } from 'app/main/apps/my-jobs/MyJobFilter-dialog/Filterdialog';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from "react-router-dom";
import "./MyJobsApp.css"
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

function MyJobsApp(props) {
    const dispatch = useDispatch();
    const [showDialog, setshowDialog] = useState(false);
    const pageLayout = useRef(null);
    const [flag, setFilterFlag] = useState(false);

    useEffect(() => {
        let start = 0
        let type = 'creation_date';
        let descShort = true;
        sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
        dispatch(Actions.getFiles(10, 0, descShort, type, false, false));
        sessionStorage.setItem("count", start);
        sessionStorage.setItem("sortOrder", JSON.stringify(descShort));
        sessionStorage.setItem("type", JSON.stringify(type));
        sessionStorage.removeItem("selectedTypeArray")
        sessionStorage.removeItem("preStateValue")
        sessionStorage.removeItem("preJobTypeValue")
    }, [dispatch]);

    function showFileUploadDialog() {
        setshowDialog(true)
    }

    function handleClose() {
        setshowDialog(false)
        setFilterFlag(true)
    }

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
                                <Typography style={{ width: '100px' }} color="textSecondary">My Jobs</Typography>
                            </div>

                        </div>

                        <div >

                            {
                                sessionStorage.getItem("preJobTypeValue") && JSON.parse(sessionStorage.getItem("preJobTypeValue")).length != 0 ? <span> Job Type:</span> : null
                            }
                            {sessionStorage.getItem("preJobTypeValue") && JSON.parse(sessionStorage.getItem("preJobTypeValue")).length != 0 ? JSON.parse(sessionStorage.getItem("preJobTypeValue")).map((data) => {
                                let icon;
                                return (
                                    <span className="chips">{data}</span>
                                );
                            }) : null}



                            {
                                sessionStorage.getItem("preStateValue") && JSON.parse(sessionStorage.getItem("preStateValue")).length != 0 ? <span style={{ marginLeft: "4px" }}> Status:</span> : null
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
                                <IconButton aria-label="search"  onClick={showFileUploadDialog}>
                                    <Icon>filter_list</Icon>
                                </IconButton>
                            </Tooltip>
                        </FuseAnimate>
                    </div>


                    <div className="flex flex-1 items-end">
                    <Tooltip title="Create" placement="top">
                         <Link to="/apps/job-definition/">
                        <FuseAnimate animation="transition.expandIn" delay={600}>
                            <Fab color="secondary"  aria-label="add" className="absolute bottom-0 left-0 ml-16 -mb-28 z-999">
                            <Icon>add</Icon>
                            </Fab>
                        </FuseAnimate>
                            </Link> 
                            </Tooltip>
                    </div>
                </div>
            }
            content={
                <FileList flag={flag} pageLayout={pageLayout} />
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

export default withReducer('myJobsApp', reducer)(MyJobsApp);
