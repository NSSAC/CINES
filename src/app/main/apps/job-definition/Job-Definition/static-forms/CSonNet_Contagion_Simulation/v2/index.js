import { Icon, MenuItem } from '@material-ui/core';
/* eslint-disable */
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import { JobService } from 'node-sciduct';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { FusePageSimple, SelectFormsy, TextFieldFormsy } from '@fuse';
import withReducer from 'app/store/withReducer';

import * as JobAppActions from "../../../store/actions";
import Toaster from "../../../Toaster";
import Deterministic_threshold from '../../CSonNet/deterministic_threshold.js';
// import SIS from './CSonNet/SIS/SIS.js';
// import ICM from './CSonNet/ICM.js';
// import LTM from './CSonNet/LTM.js';
// import PTM from './CSonNet/PTM.js';
import SEIR from '../../CSonNet/SEIR/SEIR.js';
import SIR from '../../CSonNet/SIR/SIR.js';
import modelJSON from '../../Schemas/CSonNet_modelDefinition_v2';
import foo from '../../Schemas/CSonNet_modelDefinition_v1'
import { Input } from '../../SelectFile.js'
import * as Actions from "../store/actions";
import reducer from '../store/reducers';

const CSonNet_Contagion_Simulation = (props) => {
    const dispatch = useDispatch()
    const jobData = useSelector(
        ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
    );

    const input_file_meta = useSelector(
        // (SimForm) =>{console.log("SimForm: ", SimForm); return SimForm.input_file}
        ({ SimForm }) => SimForm.input_file
    );

    const [isFormValid, setIsFormValid] = useState(false);
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [inputSchema, setInputSchema] = useState({});
    const [dynamicProps, setDynamicProps] = useState({})
    const [staticProps, setStaticProps] = useState({})
    const [success, setSuccess] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [onSubmit, setOnSubmit] = useState()
    const [inputFileMessage, setInputFileMessage] = useState(false)
    const [enableBlocking, setEnableBlocking] = useState(false)
    const [validInputFile,setValidInputFile] = useState(false)
    const history = useHistory();

    var count = 1;

    const childGrid = {
        paddingLeft: '8px',
        alignSelf: 'center'
    };

    const descStyle = {
        whiteSpace: "break-spaces",
    }

    function setInitialState(state) {
        const dp = {
            Behaviour: { id: 101, value: state && state.input && state.input.dynamic_inputs ? state.input.dynamic_inputs['Behaviour_model'] : "" },
            SIR_Submodel: { id: 201, value: state && state.input && state.input.dynamic_inputs ? state.input.dynamic_inputs['SIR_Submodel'] : "" },
            SIS_Submodel: { id: 202, value: state && state.input && state.input.dynamic_inputs ? state.input.dynamic_inputs['SIS_Submodel'] : "" },
            SEIR_Submodel: { id: 203, value: state && state.input && state.input.dynamic_inputs ? state.input.dynamic_inputs['SEIR_Submodel'] : "" },
            threshold: { id: 301, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.threshold) !== 'undefined' ? state.input.dynamic_inputs['threshold'] : "" },
            Edge_probability: { id: 302, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.Edge_probability) !== 'undefined' ? state.input.dynamic_inputs['Edge_probability'] : "" },
            Infectious_probability_transition: { id: 303, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.Infectious_probability_transition) !== 'undefined' ? state.input.dynamic_inputs['Infectious_probability_transition'] : "" },
            Infectious_duration: { id: 304, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.Infectious_duration) !== 'undefined' ? state.input.dynamic_inputs['Infectious_duration'] : "" },
            Exposed_duration: { id: 305, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.Exposed_duration) !== 'undefined' ? state.input.dynamic_inputs['Exposed_duration'] : "" },
            Exposed_probability_transition: { id: 306, value: state && state.input && state.input.dynamic_inputs && String(state.input.dynamic_inputs.Exposed_probability_transition) !== 'undefined' ? state.input.dynamic_inputs['Exposed_probability_transition'] : "" },
            blocking_state: {id: 307, value: state && state.input && state.input.dynamic_inputs && state.input.dynamic_inputs['blocking_state']?state.input.dynamic_inputs['blocking_state']:""},
            input_file: [jobData.input_files[0].name, {
                formLabel: jobData.input_files[0].name,
                key: "input_file",
                id: 0,
                name: jobData.input_files[0].name,
                outputFlag: false,
                required: true,
                types: jobData.input_files[0].types,
                value: state && state.input ? state.input["input_file"] : ""
            }],
            blocking_nodes: [jobData.input_files[1].name || '', {
                key: "blocking_nodes",
                formLabel: jobData.input_files[1].name || '',
                id: 1,
                name: jobData.input_files[1].name || '',
                outputFlag: false,
                types: jobData.input_files[1].types || [],
                required: false,
                value: state && state.input ? state.input["blocking_nodes"] : ""
            }]
        }

        setDynamicProps(dp)

        setStaticProps({
            Seed: { value: state && state.input ? state.input['random_number_seed'] : "" },
            Iterations: { value: state && state.input ? state.input['iterations'] : "" },
            TimeSteps: { value: state && state.input ? state.input['time_steps'] : "" },
            InitialConditions: state && state.input ? state.input['initial_states_method'] : [{ type: 'random', number_nodes: "", state: "" }],
            default_state: { value: state && state.input ? state.input['default_state'] : "" },
            Output_name: { value: (state && state.state !== "Completed") ? state.output_name : "" },
            outputPath: ['outputPath', {
                description: "Select the path from File manager where the output file is to be stored.",
                formLabel: "Output Container",
                required: true,
                id: 200,
                outputFlag: true,
                types: ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"],
                value: state && state.input ? state.output_container : "",
            }]
        })
    }

    //get the metadata for input_file (formerly Graph)
    useEffect(() => {
        if (dynamicProps && dynamicProps.input_file && dynamicProps.input_file[1] && dynamicProps.input_file[1].value) {
            if (!input_file_meta || !input_file_meta.id || (dynamicProps.input_file[1].value != input_file_meta.full_path)) {
                console.log(`dispatch getFileMeta(${dynamicProps.input_file[1].value})`)
                dispatch(Actions.getFileMeta(dynamicProps.input_file[1].value))
            } else {
                console.log(`${dynamicProps.input_file[1].value} == ${input_file_meta.full_path}`)
            }
        }
    }, [dispatch, dynamicProps])

    useEffect(() => {
        console.log("Use Effect #1 for setInitialState")
        console.log("resubmit: ", props.resubmit)
        console.log("job_definition: ", props.job_definition)
        console.log("jobData: ", jobData)
        console.log("dynamicProps: ", dynamicProps)

        // let pathEnd = 'net.science/CSonNet_Contagion_Simulation'
        let pathEnd = `${props.namespace}/${props.module}`
        setIsToasterFlag(false);
        console.log("jobData.id: ", jobData.id, "Props version: ", `${props.namespace}/${props.module}@${props.version}`)
        if ((!jobData || jobData.id && (jobData.id !== `${props.namespace}/${props.module}`)) || Object.keys(jobData).length === 0){
            // dispatch(JobAppActions.setSelectedItem(pathEnd));
            console.log(`Dispatch setSelectedItem: ${props.namespace}/${props.module}@${props.version}`)
            dispatch(JobAppActions.setSelectedItem(`${props.namespace}/${props.module}@${props.version}`));
        }else if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
            setSpinnerFlag(false)
            if (jobData) {
                if (input_file_meta && input_file_meta.provenance && input_file_meta.provenance.input) {
                        const updatedState={
                            ...input_file_meta.provenance,
                            input_file: [jobData.input_files[0].name, {
                                formLabel: jobData.input_files[0].name,
                                id: 0,
                                name: jobData.input_files[0].name,
                                outputFlag: false,
                                required: true,
                                types: jobData.input_files[0].types,
                                value: dynamicProps.input_files && (dynamicProps.input_files.length > 0) & dynamicProps.input_files[1].value
                            }]
                        }
                    console.log("Calling setInitialState #1 : ", updatedState)
                    setInitialState(updatedState)
                } else {
                    console.log("Set from else: ", props.resubmit )
                    setInitialState({})
                    // setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {})
                }

                props.resubmit && localStorage.setItem('formLastPath', props.resubmit.inputData.output_container + '/')
                setInputSchema(jobData.input_schema)
            }
        }
        // eslint-disable-next-line
    }, [jobData.id]);

    function getInputFileFromProvenance(provenance,name){
        var found;
        if (provenance.input_files && provenance.input_files.length>0){
            if (provenance.input_files.some((f)=>{
                if (f.name===name){
                    found=f
                    return true
                }
            })){
                return found
            }
        }
         
        return False
    }

    useEffect(() => {
        console.log("Use Effect #2 for setInitialState")

        if (jobData && input_file_meta) {
            console.log("input_file_meta: ", input_file_meta)
            if (input_file_meta.type === "csonnet_simulation_container") {
                if (input_file_meta.provenance && input_file_meta.provenance.input){
                    console.log("Calling setInitialState #1", input_file_meta.provenance)
                    
                    const pfile = getInputFileFromProvenance(input_file_meta.provenance,"input_file")

                    if (pfile && pfile['type']!="csonnet_simulation_container"){
                        setInitialState({
                            input: {
                                ...input_file_meta.provenance.input,
                            },
                            output_container: (staticProps.outputPath && staticProps.outputPath[1]) ? staticProps.outputPath[1].value : ""
                        })
                        setInputFileMessage(`Graph File: ${pfile.stored_name}`)
                        console.log("setValidInputFile(true)")

                        setValidInputFile(true)
                        setEnableBlocking(true)
                    }else{
                        setInputFileMessage(<div className="text-red-600 text-base mt-0">
                            Choosing a simulation as input that was previously run with another simulation as input is currently prohibited
                        </div>)
                        setValidInputFile(false)
                        setEnableBlocking(false)
 
                    }
                }else{
                    setEnableBlocking(false)
                    setInputFileMessage(false)
                }
            } else if (input_file_meta.type) {
                console.log("setValidInputFile(false) non-container")
                setInputFileMessage(false)
                setValidInputFile(true)
                setEnableBlocking(false)
            }else{
                setValidInputFile(false)
                setEnableBlocking(false)
                setInputFileMessage(false)
            }
        } else {
            console.log("setValidInputFile(false)")
            setValidInputFile(false)
            setEnableBlocking(false)
            setInputFileMessage(false)
        }
    }, [input_file_meta])

    useEffect(()=>{
        return(()=>
        dispatch(Actions.initializeInputForm())
        )
    },[])

    function disableButton() {
        setIsFormValid(false);
    }

    const onFormCancel = () => {
    };

    function populatesubmitJSON() {
        let submitJSON = {
            "input_file": dynamicProps.input_file[1].value,
            "states_that_affect_neighbors": [],
            "iterations": parseInt(staticProps.Iterations.value),
            "time_steps": parseInt(staticProps.TimeSteps.value),
            'initial_states_method': staticProps.InitialConditions,
            "default_state": staticProps.default_state.value,
            "random_number_seed": parseInt(staticProps.Seed.value),
            'decorations': [],
            "dynamic_inputs": {}
        }

        if (dynamicProps.blocking_nodes && dynamicProps.blocking_nodes[1].value){
            submitJSON.blocking_nodes = dynamicProps.blocking_nodes[1].value
            submitJSON.blocking_states = dynamicProps.blocking_state.value
        }

        let tempRules = {}

        switch (dynamicProps.Behaviour.value) {
            case 'Threshold Model':
                submitJSON.dynamic_inputs.Behaviour_model = dynamicProps.Behaviour.value
                submitJSON.states = modelJSON['models']['threshold_model']['states'];
                // submitJSON.default_state = modelJSON['models']['threshold_model']['default_state'];
                tempRules = modelJSON['models']['threshold_model']['rules'][0]['rule'];
                tempRules['deterministic_progressive_blocking_node_threshold_value'] = parseInt(dynamicProps.threshold.value);
                submitJSON.dynamic_inputs.threshold = parseInt(dynamicProps.threshold.value);
                submitJSON.rules = []
                submitJSON.rules[0] = tempRules;
                break;

            case 'SEIR Model':
                submitJSON.dynamic_inputs.Behaviour_model = dynamicProps.Behaviour.value
                submitJSON.states = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['states'];
                // submitJSON.default_state = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['default_state'];
                submitJSON.rules = []
                switch (dynamicProps.SEIR_Submodel.value) {
                    case 'SEIR1':
                        submitJSON.dynamic_inputs.SEIR_Submodel = dynamicProps.SEIR_Submodel.value
                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.rules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = parseInt(dynamicProps.Exposed_duration.value);
                        submitJSON.rules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][2]['rule'];
                        tempRules["discrete_time_auto_value"] = parseInt(dynamicProps.Infectious_duration.value);
                        submitJSON.rules[2] = tempRules;

                        submitJSON.dynamic_inputs.Edge_probability = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.dynamic_inputs.Exposed_duration = parseInt(dynamicProps.Exposed_duration.value);
                        submitJSON.dynamic_inputs.Infectious_duration = parseInt(dynamicProps.Infectious_duration.value);

                        break;

                    case 'SEIR2':
                        submitJSON.dynamic_inputs.SEIR_Submodel = dynamicProps.SEIR_Submodel.value
                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.rules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = parseInt(dynamicProps.Exposed_duration.value);
                        submitJSON.rules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][2]['rule'];
                        tempRules["node_probability_auto_value"] = parseFloat(dynamicProps.Infectious_probability_transition.value);
                        submitJSON.rules[2] = tempRules;

                        submitJSON.dynamic_inputs.Edge_probability = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.dynamic_inputs.Exposed_duration = parseInt(dynamicProps.Exposed_duration.value);
                        submitJSON.dynamic_inputs.Infectious_probability_transition = parseFloat(dynamicProps.Infectious_probability_transition.value);

                        break;

                    case 'SEIR3':
                        submitJSON.dynamic_inputs.SEIR_Submodel = dynamicProps.SEIR_Submodel.value
                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.rules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][1]['rule'];
                        tempRules["node_probability_auto_value"] = parseFloat(dynamicProps.Exposed_probability_transition.value);
                        submitJSON.rules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][2]['rule'];
                        tempRules["discrete_time_auto_value"] = parseInt(dynamicProps.Infectious_duration.value);
                        submitJSON.rules[2] = tempRules;

                        submitJSON.dynamic_inputs.Edge_probability = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.dynamic_inputs.Exposed_probability_transition = parseFloat(dynamicProps.Exposed_probability_transition.value);
                        submitJSON.dynamic_inputs.Infectious_duration = parseInt(dynamicProps.Infectious_duration.value);

                        break;

                    case 'SEIR4':
                        submitJSON.dynamic_inputs.SEIR_Submodel = dynamicProps.SEIR_Submodel.value
                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.rules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][1]['rule'];
                        tempRules["node_probability_auto_value"] = parseFloat(dynamicProps.Exposed_probability_transition.value);
                        submitJSON.rules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][2]['rule'];
                        tempRules["node_probability_auto_value"] = parseFloat(dynamicProps.Infectious_probability_transition.value);
                        submitJSON.rules[2] = tempRules;

                        submitJSON.dynamic_inputs.Edge_probability = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.dynamic_inputs.Exposed_probability_transition = parseFloat(dynamicProps.Exposed_probability_transition.value);
                        submitJSON.dynamic_inputs.Infectious_probability_transition = parseFloat(dynamicProps.Infectious_probability_transition.value);
                        break;
                }
                break;

            case 'SIR Model':
                submitJSON.dynamic_inputs.Behaviour_model = dynamicProps.Behaviour.value
                submitJSON.states = modelJSON['models']['SIR']['submodels']['fixed infectious']['states'];
                // submitJSON.default_state = modelJSON['models']['SIR']['submodels']['fixed infectious']['default_state'];
                submitJSON.rules = []
                switch (dynamicProps.SIR_Submodel.value) {
                    case 'fixed infectious':
                        submitJSON.dynamic_inputs.SIR_Submodel = dynamicProps.SIR_Submodel.value
                        tempRules = modelJSON['models']['SIR']['submodels']['fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.rules[0] = tempRules;

                        tempRules = modelJSON['models']['SIR']['submodels']['fixed infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = parseInt(dynamicProps.Infectious_duration.value);
                        submitJSON.rules[1] = tempRules;

                        submitJSON.dynamic_inputs.Edge_probability = parseFloat(dynamicProps.Edge_probability.value);
                        submitJSON.dynamic_inputs.Infectious_duration = parseInt(dynamicProps.Infectious_duration.value);

                        break;
                }
                break;

        }
        console.log(submitJSON)
        populateBody(submitJSON)
    }

    function populateBody(submitJSON) {
        setIsToasterFlag(true);
        // var path = window.location.pathname.replace("/apps/job-definition/", "");
        // var jobDefinition = path;
        var requestJson = {
            input: submitJSON,
            job_definition: `${jobData.id}@${jobData.version}`,
            output_container: staticProps.outputPath[1].value,
            output_name: staticProps.Output_name.value
        };

        console.log(requestJson)
        onFormSubmit(requestJson)

    }

    function onFormSubmit(requestJson) {
        setOnSubmit(true)
        const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
        const token = localStorage.getItem('id_token');
        const jobServiceInstance = new JobService(url, token)
        // console.log("DO SUBMIT HERE: ",requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container)
        // return;
        jobServiceInstance.createJobInstance(requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container).then(res => {
            setIsToasterFlag(true)
            setSuccess(true)
            window.setTimeout(
                delayNavigation
                , 4000);

        },
            (error) => {
                setSuccess(false)
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`)
                else
                    setErrorMsg("An internal error occured. Please try again")
                setIsToasterFlag(true)
                window.setTimeout(handlingError, 4000);
            }
        )
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handlingError() {
        setIsToasterFlag(false);
        setSuccess();
        setOnSubmit(true)
    }

    function delayNavigation() {
        dispatch(Actions.initializeInputForm())
        history.push('/apps/my-jobs/');
    }

    const description = (desc) =>
        <span style={{ marginTop: '38px' }} data-tip={desc}>
            <Icon fontSize="small">info</Icon>
        </span>

    function dynamicChangedHandler(event, obj) {
        const updatedJobSubmissionForm = {
            ...dynamicProps
        };

        var updatedFormElement;

        if (dynamicProps[obj] instanceof Array){
             updatedFormElement=[dynamicProps[obj][0],{...dynamicProps[obj][1]}]
        }else{
             updatedFormElement = {
                ...dynamicProps[obj]
            };
        }


        if (obj === 'Behaviour') {
            Object.entries(updatedJobSubmissionForm).map((formElement) => {
                if (formElement[1].id > 200 && formElement[1].id < 400) {
                    formElement[1].value = ""
                }
            }
            )

            if (event.target.value === 'Threshold Model')
                staticProps.default_state.value = '0'
            else
                staticProps.default_state.value = 'S'

        }

        if (updatedFormElement instanceof Array){
            updatedFormElement[1].value = event.target.value
        }else{
            updatedFormElement.value = event.target.value;
        }
        

        updatedJobSubmissionForm[obj] = updatedFormElement;
        setDynamicProps({ ...updatedJobSubmissionForm })

    }

    function staticChangedHandler(event, obj) {
        const updatedJobSubmissionForm = {
            ...staticProps
        };
        const updatedFormElement = {
            ...staticProps[obj]
        };

        updatedFormElement.value = event.target.value;

        updatedJobSubmissionForm[obj] = updatedFormElement;
        setStaticProps({ ...updatedJobSubmissionForm });
    }

    function ICChangedHandler(event, obj) {
        const updatedJobSubmissionForm = {
            ...staticProps
        };
        const updatedFormElement = {
            ...staticProps['InitialConditions']
        };

        if (obj === 'number_nodes')
            updatedFormElement[0][obj] = parseInt(event.target.value) || "";
        else
            updatedFormElement[0][obj] = event.target.value;

        updatedJobSubmissionForm[obj] = updatedFormElement;
        setStaticProps({ ...updatedJobSubmissionForm });
    }

    useEffect(() => {
        ReactTooltip.rebuild();
    })

    // console.log("Before render input_file_meta: ", input_file_meta)
    console.log("Disabled?",enableBlocking || !validInputFile)
    console.log("enableBlocking", enableBlocking)
    console.log("ValidInputFile?",validInputFile)
    if (!(Object.keys(inputSchema).length === 0 && inputSchema.constructor === Object))
        return (
            <FusePageSimple
                classes={{
                    root: 'root',
                    header: 'headerDisplay'
                }}
                header={
                    <div className="text-white-600">Head Content</div>
                }
                content={
                    <div className="flex">
                        <ReactTooltip clickable={true} isCapture={true} scrollHide={true} className='toolTip' place='top' effect='solid' />
                        <div className="content">
                            <div className='flex flex-col' >
                                {isToasterFlag ? (
                                    <Toaster errorMsg={errorMsg} success={success} id="CSonNet Contagion Simulation 2"></Toaster>
                                ) : null}
                                <Formsy
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    className="content1"
                                >
                                    <div className='columnStyle'>
                                        <div className='borderStyle '>
                                            <h3><b>Input</b></h3>
                                            <p>Input may either be a Graph or a previous simulation.</p>
                                            <Grid item container xs={12} className="whitespace-normal">
                                                <Input
                                                    formData={dynamicProps.input_file}
                                                    elementType={dynamicProps.input_file.types}
                                                    value={dynamicProps.input_file.value}
                                                    changed={(event) => dynamicChangedHandler(event, 'input_file')}
                                                // changed={(evt)=>{console.log("Input File Changed")}}
                                                />
                                                {input_file_meta && input_file_meta.type && (inputFileMessage) && (
                                                       <React.Fragment>{inputFileMessage}</React.Fragment>
                                                )}

                                            </Grid>

                                        </div>
                                        <div className='borderStyle'>
                                            <h3><b>Dynamics Model</b></h3>
                                            <Grid style={childGrid} item container xs={12} >
                                                <SelectFormsy
                                                    className="my-12 inputStyle1 model"
                                                    name="Behaviour Model"
                                                    label={["Behaviour Model", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                    value={dynamicProps.Behaviour.value}
                                                    disabled={enableBlocking || !validInputFile}
                                                    onChange={(event) => dynamicChangedHandler(event, 'Behaviour')}
                                                    required

                                                >

                                                    <MenuItem key='Threshold Model' value='Threshold Model'>Threshold Model</MenuItem>
                                                    <MenuItem key='SEIR model' value='SEIR Model'>SEIR Model</MenuItem>
                                                    <MenuItem key='SIR Model' value='SIR Model'>SIR Model</MenuItem>
                                                    {/* <MenuItem key='SIS Model' value='SIS Model'>SIS Model</MenuItem>
                                                <MenuItem key='Independent cascade model' value='Independent Cascade Model'>Independent Cascade Model</MenuItem>
                                                <MenuItem key='Linear Threshold Model' value='Linear Threshold Model'>Linear Threshold Model</MenuItem>
                                                <MenuItem key='Probabilistic Threshold Model' value='Probabilistic Threshold Model'>Probabilistic Threshold Model</MenuItem> */}

                                                </SelectFormsy>
                                            </Grid>
                                            {dynamicProps.Behaviour.value === 'Threshold Model' && <Deterministic_threshold disabled={enableBlocking || !validInputFile} changed={dynamicChangedHandler} modelJSON={modelJSON} threshold_property="deterministic_progressive_blocking_node_threshold_value"
                                                dynamicProps={dynamicProps}></Deterministic_threshold>}
                                            {dynamicProps.Behaviour.value === 'SEIR Model' && <SEIR disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SEIR>}
                                            {dynamicProps.Behaviour.value === 'SIR Model' && <SIR disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SIR>}
                                            {dynamicProps.Behaviour.value === 'SIS Model' && <SIS disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SIS>}
                                            {dynamicProps.Behaviour.value === 'Independent Cascade Model' && <ICM disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></ICM>}
                                            {dynamicProps.Behaviour.value === 'Linear Threshold Model' && <LTM disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></LTM>}
                                            {dynamicProps.Behaviour.value === 'Probabilistic Threshold Model' && <PTM disabled={enableBlocking || !validInputFile} modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></PTM>}
                                        </div>
                                    </div>
                                    {<div className='columnStyle divideProps'>
                                        {<div className="borderStyle">
                                            <h3><b>Stochasticity</b></h3>
                                            {<Grid style={childGrid} item container xs={12} >
                                                <TextFieldFormsy
                                                    className="my-12 inputStyle1"
                                                    type="text"
                                                    name='Seed'
                                                    style={{ width: '18px' }}
                                                    value={String(staticProps.Seed.value)}
                                                    label="Seed"
                                                    onBlur={(event) => staticChangedHandler(event, 'Seed')}
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    disabled={!validInputFile}
                                                    required
                                                />
                                                {description(inputSchema.properties.random_number_seed.description)}
                                            </Grid>}
                                        </div>}
                                        <div className='borderStyle'>
                                            <h3><b>Composition Of Simulation</b></h3>
                                            <div style={{ marginLeft: '26px' }}>
                                                <h4 className='mt-16'><b>Simulation Timing</b></h4>
                                                <Grid style={childGrid} item container xs={12} >
                                                    <TextFieldFormsy
                                                        className="my-12 inputStyle1"
                                                        type="text"
                                                        name='Iterations'
                                                        style={{ width: '18px' }}
                                                        label="Iterations"
                                                        value={String(staticProps.Iterations.value)}
                                                        onBlur={(event) => staticChangedHandler(event, 'Iterations')}
                                                        validations={{
                                                            isPositiveInt: function (values, value) {
                                                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                            }
                                                        }}
                                                        validationError="This is not a valid value"
                                                        autoComplete="off"
                                                        disabled={!validInputFile}
                                                        required
                                                    />
                                                    {description(inputSchema.properties.iterations.description)}
                                                </Grid>
                                                <Grid style={childGrid} item container xs={12} >
                                                    <TextFieldFormsy
                                                        className="my-12 inputStyle1"
                                                        type="text"
                                                        name='Time Steps'
                                                        style={{ width: '18px' }}
                                                        value={String(staticProps.TimeSteps.value)}
                                                        onBlur={(event) => staticChangedHandler(event, 'TimeSteps')}
                                                        label="Time Steps"
                                                        validations={{
                                                            isPositiveInt: function (values, value) {
                                                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                            }
                                                        }}
                                                        validationError="This is not a valid value"
                                                        autoComplete="off"
                                                        disabled={!validInputFile}
                                                        required
                                                    />
                                                    {description(inputSchema.properties.time_steps.description)}
                                                </Grid>
                                            </div>
                                            {enableBlocking && (
                                                <div style={{ marginLeft: '26px' }}>
                                                    <h4 className='mt-16'><b>Blocking Nodes</b></h4>
                                            
                                                    <Grid style={childGrid} item container xs={12} >
                                                        <Input
                                                            formData={dynamicProps.blocking_nodes}
                                                            // elementType={dynamicProps.blocking_nodes[1].types}
                                                            // value={dynamicProps.blocking_nodes[1].value}
                                                            required={dynamicProps.blocking_nodes[1].required}
                                                            changed={(event) => dynamicChangedHandler(event, 'blocking_nodes')}
                                                        />
                                                    </Grid>

                                                    {dynamicProps && dynamicProps.blocking_nodes && dynamicProps.blocking_nodes[1].value && (<Grid style={childGrid} item container xs={12} >
                                                        <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="Blocking State"
                                                            label={["Blocking State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            value={dynamicProps.blocking_state.value}
                                                            onChange={(event) => dynamicChangedHandler(event, 'blocking_state')}
                                                            required={true}
                                                        

                                                        >
                                                            {modelJSON.models["threshold_model"].blocking_states.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>
                                                    </Grid>)}

                                                </div>
                                            )}
                                            {!enableBlocking && (
                                                <div style={{ marginLeft: '26px' }}>
                                                    <h4 className='mt-16'><b>Initial Conditions</b></h4>
                                                    <Grid style={childGrid} item container xs={12} >
                                                        <TextFieldFormsy
                                                            className="my-12 inputStyle1"
                                                            type="text"
                                                            name='Number nodes'
                                                            style={{ width: '18px' }}
                                                            value={staticProps && staticProps.InitialConditions && String(staticProps.InitialConditions[0].number_nodes)}
                                                            onBlur={(event) => ICChangedHandler(event, 'number_nodes')}
                                                            label="Number Nodes"
                                                            validations={{
                                                                isPositiveInt: function (values, value) {
                                                                    return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                                }
                                                            }}
                                                            validationError="This is not a valid value"
                                                            autoComplete="off"
                                                            required
                                                            disabled={!validInputFile}
                                                        />
                                                    </Grid>
                                                    <Grid style={childGrid} item container xs={12} >
                                                        {dynamicProps.Behaviour.value === 'Threshold Model' && <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="state"
                                                            label={["State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            disabled={!validInputFile}
                                                            value={modelJSON.models.threshold_model.states.indexOf(staticProps.InitialConditions[0].state) !== -1 ? staticProps.InitialConditions[0].state : ""}
                                                            onChange={(event) => ICChangedHandler(event, 'state')}
                                                            required
                                                        >
                                                            {modelJSON.models.threshold_model.states.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>}

                                                        {dynamicProps.Behaviour.value === 'SEIR Model' && <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="state"
                                                            label={["State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            disabled={!validInputFile}
                                                            value={modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].states.indexOf(staticProps.InitialConditions[0].state) !== -1 ? staticProps.InitialConditions[0].state : ""}
                                                            onChange={(event) => ICChangedHandler(event, 'state')}
                                                            required
                                                        >
                                                            {modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].states.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>}

                                                        {dynamicProps.Behaviour.value === 'SIR Model' && <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="state"
                                                            label={["State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            disabled={!validInputFile}
                                                            value={modelJSON.models.SIR.submodels['fixed infectious'].states.indexOf(staticProps.InitialConditions[0].state) !== -1 ? staticProps.InitialConditions[0].state : ""}
                                                            onChange={(event) => ICChangedHandler(event, 'state')}
                                                            required
                                                        >
                                                            {modelJSON.models.SIR.submodels['fixed infectious'].states.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>}

                                                        {dynamicProps.Behaviour.value !== '' && description(inputSchema.properties.initial_states_method.items.oneOf[0].properties.state.description)}
                                                    </Grid>
                                                </div>
                                            )}
                                            {!enableBlocking && dynamicProps.Behaviour.value !== '' && <div style={{ marginLeft: '26px' }}>
                                                <h4 className='my-16'><b>Initial Conditions (default)</b></h4>
                                                <Grid style={childGrid} item container xs={12} >
                                                    {dynamicProps.Behaviour.value === 'Threshold Model' && <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.threshold_model.default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
                                                        required
                                                        disabled={!validInputFile}
                                                    >
                                                        {modelJSON.models.threshold_model.states.map((item) => {
                                                            return (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </SelectFormsy>}
                                                    {dynamicProps.Behaviour.value === 'SEIR Model' && <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
                                                        required
                                                        disabled={!validInputFile}
                                                    >
                                                        {modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].states.map((item) => {
                                                            return (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </SelectFormsy>}
                                                    {dynamicProps.Behaviour.value === 'SIR Model' && <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.SIR.submodels['fixed infectious'].default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
                                                        required
                                                        disabled={!validInputFile}
                                                    >
                                                        {modelJSON.models.SIR.submodels['fixed infectious'].states.map((item) => {
                                                            return (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </SelectFormsy>}
                                                    {description(inputSchema.properties.default_state.description)}
                                                </Grid>
                                            </div>}
                                            {/* <Input_conditions ></Input_conditions> */}

                                        </div>
                                        <div className='borderStyle'>
                                            <h3><b>Output</b></h3>
                                            <Grid style={childGrid} item container xs={12} >
                                                <TextFieldFormsy
                                                    className="my-12 inputStyle1"
                                                    type="text"
                                                    name='Output Name'
                                                    style={{ width: '18px' }}
                                                    value={staticProps.Output_name.value}
                                                    label="Output Name"
                                                    onBlur={(event) => staticChangedHandler(event, 'Output_name')}
                                                    autoComplete="off"
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value);
                                                        },
                                                    }}
                                                    validationError="This is not a valid value"
                                                    required
                                                />
                                            </Grid>
                                            <Grid style={childGrid} item container xs={12}>
                                                <Input
                                                    formData={staticProps.outputPath}
                                                    elementType={staticProps.outputPath.types}
                                                    value={staticProps.outputPath.value}
                                                    changed={(event) => { staticChangedHandler(event, 'outputPath') }}
                                                    required
                                                />
                                            </Grid>
                                        </div>

                                    </div>}

                                </Formsy>
                                {/* </fieldset> */}
                                <div style={{ alignSelf: 'flex-end' }}>
                                    <Button
                                        // type="submit"
                                        variant="contained"
                                        color="primary"
                                        className="w-30 ml-8 mt-32 mb-80"
                                        aria-label="Submit"
                                        onClick={populatesubmitJSON}
                                        disabled={!isFormValid || !validInputFile || success}                                    >
                                        Submit
                                    </Button>
                                    {props.resubmit ? <Link to="/apps/my-jobs/" style={{ color: 'transparent' }}>
                                        <Button
                                            variant="contained"
                                            onClick={onFormCancel}
                                            color="primary"
                                            className="w-30 mx-8 mt-32 mb-80"
                                        >
                                            Cancel
                                        </Button>
                                    </Link> :
                                        <Link to="/apps/job-definition/" style={{ color: 'transparent' }}>
                                            <Button
                                                variant="contained"
                                                onClick={onFormCancel}
                                                color="primary"
                                                className="w-30 mx-8 mt-32 mb-80"
                                            >
                                                Cancel
                                            </Button>
                                        </Link>}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

        );
    else return null
}

export default withReducer('SimForm', reducer)(CSonNet_Contagion_Simulation)
// export default CSonNet_Contagion_Simulation
