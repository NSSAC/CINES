import {
    TextFieldFormsy
} from '@fuse/components/formsy';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import axios from 'axios';
import { Input } from './SelectFile.js'
import { Icon, LinearProgress, Tooltip } from '@material-ui/core';
import Toaster from "../Toaster";

const Epihiper_cell_simulation = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [formElementsArray, setFormElementsArray] = useState({});
    const [jobSubmissionArray, setJobSubmissionArray] = useState({})
    const [flag, setFlag] = useState(false)
    const [response, setResponse] = useState('')
    const [success, setSuccess] = useState(false);
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [showDialog, setshowDialog] = useState(false);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const history = useHistory();
    var path = window.location.pathname;
    var pathEnd = path.replace("/apps/job-definition/", "");


    const parentGrid = {
        borderTop: '2px solid black',
        borderBottom: '2px solid black'
    };

    const childGrid = {
        borderRight: '1px solid black',
        paddingLeft: '20px'
    };

    function disableButton() {
        setIsFormValid(false);
    }


    const onFormCancel = () => {
    };

    function enableButton() {
        setIsFormValid(true);
    }


    useEffect(() => {
        var userToken = localStorage.getItem('id_token');
        setIsToasterFlag(false);
        axios({
            method: 'get',
            url: 'https://sciduct.bii.virginia.edu/jobsvc/job_definition/epihiper_cell_simulation',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '* ',
                Authorization: userToken
            }
        }).then(
            (res) => {
                setSpinnerFlag(false)
                if (res.data) {
                    console.log(res.data);
                    var createFromData = JSON.parse(res.data.input_schema).properties;
                    var inputFileData = res.data.input_files;
                    var outputFiles = res.data.output_files;
                    var requiredFeildArray = JSON.parse(res.data.input_schema).required;
                    var responseData = res.data;

                    creatForm(createFromData, inputFileData, outputFiles, requiredFeildArray, responseData);
                    return (
                        setSuccess(true)
                    )
                }
            },
            (error) => {

            }

        );
    }, [axios]);

    const creatForm = (createFromData, inputFileData, outputFiles, requiredFeildArray, responseData) => {
        setResponse(responseData)
        var count = 0;
        if (createFromData !== undefined) {
            setFlag(false)
            if (inputFileData !== undefined) {
                for (let [index, obj] of inputFileData.entries()) {
                    obj['id'] = index;
                    obj['formLabel'] = obj.name;
                    obj['value'] = '';
                    obj["outputFlag"] = false;
                }
            }

            for (let key in createFromData) {
                count++;
                createFromData[key]['id'] = count + 100;
                createFromData[key]['formLabel'] = key;
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
                    "id": 200,
                    "formLabel": "output_container",
                    "value": "",
                    "description": "Select the path from File manager where the output file is to be stored.",
                    "types": ['folder', 'epihiper_multicell_analysis', 'epihiperOutput'],
                    "outputFlag": true
                }
                let outputName = {
                    "id": 201,
                    "formLabel": "output_name",
                    "value": "",
                    "type": 'string',
                    "fileType": outputFiles.type
                }
                createFromData['output_container'] = outputContainer
                createFromData['output_name'] = outputName

            }

            setFormElementsArray({ ...createFromData });

        }

        else {
            setFlag(true)
        }
    };

    const description = (desc) => <Tooltip title={<h4>{desc}</h4>} placement="right">
        <span style={{ marginTop: '38px' }}>
            <Icon fontSize="small">info</Icon>
        </span>
    </Tooltip>

    const inputChangedHandler = (event, inputIdentifier) => {
        if (event.target.value !== "") {
            const updatedJobSubmissionForm = {
                ...formElementsArray
            };
            const updatedFormElement = {
                ...updatedJobSubmissionForm[inputIdentifier]
            };
            if (updatedFormElement.type === 'integer') {
                updatedFormElement.value = parseInt(event.target.value);
            }
            else if (updatedFormElement.type === 'boolean') {
                updatedFormElement.value = Boolean(event.target.value);
            }
            else {
                updatedFormElement.value = event.target.value;
            }
            updatedJobSubmissionForm[inputIdentifier] = updatedFormElement;
            setFormElementsArray({ ...updatedJobSubmissionForm });
        }
    }

    const createSubmissionData = () => {
        setIsToasterFlag(true)
        var path = window.location.pathname.replace("/apps/job-definition/", "")
        var jobDefinition = path
        var input = {}
        var requestJson = {
            input: {},

            job_definition: jobDefinition,
            "pragmas": {
                "account": "ARCS:bii_nssac"
            }
        }
        for (let key in formElementsArray) {

            if (formElementsArray[key].id >= 200 && formElementsArray[key].formLabel == "output_container") {
                requestJson['output_container'] = formElementsArray[key].value
            }
            else if (formElementsArray[key].id >= 200 && formElementsArray[key].formLabel == "output_name") {
                requestJson['output_name'] = formElementsArray[key].value
            }
            else {
                input[key] = formElementsArray[key].value
            }



        }

        requestJson.input = input
        setJobSubmissionArray({ ...requestJson })
        onFormSubmit(requestJson)
    }
    function onFormSubmit(requestJson) {
        //createSubmissionData() 
        var path = window.location.pathname.replace("/apps/job-definition/", "")
        var jobDefinition = path
        const userToken = localStorage.getItem('id_token')
        axios({
            method: 'post',
            url: "https://sciduct.bii.virginia.edu/jobsvc/job_instance/",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '* ',
                'Authorization': userToken,

            },
            data: requestJson,
        }).then(res => {
            setIsToasterFlag(true)
            setSuccess(true)
            var timeOutHandle = window.setTimeout(
                delayNavigation
                , 3000);

        },
            (error) => {
                setSuccess(false)
                setIsToasterFlag(true)
                var timeOutHandle = window.setTimeout(handlingError, 4000);
            }
        )

    }

    function handlingError() {
        setIsToasterFlag(false);
      }

    function delayNavigation() {
        history.push('/apps/my-jobs/');
    }

    if (spinnerFlag === true)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading Form</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        );

    if (spinnerFlag === false)
        return (
            <FusePageSimple
                classes={{
                    root: 'root',
                    header: 'headerDisplay'
                }}
                header={
                    <div></div>
                }
                content={
                    <div className="flex content">
                        <div className="content">
                            {isToasterFlag ? (
                                <Toaster success={success} id={response.id}></Toaster>
                            ) : null} <Typography className="h2">{response.id}</Typography>
                            <Typography className="h4 mb-12" style={{ whiteSpace: "break-spaces" }}>&nbsp;{response.description}</Typography>
                            <div>
                                {Object.entries(formElementsArray).length !== 0 ? (
                                    <Formsy
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        className="flex flex-col justify-center"
                                    >
                                        {console.log(formElementsArray)}
                                        <Grid style={parentGrid} container spacing={3}>
                                            <Grid style={childGrid} item container xs={12} sm={6}>
                                                <TextFieldFormsy
                                                    className="my-16 inputStyle"
                                                    type="number"
                                                    name={formElementsArray['startTick'].formLabel}
                                                    style={{ width: '18px' }}
                                                    value=""
                                                    label={formElementsArray['startTick'].formLabel}
                                                    onChange={(event) => inputChangedHandler(event, formElementsArray['startTick'].formLabel)}
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:0|[1-9]\d*))$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                {formElementsArray['startTick'].description && (description(formElementsArray['startTick'].description))}
                                            </Grid>
                                            <Grid style={childGrid} item container xs={12} sm={6}>
                                                <TextFieldFormsy
                                                    className="my-16 inputStyle"
                                                    type="number"
                                                    name={formElementsArray['endTick'].formLabel}
                                                    style={{ width: '18px' }}
                                                    value=""
                                                    label={formElementsArray['endTick'].formLabel}
                                                    onChange={(event) => inputChangedHandler(event, formElementsArray['endTick'].formLabel)}
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:0|[1-9]\d*))$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                {formElementsArray['endTick'].description && (description(formElementsArray['endTick'].description))}
                                            </Grid>
                                            {Object.entries(formElementsArray).filter(data => { if (data[1].type == undefined) return data }).map((formElement) => (
                                                <Grid style={childGrid} item container xs={12} sm={6}>
                                                    <Input
                                                        key={formElement.id}
                                                        formData={formElement}
                                                        key={formElement.id}
                                                        elementType={formElement.type}
                                                        value={formElement.value}
                                                        buttonClicked={showDialog}
                                                        changed={(event) => inputChangedHandler(event, formElement[0])}
                                                    />
                                                </Grid>))}
                                            <Grid style={childGrid} item container xs={12} sm={6}>
                                                <TextFieldFormsy
                                                    className="my-16 inputStyle"
                                                    type="text"
                                                    name={formElementsArray['output_name'].formLabel}
                                                    style={{ width: '18px' }}
                                                    value={formElementsArray['output_name'].value}
                                                    label={formElementsArray['output_name'].formLabel}
                                                    onChange={(event) => inputChangedHandler(event, formElementsArray['output_name'].formLabel)}
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:0|[1-9]\d*))$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                {formElementsArray['output_name'].description && (description(formElementsArray['output_name'].description))}
                                            </Grid>
                                        </Grid>
                                        <div style={{ alignSelf: 'flex-end' }}>
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
                                            <Link to="/apps/job-definition/" style={{ color: 'transparent' }}>
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
                    </div>
                }
            />

        );
}

export default Epihiper_cell_simulation;