/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Typography,
  LinearProgress,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import * as Actions from "./store/actions";
import "./JobDefinitionFileList.css";
import { withRouter } from "react-router-dom";
import JobDefinitionForm from "./JobDefinitionForm";
import { SpaTwoTone } from "@material-ui/icons";
import MetadataInfoDialog from "../../my-jobs/MetadataDialog";

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
  const [page, setPage] = React.useState(0);
  const [searchPage, setSearchPage] = React.useState(0);
  const [searchRowperPage, setSearchRowperPage] = React.useState(10);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [spinnerFlag, setSpinnerFlag] = useState(true);
  const [selectedFlag, setSelectedFlag] = useState(true);
  const [searchString, setPreviousString] = useState("");
  const [showDialog, setshowDialog] = useState(false);
  const [standardOut, setStandardOut] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  var lengthOfRow;
  const dispatch = useDispatch();
  const jobDefinitionData = useSelector(
    ({ JobDefinitionApp }) => JobDefinitionApp.jobdefinition
  );
  const selectedItem = useSelector(
    ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
  );
  var path = window.location.pathname;
  var pathArray = window.location.pathname.split("/");
  var pathArrayEnd = pathArray.slice(-1)[0];
  var onloadSpinner = false
  var jobDefinitionList = Object.values(jobDefinitionData);
  var totalRecords = "";
  const [selectedId, setSelectedId] = useState();
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

    });

  }

  const hereButton = {
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
    fontSize: '15px',
    fontWeight: '500',
    color: 'deepskyblue'
  }

  const classes = useStyles();
  useEffect(() => {
    setSpinnerFlag(false)
    setPreviousString(props.search);
    if (props.search !== searchString) {
      setSearchPage(0);
      setSearchRowperPage(10);
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
  });

  useEffect(() => {
    if (document.getElementsByClassName('jobBody').length > 0) {
      document.getElementsByClassName('jobBody')[0].scrollTo(0, 0)
      setTimeout(() => {
        document.getElementsByClassName('jobBody')[0].scrollTop = document.getElementsByClassName('jobBody')[0].scrollHeight; setSpinnerFlag(false)
      }, 10);
    }
  }, [page])

  const handleChangePage = (event, newPage) => {
    setSpinnerFlag(true);
    sessionStorage.setItem("resetPage", JSON.stringify(false));

    let currentPage = page + 1;
    setPage(currentPage);
  };
  const searchHandleChangePage = (event, newPage) => {
    let currentPage = searchPage + 1;
    setSearchPage(currentPage);
  };


  const onSelectClick = (row, e) => {
    e.stopPropagation()
    localStorage.setItem("selectedJobDefinition", JSON.stringify(row));
    var target = window.location.pathname + row.id;
    props.history.push(target);
  };

  const searchFetchPreviousSetData = () => {
    let currentPage = searchPage - 1;
    setSearchPage(currentPage);
  };
  const fetchPreviousSetData = () => {
    let currentPage = page - 1;
    setPage(currentPage);
  };
  function onRowClick(selectedId) {
    setSelectedFlag(false);
    setSelectedId(selectedId);
    selectedId = selectedId;
    dispatch(Actions.setSelectedItem(selectedId));
  }

  const openDialog = (data) => {
    setshowDialog(true);
    setStandardOut(data[1]);
    setHeaderTitle(data[0]);
  }

  const handleClose = () => {
    setshowDialog(false);
  };


  function moduleIsAvailable() {
    try {
      require.resolve(`./static-forms/${pathArrayEnd}`);
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
        import(`./static-forms/${pathArrayEnd}`)
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
        <StaticJobDefinitionForm resubmit={props.location.state}></StaticJobDefinitionForm>
      ) : (
        <JobDefinitionForm
          state={selectedJobDefinition} resubmit={props.location.state}
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
      <div>
        <MetadataInfoDialog
          opendialog={showDialog}
          closedialog={handleClose}
          standardout={standardOut}
          headertitle={headerTitle}
        ></MetadataInfoDialog>

        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          {jobDefinitionList.length > 0 ? (
            <React.Fragment>
              {(rowsPerPage > 0 && props.search === ""
                ? searchResult.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                : searchResult.slice(
                  searchPage * searchRowperPage,
                  searchPage * searchRowperPage + searchRowperPage
                )
              ).map((row, ind, arr) => {
                lengthOfRow = arr.length;
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
                        <Grid container xs={9} sm={10}>
                          <Grid item xs={4} style={{ padding: "5px" }}>
                            <Typography>Name</Typography>
                            <Typography
                              style={{ fontWeight: "700", wordBreak: "break-word" }}
                            >
                              {row.id}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} style={{ padding: "5px" }}>
                            <Typography>Created By</Typography>
                            <Typography style={{ fontWeight: "700" }}>
                              {row.created_by}
                            </Typography>
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
                        <Grid xs={3} sm={2} style={{ paddingTop: "15px" }}>
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
            </React.Fragment>
          ) : (
            <LinearProgress className="w-xs" color="secondary" />
          )}
        </FuseAnimate>

        {props.search === "" ? (
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
        )}
      </div>
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
