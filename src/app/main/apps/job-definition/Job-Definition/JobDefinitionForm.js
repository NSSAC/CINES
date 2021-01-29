import {
  Button,
  Fab,
  Icon,
  Tooltip,
  Typography,
  Grid,
  LinearProgress,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./JobDefinitionForm.css";
import axios from "axios";
import { Input } from "app/main/apps/job-definition/Job-Definition/Input";
import Toaster from "./Toaster";
import Formsy from "formsy-react";
import { useHistory } from "react-router-dom";
function JobDefinitionForm(props) {
  const [showFMDialog, setShowFMDialog] = useState(false);
  const [showDialog, setshowDialog] = useState(false);
  const [fileChosen, setFileChosen] = useState("");
  const [formElementsArray, setFormElementsArray] = useState({});
  const [jobSubmissionArray, setJobSubmissionArray] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [flag, setFlag] = useState(false);
  const [response, setResponse] = useState("");
  const [success, setSuccess] = useState();
  const [isToasterFlag, setIsToasterFlag] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(true);
  var path = window.location.pathname;
  var pathEnd = path.replace("/apps/job-definition/", "");
  const parentGrid = {
    borderTop: "2px solid black",
    borderBottom: "2px solid black",
  };

  const childGrid = {
    borderRight: "1px solid black",
    paddingLeft: "20px",
  };
  const selectButtonStyle = {
    backgroundColor: "#61dafb",
    fontSize: "inherit",
    margin: "5px",
    padding: "6px",
    color: "black",
  };

  const buttonStyle = {
    backgroundColor: "lightgrey",
    margin: "5px",
    padding: "6px",
    color: "black",
  };
  const history = useHistory();

  useEffect(() => {
    setIsToasterFlag(false);
    var userToken = localStorage.getItem("id_token");
   

    axios({
      method: "get",
      url: `https://sciduct.bii.virginia.edu/jobsvc/job_definition/${pathEnd}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "* ",
        Authorization: userToken,
      },
    }).then(
      (res) => {
        setSpinnerFlag(false);
        if (res.data) {
          var createFromData = JSON.parse(res.data.input_schema).properties;
          var inputFileData = res.data.input_files;
          var outputFiles = res.data.output_files;
          var requiredFeildArray = JSON.parse(res.data.input_schema).required;
          var responseData = res.data;
          creatForm(
            createFromData,
            inputFileData,
            outputFiles,
            responseData,
            requiredFeildArray
          );
        }
      },
      (error) => {}
    );
  }, [axios]);

  const creatForm = (
    createFromData,
    inputFileData,
    outputFiles,
    responseData,
    requiredFeildArray
  ) => {
    setResponse(responseData);
    var count = 0;
    if (createFromData !== undefined && pathEnd.split("_")[0] === "snap") {
      setFlag(true);
      if (inputFileData !== undefined) {
        for (let [index, obj] of inputFileData.entries()) {
          obj["id"] = index;
          obj["formLabel"] = obj.name;
          obj["value"] = "";
          obj["outputFlag"] = false;
        }
      }

      for (let key in createFromData) {
        count++;
        createFromData[key]["id"] = count + 100;
        createFromData[key]["formLabel"] = key;
        // createFromData[key]["value"] = "";

        if (requiredFeildArray.includes(key)) {
          createFromData[key]["required"] = true;
        } else {
          createFromData[key]["required"] = false;
        }
      }
      if (inputFileData !== undefined) {
        for (let obj of inputFileData) {
          let keyName = obj.name;
          createFromData[keyName] = obj;
        }
      }
      if (outputFiles != undefined) {
        let outputContainer = {
          id: 200,
          formLabel: "output_container",
          value: "",
          description:
            "Select the path from File manager where the output file is to be stored.",
          types: ["folder", "epihiper_multicell_analysis", "epihiperOutput"],
          outputFlag: true,
        };
        let outputName = {
          id: 201,
          formLabel: "output_name",
          value: "",
          type: "string",
          fileType: outputFiles.type,
        };
        createFromData["output_container"] = outputContainer;
        createFromData["output_name"] = outputName;
      }
       
      
      setFormElementsArray({ ...createFromData });
    } else {
      setFlag(false);
    }
  };

  const inputChangedHandler = (event, inputIdentifier) => {
    if (event.target.value !== "") {
      const updatedJobSubmissionForm = {
        ...formElementsArray,
      };
      const updatedFormElement = {
        ...updatedJobSubmissionForm[inputIdentifier],
      };
      if (updatedFormElement.type === "integer") {
        updatedFormElement.value = parseInt(event.target.value);
      } else if (updatedFormElement.type === "boolean") {
        updatedFormElement.value = Boolean(event.target.value);
      } else {
        updatedFormElement.value = event.target.value;
      }
      updatedJobSubmissionForm[inputIdentifier] = updatedFormElement;
      setFormElementsArray({ ...updatedJobSubmissionForm });
    }
  };

  const createSubmissionData = () => {
    setIsToasterFlag(true);
    var path = window.location.pathname.replace("/apps/job-definition/", "");
    var jobDefinition = path;
    var input = {};
    var requestJson = {
      input: {},

      job_definition: jobDefinition,
      pragmas: {
        account: "ARCS:bii_nssac",
      },
    };
    for (let key in formElementsArray) {
      if (
        formElementsArray[key].id >= 200 &&
        formElementsArray[key].formLabel == "output_container"
      ) {
        requestJson["output_container"] = formElementsArray[key].value;
      } else if (
        formElementsArray[key].id >= 200 &&
        formElementsArray[key].formLabel == "output_name"
      ) {
        requestJson["output_name"] = formElementsArray[key].value;
      } else {
        input[key] = formElementsArray[key].value;
      }
    }
    requestJson.input = input;
    setJobSubmissionArray({ ...requestJson });
    onFormSubmit(requestJson);
  };
  function onFormSubmit(requestJson) {
    var path = window.location.pathname.replace("/apps/job-definition/", "");
    var jobDefinition = path;
    const userToken = localStorage.getItem("id_token");
    axios({
      method: "post",
      url: "https://sciduct.bii.virginia.edu/jobsvc/job_instance/",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "* ",
        Authorization: userToken,
      },
      data: requestJson,
    }).then(
      (res) => {
        setIsToasterFlag(true);
        //setIsToasterFlag(prevMovies => (true));
        setSuccess(true);
        var timeOutHandle = window.setTimeout(delayNavigation, 3000);
      },
      (error) => {
        setSuccess(false);
        setIsToasterFlag(true);
      }
    );
  }

  function delayNavigation() {
    history.push("/apps/my-jobs/");
  }
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function showFileManagerDialog() {
    setShowFMDialog(true);
  }

  function handleFMClose() {
    setShowFMDialog(false);
  }

  const onFormCancel = () => {
    // localStorage.removeItem('selectedJobDefinition')
  };

  if (success) {
  }

  if (spinnerFlag === true)
    return (
      <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">
          Loading Form
        </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );

  if (spinnerFlag === false && flag === true) {
    return (
      <div style={{ paddingLeft: "8px" }}>
        {isToasterFlag ? (
          <Toaster success={success} id={response.id}></Toaster>
        ) : null}
        <Typography className="h2">
          &nbsp;{response != "" ? response.id : null}
        </Typography>
        <Typography className="h4 mb-12">
          &nbsp;{response != "" ? response.description : null}
        </Typography>
        <div>
          {Object.entries(formElementsArray).length !== 0 ? (
            <Formsy
              onValid={enableButton}
              onInvalid={disableButton}
              className="flex flex-col justify-center"
            >
              <Grid style={parentGrid} container spacing={3}>
                {Object.entries(formElementsArray).map((formElement) => (
                  <Grid style={childGrid} item container xs={12} sm={6}>
                    <Input
                      key={formElement.id}
                      formData={formElement}
                      key={formElement.id}
                      elementType={formElement.type}
                      value={formElement.value}
                      buttonClicked={showDialog}
                      changed={(event) =>
                        inputChangedHandler(event, formElement[0])
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              <div style={{ alignSelf: "flex-end" }}>
                <Button
                  // type="submit"
                  variant="contained"
                  color="primary"
                  className="w-30  mt-32 mb-80"
                  aria-label="LOG IN"
                  onClick={createSubmissionData}
                  disabled={!isFormValid}
                >
                  Submit
                </Button>
                <Link
                  to="/apps/job-definition/"
                  style={{ color: "transparent" }}
                >
                  <Button
                    variant="contained"
                    onClick={onFormCancel}
                    color="primary"
                    className="w-30 mx-8 mt-32 mb-80"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </Formsy>
          ) : null}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div style={{ paddingLeft: "10px" }}>
          {isToasterFlag ? (
            <Toaster success={success} id={response.id}></Toaster>
          ) : null}
          <Typography className="h2">
            &nbsp;{response != "" ? response.id : null}
          </Typography>
          <Typography className="h4 mb-12">
            &nbsp;{response != "" ? response.description : null}
          </Typography>
        </div>
        <div
          style={parentGrid}
          className="flex flex-1 flex-col items-center justify-center"
        >
          <Typography className="text-20 mt-16" color="textPrimary">
            OOPS!!!
          </Typography>

          <Typography className="text-20 mt-16" color="textPrimary">
            Form under construction
          </Typography>
        </div>
        <div className="flex flex-end  justify-end">
          <Link to="/apps/job-definition/" style={{ color: "transparent" }}>
            <Button
              variant="contained"
              onClick={onFormCancel}
              color="primary"
              className="w-30 mx-8 mt-32 mb-80"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default JobDefinitionForm;
