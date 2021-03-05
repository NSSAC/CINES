import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import axios from 'axios';
import { Input } from './SelectFile.js'
import { LinearProgress } from '@material-ui/core';
import Toaster from "../Toaster";

const Snap_GetBfsFullDiam = () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [formElementsArray, setFormElementsArray] = useState({});
    // const [jobSubmissionArray, setJobSubmissionArray] = useState({})
    // const [flag, setFlag] = useState(false)
    const [response, setResponse] = useState('')
    const [success, setSuccess] = useState(false);
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const history = useHistory();

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
        setIsToasterFlag(false);
        var userToken = localStorage.getItem('id_token');

        axios({
            method: 'get',
            url: `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_definition/epihiper_db_service`,
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
                    var createFromData = {};
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
                // eslint-disable-next-line
    }, [axios]);

    const creatForm = (createFromData, inputFileData, outputFiles, requiredFeildArray, responseData) => {
        setResponse(responseData)
        var count = 0;
        if (1) {
            // setFlag(false)
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


            setFormElementsArray({ ...createFromData });

        }

        else {
            // setFlag(true)
        }
    };

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

            if (formElementsArray[key].id >= 200 && formElementsArray[key].formLabel === "output_container") {
                requestJson['output_container'] = formElementsArray[key].value
            }
            else if (formElementsArray[key].id >= 200 && formElementsArray[key].formLabel === "output_name") {
                requestJson['output_name'] = formElementsArray[key].value
            }
            else {
                input[key] = formElementsArray[key].value
            }



        }

        requestJson.input = input
        // setJobSubmissionArray({ ...requestJson })
        onFormSubmit(requestJson)
    }
    function onFormSubmit(requestJson) {
        const userToken = localStorage.getItem('id_token')
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_instance/`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '* ',
                'Authorization': userToken,

            },
            data: requestJson,
        }).then(res => {
            setIsToasterFlag(true)
            setSuccess(true)
            window.setTimeout(
                delayNavigation
                , 3000);

        },
            (error) => {
                setSuccess(false)
                setIsToasterFlag(true)
                window.setTimeout(handlingError, 4000);
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
                                            {Object.entries(formElementsArray).filter(data => { if (data[1].type === undefined) return data; else return null }).map((formElement) => (
                                                <Grid style={childGrid} item container xs={12} sm={6}>
                                                    <Input
                                                        key={formElement.id}
                                                        formData={formElement}
                                                        elementType={formElement.type}
                                                        value={formElement.value}
                                                        changed={(event) => inputChangedHandler(event, formElement[0])}
                                                    />
                                                </Grid>))}
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

export default Snap_GetBfsFullDiam;