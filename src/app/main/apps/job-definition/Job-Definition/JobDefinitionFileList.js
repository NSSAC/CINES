import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { Button, LinearProgress, Typography, Grid, TextField } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import Pagination from "@mui/material/Pagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toast } from "material-react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import { FuseAnimate } from "@fuse";

import MetadataInfoDialog from "../../my-jobs/MetadataDialog";
import JobDefinitionForm from "./JobDefinitionForm";
import * as Actions from "./store/actions";

import "./JobDefinitionFileList.css";

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

function JobDefinitionFileList(props) {
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
  const [selectedId, setSelectedId] = useState();
  const [userSelectedPage, setUserSelectedPage] = useState(1);
  const [wrongPageSelectedFlag, setWrongPageSelectedFlag] = useState(false);
  const [goToButtonDisabled, setGoToButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const jobDefinitionData = useSelector(
    ({ JobDefinitionApp }) => JobDefinitionApp.all_job_definitions
  );
  // const selectedItem = useSelector(
  //   ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
  // );
  var path = window.location.pathname;
  var pathArray = window.location.pathname.split("/");
  var pathArrayEnd = pathArray.slice(-1)[0];
  var onloadSpinner = false
  var jobDefinitionList = Object.values(jobDefinitionData);
  var totalRecords = "";

  const matches = useMediaQuery("(min-width:600px)");

  if (jobDefinitionList.length !== 0) {
    onloadSpinner = true;
    if (jobDefinitionList[2]['content-range'] !== undefined) {
      totalRecords = jobDefinitionList[2]["content-range"].split("/")[1];
    }

    jobDefinitionList = jobDefinitionList[1];
    var searchResult = jobDefinitionList.filter((data) => {
      if (
        data.id !== "" &&
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
    if (jobDefinitionList.length > 0 && selectedFlag) {
      var selectedId = jobDefinitionList[0].id;
      setSelectedId(selectedId);
    }
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
    return /^-?[\d.]+(?:e-?\d+)?$/.test(input);
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
    setSelectedId(selectedId);
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
                {searchResult
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    (currentPage - 1) * rowsPerPage + rowsPerPage
                  ).map((row, ind, arr) => {
                  // lengthOfRow = arr.length;
                  return (
                    <React.Fragment key={row.id}>
                      <div className={classes.root}>
                        <Grid
                          className={row.id === selectedId ? "selceted-row" : ""}
                          onClick={() => onRowClick(row.id)}
                          style={{ borderBottom: "1px solid lightgrey" }}
                          container
                          spacing={1}
                        >
                          <Grid container item xs={9} sm={10}>
                            <Grid item xs={4} style={{ padding: "5px" }}>
                              <Typography>Name</Typography>
                              <Typography
                                style={{ fontWeight: "700", wordBreak: "break-word" }}
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
                          <Grid item xs={3} sm={2} style={{ paddingTop: "15px" }}>
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
                })}
              </>
            ) : (
              <LinearProgress className="w-xs" color="secondary" />
            )}
          </FuseAnimate>

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
                <></>
              )}
            </span>
          </div>

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
