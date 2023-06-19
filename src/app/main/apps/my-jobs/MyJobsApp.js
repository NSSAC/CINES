import React, { useEffect, useRef, useState } from "react";
import { Fab, Icon, IconButton, Typography, Tooltip } from "@material-ui/core";
import { FuseAnimate, FusePageSimple } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import MyJobsFileList from "./MyJobsFileList";
import DetailSidebarHeader from "./DetailSidebarHeader";
import DetailSidebarContent from "./DetailSidebarContent";
import MainSidebarHeader from "./MainSidebarHeader";
import MainSidebarContent from "./MainSidebarContent";
import { MyJobFilter } from "app/main/apps/my-jobs/MyJobFilter-dialog/Filterdialog";
import { Link } from "react-router-dom";
import "./MyJobsApp.css";
import { useHistory } from "react-router-dom";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function MyJobsApp(props) {
  const dispatch = useDispatch();
  const [showDialog, setshowDialog] = useState(false);
  const pageLayout = useRef(null);
  const [flag, setFilterFlag] = useState(false);
  const [renderFlag, setRenderFlag] = useState(0);
  const [initialPage, setInitialPage] = useState(true);
  /* eslint-disable-next-line */
  const [onload, setOnLoad] = useState(false);
  const [changeState, setChangeState] = useState(0);
  const history = useHistory();
  var path = window.location.pathname;
  var selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
  localStorage.removeItem("resubmitJob")
  const [expandableList, setExpandableList] = useState(true);
  const [expCheck, setExpCheck] = useState(true)
  const [selectedJobDef, setSelectedJobDef] = useState(false)

  const handleExpandableList = (event) => {
    setExpandableList(event.target.checked);
    if(event.target.checked){
      setExpCheck(true)
    } else{
      window.expList = []
      window.expCheckedList = {}
      setExpCheck(false)
    }
  };

  useEffect(() => {
    setOnLoad(true);
    let start = 0;
    let type = "creation_date";
    let descShort = true;
    sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
    dispatch(Actions.getFiles(10, 0, descShort, type, true, expCheck));
    sessionStorage.setItem("count", start);
    sessionStorage.setItem("sortOrder", JSON.stringify(descShort));
    sessionStorage.setItem("type", JSON.stringify(type));
    sessionStorage.removeItem("selectedTypeArray");
    sessionStorage.removeItem("preStateValue");
    sessionStorage.removeItem("preJobTypeValue");
    localStorage.removeItem("resubmitJob")
  }, [dispatch,expCheck]);

  useEffect(() => {
    localStorage.removeItem("resubmitJob")
    var sortOrder = JSON.parse(sessionStorage.getItem("sortOrder"))
    var sortType = JSON.parse(sessionStorage.getItem("type"))
    if (initialPage === true && changeState > 0){
      dispatch(Actions.getFiles(10, 0, sortOrder, sortType, true, expCheck));
    }
    /* eslint-disable-next-line */
  }, [changeState])

  useEffect(() => {
    return () => { dispatch(Actions.clearData()); }
    /* eslint-disable-next-line */
  }, [props.history])

  function showFileUploadDialog() {
    setshowDialog(true);
  }

  function navigateTo(path) {
    if(path === 'home')
     history.push("/home/");
     else
     history.push("/apps/my-jobs/");

  }

  function handleClose() {
    setshowDialog(false);
    setFilterFlag(true);
  }

  return (
    <FusePageSimple
      classes={{
        root: "bg-red",
        header: "header",
        sidebarHeader: "sidebarHeader",
        rightSidebar: "w-auto sidebarStyle",
        contentWrapper: "jobBody"
      }}
      header={
        <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
          {
            <div>
              <MyJobFilter
                showModal={showDialog}
                props={props}
                handleClose={handleClose}
                renderFlag={renderFlag}
                setRenderFlag={(p) => { setRenderFlag(p) }}
                expCheck = {expCheck}
              />
            </div>
          }

          <div className="flex items-center justify-between">
            <div className="flex flex-col" style={{ flexGrow: "1" }}>
              <div className="flex items-center mb-16">
  
                <Icon
                  className="text-18 cursor-pointer"
                  color="action"
                  onClick={()=>navigateTo('home')}
                >
                  home
                </Icon>

                <Icon className="text-16  cursor-pointer" color="action">
                  chevron_right
                </Icon>
                <Typography className="cursor-pointer" color="textSecondary" onClick={()=>navigateTo('jobs')}>
                  My Jobs
                </Typography>
                {path.endsWith('my-jobs/') !== true &&
                  <>
                    <Icon className="text-16" color="action">
                      chevron_right
                    </Icon>
                    <Typography className='' color="textPrimary">
                      {selectedItem.id} 
                    </Typography>
                  </>
                }
              </div>
            </div>

            {path.endsWith('my-jobs/') === true && <div>
              {sessionStorage.getItem("preJobTypeValue") &&
                JSON.parse(sessionStorage.getItem("preJobTypeValue")).length !==
                0 ? (
                <span> Job Type:</span>
              ) : null}
              {sessionStorage.getItem("preJobTypeValue") &&
                JSON.parse(sessionStorage.getItem("preJobTypeValue")).length !== 0
                ? JSON.parse(sessionStorage.getItem("preJobTypeValue")).map(
                  (data, index) => {
                    return (
                      <span key={index} className="chips">
                        {" "}
                        {decodeURIComponent(data
                          .replace("eq(job_definition,re:", "")
                          .replace(")", "")).replace("net.science/", "")}
                      </span>
                    );
                  }
                )
                : null}

              {sessionStorage.getItem("preStateValue") &&
                JSON.parse(sessionStorage.getItem("preStateValue")).length !==
                0 ? (
                <span style={{ marginLeft: "4px" }}> Status:</span>
              ) : null}
              {sessionStorage.getItem("preStateValue") &&
                JSON.parse(sessionStorage.getItem("preStateValue")).length !== 0
                ? JSON.parse(sessionStorage.getItem("preStateValue")).map(
                  (data, index) => {
                    return (
                      <span key={index} className="chips">
                        {data}
                      </span>
                    );
                  }
                )
                : null}
            </div>}

            {path.endsWith('my-jobs/') === true && 
            <FuseAnimate animation="transition.expandIn" delay={200}>
              <Tooltip title="Filter" placement="bottom">
                <IconButton aria-label="search" onClick={showFileUploadDialog}>
                  <Icon>filter_list</Icon>
                </IconButton>
              </Tooltip>
            </FuseAnimate>}
          </div>

          <div className="flex flex-1 items-end justify-between">

            <Tooltip title="Job Definition" placement="top">
              <Link to="/apps/job-definition/">
                <FuseAnimate animation="transition.expandIn" delay={600}>
                  <Fab
                    color="secondary"
                    aria-label="add"
                    className="absolute bottom-0 left-0 ml-16 -mb-28 z-999"
                  >
                    <Icon>add</Icon>
                  </Fab>
                </FuseAnimate>
              </Link>
            </Tooltip>
            {path.endsWith('my-jobs/') === true && 

                  <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={expandableList}
                        onChange={handleExpandableList}
                        name="toggleList"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                    }
                    label="Tree View"
                  />
                  </FormGroup>
              }
          </div>
        </div>
      }
      content={
          <MyJobsFileList
            changeState={changeState}
            setInitialPage={(p) => { setInitialPage(p) }}
            setChangeState={(p) => setChangeState(p)}
            flag={flag}
            pageLayout={pageLayout}
            expandableList = {expandableList}
            expCheck = {expCheck}
            setSelectedJobDef = {(p) => setSelectedJobDef(p)}
            selectedJobDef={selectedJobDef}
          />
      }
      leftSidebarVariant="temporary"
      leftSidebarHeader={<MainSidebarHeader />}
      leftSidebarContent={<MainSidebarContent />}
      rightSidebarHeader={path.endsWith('my-jobs/') === true && <DetailSidebarHeader pageLayout={pageLayout} history={history} />}
      rightSidebarContent={path.endsWith('my-jobs/') === true && <DetailSidebarContent />}
      ref={pageLayout}
      innerScroll
    />
  );
}

export default withReducer("myJobsApp", reducer)(MyJobsApp);
