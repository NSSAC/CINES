import {Icon, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
// import Select from '@material-ui/core/Select';
import { FuseAnimate, FusePageSimple } from '@fuse';
import withReducer from 'app/store/withReducer';

import JobDefinitionFileList from './JobDefinitionFileList';
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import './JobDefinition.css'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import _ from '@lodash';
import {makeStyles, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper';
import CloseIcon from '@material-ui/icons/Close';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import "./JobDefintionListView.css";

const useStyles = makeStyles((theme) => ({
    paper: {
      border: '1px solid',
      
      backgroundColor: "#FFF",
    },
  }));


function JobDefinitionListView(props) {
  const classes = useStyles(props);

    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    // const searchbool= true;
    const [search, setSearch] = useState("");
    const [jobDefinitionACList,setJobDefinitionACList] = useState([])
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const jobDefinitionData = useSelector(
        ({ JobDefinitionApp }) => JobDefinitionApp.all_job_definitions
      );
    const jobDefinitionIdList = jobDefinitionData ? _.map(jobDefinitionData.payload, extractId) : [];
    if(jobDefinitionIdList && jobDefinitionIdList.length > 0){
      localStorage.setItem("jobDefinitionIdList",JSON.stringify(jobDefinitionIdList))
    }


  function extractId(obj) {
    return {
      id: obj.id,
      des: obj.description,
      searchKey: `${obj.id} ${obj.description}`,
    }
  }
  
  async function sleep(ms){
      return new Promise(((resolve) => {
          setTimeout(resolve,ms)
      }))
  }

    async function toViewMore(val) {
      await sleep(500)
      setSearch("")
      await sleep(500)
        
      if (val && localStorage.getItem("vm")) {
        let vm = JSON.parse(localStorage.getItem("vm"));
        let vmJobDef = vm.job_defs;
        let listLoc = JSON.parse(localStorage.getItem("jobDefinitionIdList"))
        let list = listLoc.filter((data) => {
          if (vmJobDef.includes(data.id)) {
            return data;
          }
        });
        setJobDefinitionACList(list);
      } else {
        setJobDefinitionACList([]);
      }
    }


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

    useEffect(()=>{
        return () => dispatch(Actions.clearData());
       /* eslint-disable-next-line */
    },[props.history])

    // function showSearch() {
    //     setSearchbool(true);
    //     document.addEventListener("keydown", escFunction, false);
    // }

    function hideSearch() {
        setSearch("");
        // document.removeEventListener("keydown", escFunction, false);
    }
    
    function handleClickAway() {
        // search === '' && setSearchbool(true);
        setSearch("")
        setOpen(false)
        // document.removeEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
        }
    }

    function navigateHome() {
        history.push('/home/')
    }
 
    function mouseEve(e){
        setOpen(false)
    }

    return (
      <FusePageSimple
        classes={{
          root: "bg-red",
          header: "h-128 min-h-128 jobDefHeader w-full acClick safari_headr abc",
          sidebarHeader: "h-128 min-h-128",
          // content: "contentStyle",
          // sidebarHeader: "h-96 min-h-96 sidebarHeader1",
          // sidebarContent: "sidebarWrapper",
          rightSidebar: "w-320",
          contentWrapper: "jobBody",
        }}
        header={
          <div 
            className="flex  px-8 pt-8 sm:px-12 sm:pt-12 relative flex-col  w-full"
            style={{ rowGap: "1.25rem" }}
            onMouseLeave={(e) => mouseEve(e)}

          >
            <div className="flex items-center w-full">


              <div className="flex">
                <Icon
                  className="text-18 cursor-pointer"
                  color="action"
                  onClick={navigateHome}
                >
                  home
                </Icon>
                <Icon className="text-17" color="action">
                  chevron_right
                </Icon>
                <Typography className="w-max" color="textSecondary">
                  Job Definition
                </Typography>
              </div>


            </div>
            <div className="flex items-center justify-center w-full ">
              {
                <FuseAnimate animation="transition.expandIn" delay={200}>
                  <span className="w-full sm:w-2/5 md:w-2/5 lg:w-2/5 ">
                    <div className={clsx("flex items-center", props.className)}>

                      
                        <ClickAwayListener onClickAway={handleClickAway}>
                          <div className="w-full" >
                            <div className="flex items-end">
                              <Autocomplete
                                id="combo-box-demo"
                                className={`flex cursor-text`}
                                open={open}
                                onOpen={(_) => setOpen(true)}
                                openOnFocus={true}
                                options={
                                  jobDefinitionACList.length > 0
                                    ? jobDefinitionACList
                                    : jobDefinitionIdList
                                }
                                getOptionLabel={(option) =>
                                  option.searchKey || ""
                                }
                                renderOption={(option) => {
                                  return (
                                    <>
                                      <div
                                        className="overflow-y-auto"
                                        style={{ width: "100%" }}
                                      >
                                        {option.id}
                                        <br />
                                        <span style={{ fontSize: "11px" }}>
                                          {option.des}
                                        </span>
                                        <div
                                          style={{
                                            width: "100%",
                                            borderBottom: "1px solid grey",
                                          }}
                                        ></div>
                                      </div>
                                    </>
                                  );
                                }}
                                clearOnBlur={true}
                                debug={true}
                                fullWidth={true}
                                value={search}
                                forcePopupIcon={false}
                                variant="outlined"
                                closeIcon ={<CloseIcon fontSize="small" className="MuiAutocomplete-clearIndicator" style={{display:"none"}}/>}
                                onChange={(_, value) => {
                                  localStorage.removeItem("vm");
                                  setSearch(value ? value["id"] : "");
                                }}
                                //   filterOptions={filterOptions}
                                clearText=""
                                PopperComponent={(props) => (
                                  <Popper
                                    {...props}
                                    placement="bottom"
                                    id="ac"
                                    className="z-50"
                                    onMouseLeave={(e) => mouseEve(e)}
                                  >
                                    {props.children}
                                  </Popper>
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="&nbsp;Search"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </ClickAwayListener>
                      
                    </div>
                  </span>
                </FuseAnimate>
              }
            </div>
          </div>
          // </div>
        }
        content={
          <JobDefinitionFileList
            pageLayout={pageLayout}
            search={search}
            onSetSubCatList={toViewMore}
            {...props}
          />
        }
        leftSidebarVariant="temporary"
        leftSidebarHeader={<MainSidebarHeader />}
        leftSidebarContent={<MainSidebarContent />}
        ref={pageLayout}
        innerScroll
      />
    );
}

export default withReducer('JobDefinitionApp', reducer)(JobDefinitionListView);
