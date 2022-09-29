import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Button, LinearProgress, Typography, Grid, TextField } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/styles";
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { toast } from "material-react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, withRouter, useRouter } from "react-router-dom";
import { FuseAnimate } from "@fuse";
import MetadataInfoDialog from "../../my-jobs/MetadataDialog";
import JobDefinitionForm from "./JobDefinitionForm";
import * as Actions from "./store/actions";
import jobCategoryJSON from "./JobCategory.js";
import "./JobDefinitionFileList.css";
import Divider from '@material-ui/core/Divider';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);




function JobDefinitionFileList(props) {
  // console.log("subCatList***********",props.onSetSubCatList)
  const [page, setPage] = useState(0);
  // const [searchPage, setSearchPage] = useState(0);
  // const [searchRowperPage, setSearchRowperPage] = useState(10);
  const [rowsPerPage] = useState(10);
  const [spinnerFlag, setSpinnerFlag] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState(true);
  const [searchString, setPreviousString] = useState("");
  const [showDialog, setshowDialog] = useState(false);
  const [standardOut] = useState("");
  const [headerTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedId, setSelectedId] = useState();
  const [userSelectedPage, setUserSelectedPage] = useState(1);
  const [wrongPageSelectedFlag, setWrongPageSelectedFlag] = useState(false);
  const [goToButtonDisabled, setGoToButtonDisabled] = useState(false);
  const [displayCategoryList, setDisplayCategoryList] = useState(false)
  const [currCategory, setCurrCategory] = useState("")
  const dispatch = useDispatch();
  const jobDefinitionData = useSelector(
    ({ JobDefinitionApp }) => JobDefinitionApp.all_job_definitions
  );
  // console.log("jobDefinitionData*************",jobDefinitionData)
  // const selectedItem = useSelector(
  //   ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
  // );
  var path = window.location.pathname;
  var pathArray = window.location.pathname.split("/");
  var pathArrayEnd = pathArray.slice(-1)[0];
  var onloadSpinner = false
  var jobDefinitionList = Object.values(jobDefinitionData);
  var totalRecords = "";
  const max_tasks = jobCategoryJSON.max_tasks_per_category
  const matches = useMediaQuery("(min-width:600px)");
  const query = window.location.search;
  const [ locationKeys, setLocationKeys ] = useState([])

  const history = useHistory()

  if (jobDefinitionList.length !== 0) {
    onloadSpinner = true;
    if (jobDefinitionList[2]['content-range'] !== undefined) {
      totalRecords = jobDefinitionList[2]["content-range"].split("/")[1];
    }
    
    jobDefinitionList = jobDefinitionList[1];
    if(query){
      let a = query.split(",")
      let b = a[1].split(")")[0]
      let c = b.split("_").join(" ").toLowerCase()
      let d = jobCategoryJSON.categories.filter((obj) => obj.label.toLowerCase().includes(c))
      localStorage.setItem("vm",JSON.stringify(d[0]))
    }

    if(!localStorage.getItem("vm")){
      var searchResult = jobDefinitionList.filter((data) => {
        if (
          (data.id !== "" &&  data.id !== undefined && data.description !== null) &&
          (props.search === "" ||
            data.id.toLowerCase().includes(props.search.toLowerCase()))
        )
          return data;
  
        if (
          (data.description !== "" && data.description !== undefined) &&
          (props.search === "" ||
            data.description.toLowerCase().includes(props.search.toLowerCase()))
        )
          return data;
        return null;
      });
        displayResult(searchResult);
    }else { 

      if(props.search !== ""){
        var searchResult = jobDefinitionList.filter((data) => {
          if (
            (data.id !== "" &&  data.id !== undefined && data.description !== null) &&
            (props.search === "" ||
              data.id.toLowerCase().includes(props.search.toLowerCase()))
          )
            return data;
    
          if (
            (data.description !== "" && data.description !== undefined) &&
            (props.search === "" ||
              data.description.toLowerCase().includes(props.search.toLowerCase()))
          )
            return data;
          return null;
        });
          displayResult(searchResult);
      }
      else if (jobDefinitionList.length !== 0) {
        onloadSpinner = true;
        let vm = JSON.parse(window.localStorage.getItem('vm'))
        let vmJobDef = vm.job_defs;
        searchResult = jobDefinitionList.filter((data) => {
          if (vmJobDef.includes(data.id)) {
            return data;
          }
        });
      }
    }


  }


  useEffect(() => {
    if(window.location.pathname == "/apps/job-definition/"){
      if (window.location.search === "") {
        setDisplayCategoryList(false);
        props.onSetSubCatList(false)  
        localStorage.removeItem("vm")
      }
    }
  }, [window.location.search])

  
  async function sleep(ms){
    return new Promise(((resolve) => {
        setTimeout(resolve,ms)
    }))
}

  useEffect(() => {
    if(localStorage.getItem("vm")){
      let vm = JSON.parse(localStorage.getItem("vm"))
      setDisplayCategoryList(true);
      setCurrCategory(vm.label);
      props.onSetSubCatList(true)  
      if(!window.location.search.includes(vm.query)){
        history.push(`?${vm.query}`)
      }
    }
  },[localStorage.getItem("vm")]);

  function displayResult(result) {
    if (result.length === 1) {
      localStorage.setItem("selectedJobDefinition", JSON.stringify(result));
      var target = window.location.pathname + result[0]["id"];
      props.history.push(target);
    }
  }

  async function callJobType(eleId, vm) {
    if (!vm) {
      if (jobDefinitionList.length !== 0) {
        onloadSpinner = true;

        var searchResult = jobDefinitionList.filter((data) => {
          if (
            data.id !== "" &&
            data.id !== undefined &&
            data.description !== null &&
            (eleId === "" ||
              data.id.toLowerCase().includes(eleId.toLowerCase()))
          ) {
            return data;
          }
        });
        displayResult(searchResult);
      }
    } else {
      localStorage.removeItem("vm")
      setDisplayCategoryList(true);
      setCurrCategory(vm.label);
      props.onSetSubCatList(true)
      if (jobDefinitionList.length !== 0) {
        onloadSpinner = true;
        localStorage.setItem("vm",JSON.stringify(vm))
        await sleep(500)
      }
    }
  }

  function displayCategories(){
    let newurl  = window.location.protocol + "//" + window.location.host + window.location.pathname ;
    window.history.pushState({path:newurl},'',newurl)
    localStorage.removeItem("vm")
    setDisplayCategoryList(false)
    props.onSetSubCatList(false)
  }

  function onFindDescription(ele){
    let des =  jobDefinitionList.find(
      (ob) => ob.id === ele
    )
    console.log(des.description)
  }

  // const hereButton = {
  //   fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  //   fontSize: '15px',
  //   fontWeight: '500',
  //   color: 'deepskyblue'
  // }

  const selectButtonStyle = {
    backgroundColor: "#122230",
    fontSize: "12.5px",
    marginLeft: "5px",
  };

  const selectButtonStyleMob = {
    backgroundColor: "#122230",
    fontSize: '11.5px',
    minWidth: '38px'
  };

  const classes = useStyles();

  useEffect(() => {
    setSpinnerFlag(false)
    setPreviousString(props.search);
    if (props.search !== searchString) {
      // setSearchPage(0);
      // setSearchRowperPage(10);
      setCurrentPage(1);
    }
    setSpinnerFlag(false);
    if (jobDefinitionList.length !== 0) {
    }
    if (JSON.parse(sessionStorage.getItem("resetPage"))) {
      let currentPage = 0;
      setPage(currentPage);
    }
    // if (jobDefinitionList.length > 0 && selectedFlag) {
    //   var selectedId = jobDefinitionList[0].id;
    //   setSelectedId(selectedId);
    // }
  },[jobDefinitionList, props.search, searchString, selectedFlag]);

  useEffect(() => {
    if (document.getElementsByClassName('jobBody').length > 0) {
      document.getElementsByClassName('jobBody')[0].scrollTo(0, 0)
      setTimeout(() => {
        document.getElementsByClassName('jobBody')[0].scrollTop = document.getElementsByClassName('jobBody')[0].scrollHeight; 
        setSpinnerFlag(false);
      }, 10);
    }
  }, [page])

  useEffect(() => {
    if (userSelectedPage === "" || Number(userSelectedPage) === currentPage) {
      setGoToButtonDisabled(true);
    } else {
      setGoToButtonDisabled(false);
    }
  }, [currentPage, userSelectedPage]);

  const handleChangePage = (event, value) => {
    setPage(value);
    setCurrentPage(value);
    setUserSelectedPage(value);
  };

  const onPageChange = (event) => {
    setUserSelectedPage(event.target.value);
    setWrongPageSelectedFlag(false);
  };

  useEffect(() => {
    setWrongPageSelectedFlag(false);
  }, [currentPage, searchResult, userSelectedPage]);

  useEffect(() => {
    setUserSelectedPage(1);
  }, [searchString]);

  const onKeyDownPageChange = (event) => {
    if (!matches && event.key === "Enter") {
      if (userSelectedPage) {
        handleSelectedPageClick();
      } else {
        setWrongPageSelectedFlag(true);
        setUserSelectedPage(currentPage);
      }
    }
  };

  const isNumberValidation = (input) => {
    return /^-?[\d]+(?:e-?\d+)?$/.test(input);
  };

  const handleSelectedPageClick = () => {
    let records = 0;
    props.search !== searchString
      ? (records = Math.ceil(totalRecords / rowsPerPage))
      : (records = Math.ceil(searchResult.length / rowsPerPage));

    if (userSelectedPage) {
      if (
        Number(userSelectedPage) > records ||
        Number(userSelectedPage) < 1 ||
        isNumberValidation(userSelectedPage) !== true
      ) {
        setWrongPageSelectedFlag(true);
        setUserSelectedPage(currentPage);
      } else {
        setCurrentPage(Number(userSelectedPage));
        handleChangePage(undefined, Number(userSelectedPage));
      }
    }
  };

  // const searchHandleChangePage = (event, newPage) => {
  //   let currentPage = searchPage + 1;
  //   setSearchPage(currentPage);
  // };

  const onSelectClick = (row, e) => {
    e.stopPropagation()
    localStorage.setItem("selectedJobDefinition", JSON.stringify(row));
    var target = window.location.pathname + row.id;
    props.history.push(target);
  };

  // const searchFetchPreviousSetData = () => {
  //   let currentPage = searchPage - 1;
  //   setSearchPage(currentPage);
  // };

  // const fetchPreviousSetData = () => {
  //   let currentPage = page - 1;
  //   setPage(currentPage);
  // };

  function onRowClick(selectedId) {
    setSelectedFlag(false);
    // setSelectedId(selectedId);
    dispatch(Actions.setSelectedItem(selectedId));
  }

  // const openDialog = (data) => {
  //   setshowDialog(true);
  //   setStandardOut(data[1]);
  //   setHeaderTitle(data[0]);
  // }

  const handleClose = () => {
    setshowDialog(false);
  };


  function moduleIsAvailable() {
    try {
      require.resolve(`./static-forms/${pathArrayEnd}/`);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (path.endsWith('job-definition/') === false) {
    var selectedJobDefinition = JSON.parse(
      localStorage.getItem("selectedJobDefinition")
    );
    var StaticJobDefinitionForm = null;
    var formExists = moduleIsAvailable();
    if (formExists) {
      StaticJobDefinitionForm = React.lazy(() =>
        import(`./static-forms/${pathArrayEnd}/`)
      );
    }

    if (jobDefinitionList.length === 0)
      return (
        <div className="flex flex-1 flex-col items-center justify-center mt-40">
          <Typography className="text-20 mt-16" color="textPrimary">
            Loading Form
          </Typography>
          <LinearProgress className="w-xs" color="secondary" />
        </div>
      );
    else {
      return formExists ? (
        <StaticJobDefinitionForm resubmit={props.location.state} {...props}></StaticJobDefinitionForm>
      ) : (
        <JobDefinitionForm
          state={selectedJobDefinition} resubmit={props.location.state} {...props}
        ></JobDefinitionForm>
      );
    }
  }
  if (spinnerFlag === true)
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">
          Loading
        </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );
  if (
    Object.values(jobDefinitionData).length > 0 &&
    Object.values(jobDefinitionData) !== undefined &&
    searchResult.length > 0
  )
    return (
      <>
        {ReactDOM.createPortal(
          <div>
            {wrongPageSelectedFlag && (
              <div>
                {" "}
                {toast.error(
                  `Please select a page between 1 and ${
                    props.search !== searchString
                      ? Math.ceil(totalRecords / rowsPerPage)
                      : Math.ceil(searchResult.length / rowsPerPage)
                  }.`
                )}
              </div>
            )}
          </div>,
          document.getElementById("portal")
        )}
        <div>
          <MetadataInfoDialog
            opendialog={showDialog}
            closedialog={handleClose}
            standardout={standardOut}
            headertitle={headerTitle}
          ></MetadataInfoDialog>

          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            {jobDefinitionList.length > 0 ? (
              <>
                {displayCategoryList ? (
                  searchResult
                    .slice(
                      (currentPage - 1) * rowsPerPage,
                      (currentPage - 1) * rowsPerPage + rowsPerPage
                    )
                    .map((row, ind, arr) => {
                      // lengthOfRow = arr.length;
                      return (
                        <React.Fragment key={row.id}>
                          {ind === 0 && (
                            <Grid
                              container
                              xs={12}
                              sm={12}
                              md={12}
                              style={{ margin: "1.5rem" }}
                            >
                              <div className="flex flex-row justify-start items-center ">
                                <span
                                  className="font-semibold hover:underline cursor-pointer text-sm sm:text-base  md:text-lg  lg:text-lg "
                                  onClick={displayCategories}
                                  // style={{ color: "#074da4" }}
                                >
                                  Category
                                </span>
                                &nbsp;&nbsp;
                                <ArrowForwardIosIcon fontSize="small" />
                                <span className="font-semibold text-sm sm:text-base  md:text-lg  lg:text-lg ">
                                  {currCategory}
                                </span>
                              </div>
                          {/* <Divider className="flex-none mx-5" /> */}

                            </Grid>
                          )}
                          <Divider className="flex-none mx-5" />

                          <div className={classes.root}>
                            <Grid
                              // className={
                              //   row.id === selectedId ? "selceted-row" : ""
                              // }
                              onClick={() => onRowClick(row.id)}
                              // style={{ borderBottom: "1px solid lightgrey" }}
                              container
                              spacing={1}
                            >
                              <Grid container item xs={9} sm={10}>
                                <Grid item xs={4} style={{ padding: "5px" }}>
                                  <Typography>Name</Typography>
                                  <Typography
                                    style={{
                                      fontWeight: "700",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {row.id}
                                  </Typography>
                                </Grid>
                                <Grid item xs={4} style={{ padding: "5px" }}>
                                  {/* <Typography>Created By</Typography>
                              <Typography style={{ fontWeight: "700" }}>
                                {row.created_by}
                              </Typography> */}
                                </Grid>
                                <Grid item xs={4} style={{ padding: "5px" }}>
                                  <Typography>Last Updated</Typography>
                                  <Typography style={{ fontWeight: "700" }}>
                                    {
                                      row.update_date
                                        .replace(/T|Z/g, "  ")
                                        .split(".")[0]
                                    }
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} style={{ padding: "5px" }}>
                                  <Typography>Description</Typography>
                                  <span style={{ fontWeight: "700" }}>
                                    {row.description}
                                    {/* {row.output_files && row.output_files.type !== 'folder' && (typeof (row.output_files.type) === 'string' ? ` This task outputs a file of type ${row.output_files.type} in your chosen location ` : ` This task outputs a file of type ${Object.values(row.output_files.type)[0]} in your chosen location `)}
                                {row.output_files && row.output_files.contents && ` This task outputs files of type ${(row.output_files.contents.map(a => a.type)).toString()} in your chosen location. `}
                                {row.output_files && row.output_schema && row.output_schema.properties && ` along with output data attached to the job. Click `}
                                {!row.output_files && row.output_schema && row.output_schema.properties && ` This task outputs data attached to the job. Click `} */}
                                  </span>
                                  {/* {row.output_schema && row.output_schema.properties && <button className='cursor-pointer' style={hereButton} onClick={() => openDialog(['Output schema', row.output_schema])}> here </button>}
                              <span style={{ fontWeight: "700" }}>{row.output_schema && row.output_schema.properties && ' to see the schema of the output.'} </span> */}
                                </Grid>
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                sm={2}
                                style={{ paddingTop: "15px" }}
                              >
                                <Button
                                  variant="contained"
                                  ////size="small"
                                  //color="primary"
                                  className={classes.button}
                                  onClick={(e) => onSelectClick(row, e)}
                                >
                                  Select
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        </React.Fragment>
                      );
                    })
                ) : (
                  <Grid container direction="row" spacing={3} >
                    {jobCategoryJSON.categories.map((obj) => {
                      return (
                        <Grid item sm={6} md={4} xs={12} key={obj.label}>
                          <div
                            className="flex flex-col justify-start "
                            style={{
                              backgroundColor: "#77e5ff61",
                              // height: "163px"
                              // flex: '1 1 0%',
                              borderRadius: "0.375rem",
                            }}
                          >
                            <div className="flex justify-center py-3"  >
                              <Typography
                                className="text-lg font-bold"
                                color="inherit"
                              >
                                {obj.label}
                              </Typography>
                            </div>

                            <Divider className="flex-none mx-5" />

                            <div
                              className="flex flex-col px-5 overflow-auto "
                              // style={{flexGrow: "1"}} 
                              style={{ height: `${22 * (max_tasks*2)}px` }}
                            > 
                            {obj.job_defs.map((ele,idx) => (
                                  <LightTooltip
                                    title={
                                      jobDefinitionList.find(
                                        (ob) => ob.id === ele)['description']
                                    }
                                    key={ele}
                                  > 

                                    <div className="truncate ...  bullet"
                                      style={{ color: "rgb(18,34,48)", display: `${idx > 4 ? 'none': 'unset'}`  }}
                                      onClick={() => callJobType(ele, null)} >

                                      <div className="truncate ...  hover:underline inline">
                                        <span className="text-xs cursor-pointer w-full ">{`${ele.split("/")[0]}/`}</span>
                                        <p className="truncate ... text-base cursor-pointer w-full"  style={{ paddingLeft: "20px"}}> {ele.substring(ele.indexOf("/")+1)}</p>
                                      </div>  
                                     
                                    </div>
                                  </LightTooltip>
                                ))}
                            </div>
                            {/* VIEW MORE */}
                            {/* <div className="flex justify-end items-end h-32">
                              <Button
                                size="small"
                                color="primary"
                                className="capitalize "
                                onClick={() => callJobType(null, obj)}
                              >
                                
                                  <a
                                    className="cursor-pointer font-bold"
                                    style={{ color: "rgb(9 79 159)" }}
                                  >
                                    View More
                                  </a>
                                <NavigateNextIcon
                                  style={{
                                    color: "rgb(21, 101, 192)",
                                    margin: "0",
                                  }}
                                />
                              </Button>
                            </div> */}
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </>
            ) : (
              <LinearProgress className="w-xs" color="secondary" />
            )}
          </FuseAnimate>
          {displayCategoryList && (
            <div className="pagination-footer">
              {matches ? (
                <Pagination
                  className="pagination-bar"
                  color="primary"
                  count={
                    props.search !== searchString
                      ? Math.ceil(totalRecords / rowsPerPage)
                      : Math.ceil(searchResult.length / rowsPerPage)
                  }
                  page={currentPage}
                  onChange={handleChangePage}
                />
              ) : (
                <Pagination
                  className="pagination-bar"
                  color="primary"
                  defaultPage={1}
                  siblingCount={0}
                  size="small"
                  count={
                    props.search !== searchString
                      ? Math.ceil(totalRecords / rowsPerPage)
                      : Math.ceil(searchResult.length / rowsPerPage)
                  }
                  page={currentPage}
                  onChange={handleChangePage}
                />
              )}
              <span className="goToPage_span">
                <label>Go to page:</label>
                <TextField
                  className={
                    matches ? "goToPagination" : "goToPaginationForMobile"
                  }
                  id="GoToPagination"
                  variant="outlined"
                  type="number"
                  value={userSelectedPage}
                  onChange={onPageChange}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max:
                        props.search !== searchString
                          ? Math.ceil(totalRecords / rowsPerPage)
                          : Math.ceil(searchResult.length / rowsPerPage),
                    },
                  }}
                  onKeyDown={onKeyDownPageChange}
                />
                {matches ? (
                  <Button
                    className="goToPaginationButton"
                    variant="contained"
                    style={selectButtonStyle}
                    onClick={handleSelectedPageClick}
                    disabled={goToButtonDisabled}
                  >
                    Go
                  </Button>
                ) : (
                  <Button
                    className="goToPaginationButton"
                    variant="contained"
                    style={selectButtonStyleMob}
                    onClick={handleSelectedPageClick}
                    disabled={goToButtonDisabled}
                  >
                    Go
                  </Button>
                )}
              </span>
            </div>
          )}

          {/* {props.search === "" ? (
            <div>
              <Button
                disabled={page * rowsPerPage + 1 === 1}
                className={"next-button"}
                color="primary"
                variant="contained"
                onClick={fetchPreviousSetData}
              >
                Previous
              </Button>
              <span className={"count-info"}>
                Items {page * rowsPerPage + 1}-{page * rowsPerPage + lengthOfRow}{" "}
                /{totalRecords}
              </span>
              <Button
                disabled={
                  page * searchRowperPage + lengthOfRow === searchResult.length
                }
                color="primary"
                className={"next-button"}
                variant="contained"
                onClick={handleChangePage}
              >
                Next
              </Button>
              <span className={"count-info"}>Page - {page + 1}</span>
            </div>
          ) : (
            <div>
              <Button
                disabled={searchPage * searchRowperPage + 1 === 1}
                className={"next-button"}
                color="primary"
                variant="contained"
                onClick={searchFetchPreviousSetData}
              >
                Previous
              </Button>
              <span className={"count-info"}>
                Items {searchPage * searchRowperPage + 1}-
                {searchPage * searchRowperPage + lengthOfRow} /
                {searchResult.length}
              </span>
              <Button
                disabled={
                  searchPage * searchRowperPage + lengthOfRow ===
                  searchResult.length
                }
                color="primary"
                className={"next-button"}
                variant="contained"
                onClick={searchHandleChangePage}
              >
                Next
              </Button>
              <span className={"count-info"}>Page - {searchPage + 1}</span>
            </div>
          )} */}
        </div>
      </>
    );
  else if (jobDefinitionList.length === 0 && onloadSpinner) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-20">
        <Typography className="text-18 mt-16" color="textPrimary">
          This folder is empty.
        </Typography>
      </div>
    );
  }

  else if (Object.values(jobDefinitionData).length === 0)
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    )




  else if (searchResult.length === 0)
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-20">
        <Typography className="text-18 mt-16" color="textPrimary">
          No match found for "{props.search}". Please try finding something
          else.
        </Typography>
      </div>
    );
}

export default withRouter(JobDefinitionFileList);
