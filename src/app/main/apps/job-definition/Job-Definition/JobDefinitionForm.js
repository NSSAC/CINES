import { FuseAnimate, FusePageSimple } from '@fuse/index.js';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from '../../file-manager/FileUpload/FileUploadDialog.js';
import FMPopup from './file-manager-dialog/FileManagerDialog.js';
import './JobDefinitionForm.css';
import axios from 'axios';
import { Input } from 'app/main/apps/job-definition/Job-Definition/Input';
import Toaster from './Toaster';
import Formsy from 'formsy-react';
import { fromPairs } from 'lodash';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

function JobDefinitionForm(props) {
    const [showFMDialog, setShowFMDialog] = useState(false);
    const [showDialog, setshowDialog] = useState(false);
    const [fileChosen, setFileChosen] = useState('');
    const [formElementsArray, setFormElementsArray] = useState({});
    const [jobSubmissionArray ,setJobSubmissionArray] =useState({})
    const [isFormValid, setIsFormValid] = useState(false);
    const [flag, setFlag] = useState(false)
    const [response, setResponse] = useState('')
    const [success, setSuccess]= useState(false);
    const parentGrid = {
        borderTop: '2px solid black',
        borderBottom: '2px solid black'
    };

    const childGrid = {
        borderRight: '1px solid black',
        paddingLeft: '20px'
    };
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
                    // console.log(response)
                    // console.log(JSON.parse(res.data.input_schema).properties)


                    creatForm(createFromData, inputFileData,outputFiles, responseData);
                    return(
                        setSuccess(true)
   )
                }
            },
            (error) => {
  
}
             
        );
    }, [axios]);

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
                    obj["outputFlag"]= false;

                    //  let keyName = obj.name
                    // createFromData[keyName] = obj
                }
            }
            if(outputFiles!=undefined){

                let outputContainer={
                    "id":200,
                    "formLable":"output_container",
                    "value" : "",
                    "description":"Select the path from File manager where the output file is to be stored.",
                    "types": ['folder','epihiper_multicell_analysis','epihiperOutput'],
                    "outputFlag": true
                }
                let outputName={
                    "id":201,
                    "formLable":"output_name",
                    "value" : "",
                    "type" : 'string',
                    "fileType" : outputFiles.type
                }
                createFromData['output_container'] = outputContainer
                createFromData['output_name'] = outputName

            }


            for (let key in createFromData) {
                count++;
                //console.log(`obj.${key} = ${createFromData[prop]}`);
               // createFromData[key]['value'] = '';
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

    const inputChangedHandler = (event, inputIdentifier) => {

        const updatedJobSubmissionForm = {
            ...formElementsArray
        };
        const updatedFormElement = { 
            ...updatedJobSubmissionForm[inputIdentifier]
        };
        // if( updatedFormElement.type === 'integer'){
        //     updatedFormElement.value = parseInt(event.target.value);
        // }
        // else{
        //     updatedFormElement.value = event.target.value;
        // }
         updatedFormElement.value = event.target.value;
        updatedJobSubmissionForm[inputIdentifier] = updatedFormElement;
        setFormElementsArray({...updatedJobSubmissionForm});    

    }

    const createSubmissionData =() =>{
        var path = window.location.pathname.replace("/apps/job-definition/" ,"")
         var jobDefinition =path
        var input ={}
     
        for(let key in formElementsArray){

        input[key] = formElementsArray[key].value

        }
        setJobSubmissionArray({input:input ,job_definition: jobDefinition,"pragmas": {
            "account": "ARCS:bii_nssac"
            }})

    }
    function onFormSubmit() {
        createSubmissionData() 
        var path = window.location.pathname.replace("/apps/job-definition/" ,"")
         var jobDefinition =path
         const userToken = localStorage.getItem('id_token')
        axios({
            method: 'post',
            url: "https://sciduct.bii.virginia.edu/jobsvc/job_instance/" ,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '* ',
              'Authorization': userToken,
    
            },
            data: jobSubmissionArray,
          }).then(res => {
           
          },
            (error) => { 
                return (
    <div> {ToastsStore.error("An error occurred. Please try again.")}
    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
   )
            }
          )
       
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
        //  childRef.current.getAlert()
    }

    const onFormCancel = () => {
        console.log(formElementsArray);
        console.log(jobSubmissionArray)
        // localStorage.removeItem('selectedJobDefinition')
    };

if(success){
 

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
                                        changed={(event) => inputChangedHandler(event, formElement[0])}
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
            {/* <Toaster></Toaster> */}
        </div>
    );
}

export default JobDefinitionForm;
