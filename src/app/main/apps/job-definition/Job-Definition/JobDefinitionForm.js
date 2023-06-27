import { Button, Grid, LinearProgress, Typography } from "@material-ui/core";
import Formsy from "formsy-react";
import { JobService } from "node-sciduct";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { Input } from "app/main/apps/job-definition/Job-Definition/Input";

import MetadataInfoDialog from "../../my-jobs/MetadataDialog";
import * as Actions from "./store/actions";
import Toaster from "./Toaster";

import "./JobDefinitionForm.css";

function JobDefinitionForm(props) {
  // const jobData = useSelector(
  //   ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
  // );
  const jobData = useSelector(({ JobDefinitionApp }) => { return JobDefinitionApp.job_definition })
  const [formElementsArray, setFormElementsArray] = useState({});
  // const [jobSubmissionArray, setJobSubmissionArray] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [flag, setFlag] = useState(false);
  const [response, setResponse] = useState("");
  const [success, setSuccess] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isToasterFlag, setIsToasterFlag] = useState(false);
  const [spinnerFlag, setSpinnerFlag] = useState(true);
  const [onSubmit, setOnSubmit] = useState()
  const [showDialog, setshowDialog] = useState(false);
  const standardOut = "";
  const headerTitle = "";
  const dispatch = useDispatch()

  var path = window.location.pathname;
  var pathEnd = path.replace("/apps/job-definition/", "");

  if (pathEnd.endsWith('/'))
    pathEnd = pathEnd.slice(0, -1)
  const parentGrid = {
    borderTop: "2px solid black",
    borderBottom: "2px solid black",
  };

  const childGrid = {
    // border: "1px solid rgba(0, 0, 0, 0.12);"
    
    // borderRight: "1px solid black",
    // paddingLeft: "20px",
  };

  const outputGrid={}
  // const outputGrid={border: "1px solid gray", margin: "4px", paddingLeft: "20px"}
  // const outputGrid = {
  //   borderRight: "1px solid black",
  //   paddingLeft: "20px",
  //   borderTop: "2px solid black",
  // };

  // const hereButton = {
  //   fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  //   fontSize: '15px',
  //   fontWeight: '500',
  //   color: 'deepskyblue'
  // }

  const history = useHistory();

  useEffect(() => {
    return (
      localStorage.removeItem('last_selected_folder')
    )
  }, [])

  useEffect(() => {
    setIsToasterFlag(false);
    if ((jobData.id && !(jobData.id === (pathEnd))) || Object.keys(jobData).length === 0){
      dispatch(Actions.getJobDefinition(`${props.namespace}/${props.module}@${props.version}`));
    }
      // dispatch(Actions.setSelectedItem(`${props.namespace}/${props.module}@${props.version}`));
    if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)  ) {
      setSpinnerFlag(false);
      var createFromData = jobData.input_schema.properties || {};
      var inputFileData = jobData.input_files;
      var outputFiles = jobData.output_files;
      var requiredFeildArray = jobData.input_schema.required;
      var responseData = jobData;
      if(outputFiles && Object.keys(outputFiles).length === 0){
        outputFiles = undefined
      }
      creatForm(
        createFromData,
        inputFileData,
        outputFiles,
        responseData,
        requiredFeildArray
      );
    }
    // eslint-disable-next-line
  }, [jobData.id]);

  // const openDialog = (data) => {
  //   setshowDialog(true);
  //   setStandardOut(data[1]);
  //   setHeaderTitle(data[0]);
  // }

  const handleClose = () => {
    setshowDialog(false);
  };

  const creatForm = (
    createFromData,
    inputFileData,
    outputFiles,
    responseData,
    requiredFeildArray
  ) => {
    setResponse(responseData);
    var count = 0;
    if (createFromData !== undefined) {
      setFlag(true);
      if (inputFileData !== undefined) {
        for (let [index, obj] of inputFileData.entries()) {
          obj["id"] = index;
          obj["formLabel"] = obj.name;
          obj["outputFlag"] = false;
          // obj["required"] = obj.required
          if (props.resubmit){
            obj["value"] = props.resubmit.inputData.input[obj.name] 
            if (outputFiles === undefined) {
                  localStorage.setItem('last_selected_folder',props.resubmit.inputData.input[obj.name].substr(0, props.resubmit.inputData.input[obj.name].lastIndexOf("/")) + '/')
            }
          }else if(props.localResubmit){
            obj["value"] = props.localResubmit.input[obj.name];
            if (outputFiles === undefined) {
                  localStorage.setItem('last_selected_folder',props.localResubmit.input[obj.name].substr(0, props.localResubmit.input[obj.name].lastIndexOf("/")) + '/')
            }
          }else
            obj["value"] = "";
        }
      }

      for (let key in createFromData) {
        count++;
        createFromData[key]["id"] = count + 100;
        createFromData[key]["formLabel"] = key;
        if (props.resubmit || props.localResubmit){
          if(props.resubmit){
            createFromData[key]["value"] = props.resubmit.inputData.input[key]
          }else{
            createFromData[key]["value"] = props.localResubmit.input[key];
          }
        }
        else if (String(createFromData[key]['default']) !== 'undefined')
          createFromData[key]["value"] = createFromData[key]['default'].toString();
        else
          createFromData[key]["value"] = ""


        if (requiredFeildArray !== undefined && requiredFeildArray.includes(key)) {
          createFromData[key]["required"] = true;
        } else {
          createFromData[key]["required"] = false;
        }
      }
      if (inputFileData !== undefined) {
        for (let obj of inputFileData) {
          count++;
          let keyName = obj.name;
          createFromData[keyName] = obj;
        }
      }

      if (count % 2 !== 0) {
        count++;
        let extraObj = {
          id: count + 100,
          formLabel: "",
          value: "",
          required: true
        };
        createFromData["extraObj"] = extraObj;

      }
      if (outputFiles !== undefined) {
        if(props.resubmit){
          props.resubmit && localStorage.setItem('last_selected_folder',props.resubmit.inputData.output_container ? props.localResubmit.output_container + '/' : "")
        }else if(props.localResubmit){
          props.localResubmit && localStorage.setItem('last_selected_folder',props.localResubmit.output_container ? props.localResubmit.output_container + '/' : "")
        }else{
        props.resubmit && localStorage.setItem('last_selected_folder',props.resubmit.inputData.output_container + '/')
        }
        let outputContainer = {
          id: 200,
          formLabel: "output_container",
          value: props.resubmit ? props.resubmit.inputData.output_container : (props.localResubmit && props.localResubmit.output_container) ? props.localResubmit.output_container : "",
          description:
            "Select the path from File manager where the output file is to be stored.",
          types: ["folder", "epihiper_multicell_analysis", "epihiperOutput","csonnet_simulation_container"],
          outputFlag: true,
        };
        let outputName = {
          id: 201,
          formLabel: "output_name",
          value: (props.resubmit && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name :
                 (props.localResubmit && props.localResubmit.state !== "Completed" && props.localResubmit.output_name) ? props.localResubmit.output_name : ""  ,
          type: "string",
          fileType: outputFiles.type,
          required: true,
        };
        createFromData["output_container"] = outputContainer;
        createFromData["output_name"] = outputName;
      }

      setFormElementsArray({ ...createFromData });
      window.restoreD_FEArray = {...createFromData}
    } else {
      setFlag(false);
    }
  };

  const inputChangedHandler = (event, inputIdentifier) => {
      const updatedJobSubmissionForm = {
        ...formElementsArray,
      };
      const updatedFormElement = {
        ...updatedJobSubmissionForm[inputIdentifier],
      };
      updatedFormElement.value = event.target.value;
      updatedJobSubmissionForm[inputIdentifier] = updatedFormElement;
      setFormElementsArray({ ...updatedJobSubmissionForm });
      window.restoreD_FEArray = { ...updatedJobSubmissionForm }
      window.formEdited = true
  };

  const createSubmissionData = async () => {
    setIsToasterFlag(true);

    var input = {};

    var requestJson = {
      input: {},
      job_definition: `${props.namespace}/${props.jobdef}@${props.version}`,
      pragmas: {},
    };
    for (let key in formElementsArray) {
      if (
        formElementsArray[key].id >= 200 &&
        formElementsArray[key].formLabel === "output_container"
      ) {
        requestJson["output_container"] = formElementsArray[key].value;
      } else if (
        formElementsArray[key].id >= 200 &&
        formElementsArray[key].formLabel === "output_name"
      ) {
        requestJson["output_name"] = formElementsArray[key].value;
      }

      else {
        if (formElementsArray[key].type === "integer") {
          input[key] = parseInt(formElementsArray[key].value);
        } else if (formElementsArray[key].type === "boolean") {
          if (formElementsArray[key].value === "true" || formElementsArray[key].value === true) {
            input[key] = true;
          }
          else {
            input[key] = false;
          }
          // updatedFormElement["value"] = Boolean(event.target.value);
        } else if (formElementsArray[key].type === "number") {
          input[key] = parseFloat(formElementsArray[key].value);
        } else {
          input[key] = formElementsArray[key].value;
        }
      }
    }
    requestJson.input = input;
    // setJobSubmissionArray({ ...requestJson });
    // console.log("Submit Form: ", requestJson)
    onFormSubmit(requestJson);
  };

  async function onFormSubmit(requestJson) {
    setOnSubmit(true)
    const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
    const token = localStorage.getItem('id_token');
    const jobServiceInstance = new JobService(url, token)
    jobServiceInstance.createJobInstance(requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container).then(
      (res) => {
        setIsToasterFlag(true);
        setSuccess(true);
        //setOnSubmitFlag(true)
        window.setTimeout(delayNavigation, 4000);
      },
      (error) => {
        setSuccess(false);
        if (error.response)
          setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
        else
          setErrorMsg("An internal error occured. Please try again")
        setIsToasterFlag(true);
        window.setTimeout(handlingError, 4000);
      }
    );
  }
  function handlingError() {
    setIsToasterFlag(false);
    setSuccess();
    setOnSubmit(false)
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
        <MetadataInfoDialog
          opendialog={showDialog}
          closedialog={handleClose}
          standardout={standardOut}
          headertitle={headerTitle}
        ></MetadataInfoDialog>

        {isToasterFlag ? (
          <Toaster errorMsg={errorMsg} success={success} id={response.id}></Toaster>
        ) : null}

        <div className="p-8">
          {Object.entries(formElementsArray).length !== 0 ? (
            <Formsy
              onValid={enableButton}
              onInvalid={disableButton}
              className="flex flex-col justify-center"
            >
              <Grid className="p-4 border-b border-gray-600" container spacing={3}>
                {Object.entries(formElementsArray).map((formElement) =>
                  formElement[1].id < 200 ? (
                    <Grid key={formElement[1].id} style={childGrid} item container xs={12} sm={6} className="abcd">
                      <Input
                        key={formElement.id}
                        formData={formElement}
                        elementType={formElement.type}
                        value={formElement.value}
                        changed={(event) =>
                          inputChangedHandler(event, formElement[0])
                        }
                      />
                    </Grid>
                  ) : (
                    <Grid key={formElement[1].id} style={outputGrid} item container xs={12} sm={6} className="qwe">
                      <Input
                        key={formElement.id}
                        formData={formElement}
                        elementType={formElement.type}
                        value={formElement.value}
                        changed={(event) =>
                          inputChangedHandler(event, formElement[0])
                        }
                      />
                    </Grid>
                  )
                )}
              </Grid>
              <div style={{ alignSelf: "flex-end" }}>
                <Button
                  // type="submit"
                  variant="contained"
                  color="primary"
                  className="w-30  mt-32 mb-80"
                  aria-label="LOG IN"
                  onClick={createSubmissionData}
                  disabled={!isFormValid || success || onSubmit}
                >
                  Submit
                </Button>
                {(props.resubmit || props.localResubmit) ? <Link
                  to="/apps/my-jobs/"
                  style={{ color: "transparent" }}
                >
                  <Button
                    variant="contained"
                    onClick={onFormCancel}
                    color="primary"
                    className="w-30 mx-8 mt-32 mb-80">
                    Cancel
                  </Button>
                </Link> :
                  <Link
                    to="/apps/job-definition/"
                    style={{ color: "transparent" }}
                  >
                    <Button
                      variant="contained"
                      onClick={onFormCancel}
                      color="primary"
                      className="w-30 mx-8 mt-32 mb-80">
                      Cancel
                    </Button>
                  </Link>}
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
            <Toaster errorMsg={errorMsg} success={success} id={response.id}></Toaster>
          ) : null}
          <Typography className="h2">
            &nbsp;{response !== "" ? <b>{response.id}</b> : null}
          </Typography>
          <Typography className="h4">
            &nbsp;{response !== "" ? response.description : null}
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
