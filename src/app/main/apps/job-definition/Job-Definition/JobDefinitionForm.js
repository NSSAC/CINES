import { FuseAnimate, FusePageSimple } from '@fuse/index.js';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from '../../file-manager/FileUpload/FileUploadDialog.js';
import FMPopup from './file-manager-dialog/FileManagerDialog.js';
import './JobDefinitionForm.css';
import axios from 'axios';
import { Input } from 'app/main/apps/job-definition/Job-Definition/Input';

import Formsy from 'formsy-react';

function JobDefinitionForm(props) {
    const [showFMDialog, setShowFMDialog] = useState(false);
    const [showDialog, setshowDialog] = useState(false);
    const [fileChosen, setFileChosen] = useState('');
    const [formElementsArray, setFormElementsArray] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [flag, setFlag] = useState(false)
    const [response, setResponse] = useState('')
    const parentGrid = {
        borderTop: '2px solid black',
        borderBottom: '2px solid black'
    };

    const childGrid = {
        borderRight: '1px solid black',
        paddingLeft: '20px'
    };

    useEffect(() => {
        var userToken = localStorage.getItem('id_token');
        var path = window.location.pathname;
        var pathEnd = path.replace('/apps/job-definition/', '');

        axios({
            method: 'get',
            url: `https://sciduct.bii.virginia.edu/jobsvc/job_definition/${pathEnd}`,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '* ',
                Authorization: userToken
            }
        }).then(
            (res) => {
                if (res.data) {
                    console.log(res.data);
                    var createFromData = JSON.parse(res.data.input_schema).properties;
                    var inputFileData = res.data.input_files;
                    var outputFiles= res.data.output_files;
                    var x = JSON.parse(res.data.input_schema).required;
                    var responseData = res.data
                    console.log(response)
                    console.log(JSON.parse(res.data.input_schema).properties)


                    creatForm(createFromData, inputFileData,outputFiles, responseData);
                }
            },
            (error) => { }
        );
    }, []);

    const creatForm = (createFromData, inputFileData,outputFiles, responseData) => {
        setResponse(responseData)
        var count = 0;
        if (createFromData !== undefined) {
            setFlag(false)
            if (inputFileData !== undefined) {
                for (let [index, obj] of inputFileData.entries()) {
                    obj['id'] = index;
                    obj['formLabel'] = obj.name;
                    obj['value'] = '';
                    //  let keyName = obj.name
                    // createFromData[keyName] = obj
                }
            }
            if(outputFiles!=undefined){

                let outputContainer={
                    "id":200,
                    "formLable":"output_container",
                    "value" : "",
                     "type": outputFiles.type
                }
                let outputName={
                    "id":200,
                    "formLable":"output_name",
                    "value" : "",
                     "type" :"string"
                }
                createFromData['output_container'] = outputContainer
                createFromData['output_name'] = outputName

            }


            for (let key in createFromData) {
                count++;
                //console.log(`obj.${key} = ${createFromData[prop]}`);
                createFromData[key]['value'] = '';
                createFromData[key]['id'] = count + 100;
                createFromData[key]['formLabel'] = key;
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
            setFlag(true)
        }

    };

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }
    function onFormSubmit() {


    }

    const selectButtonStyle = {
        backgroundColor: '#61dafb',
        fontSize: 'inherit',
        margin: '5px',
        padding: '6px',
        color: 'black'
    };

    const buttonStyle = {
        backgroundColor: 'lightgrey',
        margin: '5px',
        padding: '6px',
        color: 'black'
    };

    function showFileManagerDialog() {
        setShowFMDialog(true);
    }

    function handleFMClose() {
        setShowFMDialog(false);
        //  childRef.current.getAlert()
    }

    const onFormCancel = () => {
        console.log(formElementsArray);
        // localStorage.removeItem('selectedJobDefinition')
    };


    const inputChangedHandler = (event, inputIdentifier) => {

        var value = event.target.value;

    }

    return (
        <div style={{ paddingLeft: '10px' }}>
            <Typography className="h2">&nbsp;{response != '' ?
                response.id : null}</Typography>
            <Typography className="h4 mb-12">&nbsp;{response != '' ? response.description : null}</Typography>
            <div>
                {Object.entries(formElementsArray).length !== 0 ? (
                    <Formsy
                        onValid={enableButton}
                        onInvalid={disableButton}
                        className="flex flex-col justify-center">
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
                                        changed={(event) => inputChangedHandler(event, formElement.id)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <Button
                                // type="submit"
                                variant="contained"
                                color="primary"
                                className="w-30  mt-32 mb-80"
                                aria-label="LOG IN"
                                onClick={onFormSubmit}
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
    );
}

export default JobDefinitionForm;
