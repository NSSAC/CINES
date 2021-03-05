import React, { useState,useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { SelectFormsy } from "@fuse";
import Formsy from "formsy-react";
import axios from "axios";
import "./Filterdialog.css";
import MenuItem from "@material-ui/core/MenuItem";
import JOBTYPEVALUE from "./jobtypevalueconfig.js";
import Chip from "@material-ui/core/Chip";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//var state = ""
export const MyJobFilter = ({
  showModal,
  handleClose,
  handleLogout,
  remainingTime,
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "inline-block",
      justifyContent: "start",

      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      display: "inline-block",
      margin: theme.spacing(0.5),
      paddingTop: "5px",
    },
    dialogwidth: {
      minWidth: "100px !important",
    },
  }));
  const dispatch = useDispatch();
  const [state, setState1] = React.useState("");
  const [preStateValue, setPreStateValue] = useState([]);
  const [preJobTypeValue, setPreJobTypeValue] = useState([]);
  const [jobTypeArray, setjobTypeArray] = useState([]);
  const [selectedStateFlag, setselectedStateFlag] = useState(false);
  const [selectedTypeArray, setSelectedTypeArray] = useState([]);
  const [selectedValue, setselectedValue] = useState("");
  const [stateFlag, setStateFlag] = useState(false);
  const [jobDefinationType ,setJobDefinationType] =useState([])
  
  var jobArray =[];
  useEffect(() => {
  
    var userToken = localStorage.getItem("id_token");

    axios({
      method: "get",
      url: `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_definition?limit(99999)`,
      headers: {
       
        'Accept': '*/*',
        "Access-Control-Allow-Origin": "* ",

        Authorization: userToken,
      },
    }).then(
      (res) => {
        if (res.data) {
          var responseData = res.data;
          createjobTypeArray(responseData)
        }
      },
      (error) => {}
    );
  }, [axios]);



const createjobTypeArray = (responseData) => {

 for(let i= 0 ;i< responseData.length ; i++){
   jobArray.push(responseData[i].id)
   
 }
 setJobDefinationType(jobArray)
}


  const changeHandler = (e) => {
    /* Flag to enable value dropdown */
    setStateFlag(true);
    setState1(e.target.value);
    setselectedValue("");

    if (e.target.value === "State") {
      setjobTypeArray(JOBTYPEVALUE.statusType);
      setselectedStateFlag(true);
    } else {
     // setjobTypeArray(JOBTYPEVALUE.jobDefinationType);
     setjobTypeArray(jobDefinationType)
      setselectedStateFlag(false);
    }
  };

  const onvalueChangeHandeler = (e) => {
    setselectedValue(e.target.value);
  };

  function addData() {
    if (!selectedTypeArray.includes(state)) {
      setSelectedTypeArray((selectedTypeArray) => [
        ...selectedTypeArray,
        state,
      ]);
    }
    if (selectedStateFlag) {
      if (!preStateValue.includes(selectedValue)) {
        setPreStateValue((preStateValue) => [...preStateValue, selectedValue]);
      }
    } else {
      if (!preJobTypeValue.includes(selectedValue)) {
        setPreJobTypeValue((preJobTypeValue) => [
          ...preJobTypeValue,
          selectedValue,
        ]);
      }
    }
    setState1("");
    setselectedValue("");
    setStateFlag(false);
  }

  const applyFilter = () => {
    sessionStorage.setItem("resetPage", JSON.stringify(true));
    sessionStorage.setItem(
      "selectedTypeArray",
      JSON.stringify(selectedTypeArray)
    );
    sessionStorage.setItem("preStateValue", JSON.stringify(preStateValue));
    sessionStorage.setItem("preJobTypeValue", JSON.stringify(preJobTypeValue));
    sessionStorage.setItem("isFilterApplied", JSON.stringify(true));
    handleClose();
    dispatch(Actions.getFiles(10, 0, true, "creation_date", true, true));
  };
  const reset = () => {
    sessionStorage.setItem("resetPage", JSON.stringify(true));
    setPreStateValue([]);
    setSelectedTypeArray([]);
    setPreJobTypeValue([]);
    let start = 1;
    let type = "creation_date";
    let descShort = true;
    sessionStorage.setItem("isFilterApplied", JSON.stringify(false));
    dispatch(Actions.getFiles(10, 1, descShort, type, true));
    sessionStorage.setItem("count", start);
    sessionStorage.setItem("shortOrder", JSON.stringify(descShort));
  };

  const onCancle = () => {
    setState1("");
    setselectedValue("");
    handleClose();
  };

  const handleDelete = (chipToDelete) => {
    var index = preStateValue.indexOf(chipToDelete);

    preStateValue.splice(index, 1);
    setPreStateValue([...preStateValue]);

    if (preStateValue.length === 0) {
      index = selectedTypeArray.indexOf("State");
      selectedTypeArray.splice(index, 1);
      setSelectedTypeArray([...selectedTypeArray]);
      if (selectedTypeArray.length === 0) {
        reset();
      }
    }
  };

  const handleDeleteJob = (chipToDelete) => {
    var index = preJobTypeValue.indexOf(chipToDelete);

    preJobTypeValue.splice(index, 1);
    setPreJobTypeValue([...preJobTypeValue]);

    if (preJobTypeValue.length === 0) {
      index = selectedTypeArray.indexOf("Job Type");
      selectedTypeArray.splice(index, 1);
      setSelectedTypeArray([...selectedTypeArray]);
      if (selectedTypeArray.length === 0) {
        reset();
      }
    }

    //setPreJobTypeValue((preJobTypeValue) => preJobTypeValue.filter((preJobTypeValue) => preJobTypeValue !== chipToDelete));
  };
  const classes = useStyles();

  return (
    <div>
      <Dialog
        className="classes.dialogwidth"
        open={showModal}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Filter By"}</DialogTitle>
        <DialogContent>
          {
            <Formsy className="flex flex-col justify-center">
              <SelectFormsy
                className="my-16"
                name="related"
                label="Select type"
                value={state}
                onChange={(e) => changeHandler(e)}
                variant="outlined"
              >
                <MenuItem value="State">Status</MenuItem>
                <MenuItem value="Job Type">Job Type</MenuItem>
              </SelectFormsy>
              {stateFlag ? (
                <SelectFormsy
                  className="my-16"
                  name="related"
                  label="Select value"
                  value={state}
                  variant="outlined"
                  onChange={(e) => onvalueChangeHandeler(e)}
                >
                  {jobTypeArray.map((item) => {
                    return (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </SelectFormsy>
              ) : null}
            </Formsy>
          }

          <DialogActions>
            <Button
              onClick={addData}
              variant="contained"
              disabled={selectedValue === ""}
            >
              Add
            </Button>
          </DialogActions>

          <div className="absolut mt-5">
            {preStateValue.length !== 0 ? <span> Status: </span> : null}
            {preStateValue.map((data, index) => {
              let icon;

              if (data.label === "React") {
                icon = <TagFacesIcon />;
              }

              return (
                <Paper key={index} component="ul" className={classes.root}>
                  <li key={index}>
                    <Chip
                      icon={icon}
                      label={data}
                      onDelete={() => handleDelete(data)}
                      className={classes.chip}
                    />
                  </li>
                </Paper>
              );
            })}
          </div>
          <div>
            {preJobTypeValue.length !== 0 ? <span> Job Type:</span> : null}
            {preJobTypeValue.map((data, index) => {
              let icon;

              return (
                <Paper key={index} component="ul" className={classes.root}>
                  <li key={index}>
                    <Chip
                      icon={icon}
                      label={data}
                      onDelete={() => handleDeleteJob(data)}
                      className={classes.chip}
                    />
                  </li>
                </Paper>
              );
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={applyFilter}
            disabled={selectedTypeArray.length === 0}
            variant="contained"
            color="default"
          >
            Apply
          </Button>
          <Button
            onClick={reset}
            disabled={
              selectedTypeArray.length === 0 &&
              preStateValue.length === 0 &&
              preJobTypeValue.length === 0
            }
            variant="contained"
            color="default"
          >
            Reset
          </Button>
          <Button onClick={onCancle}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
