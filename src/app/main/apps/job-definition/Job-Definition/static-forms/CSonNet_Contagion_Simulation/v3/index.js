/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Formsy from 'formsy-react';
import { JobService } from 'node-sciduct';
import { Button, Grid, Icon, MenuItem } from '@material-ui/core';
import { FusePageSimple, SelectFormsy, TextFieldFormsy } from '@fuse';

import withReducer from 'app/store/withReducer';
import { Submodels } from './submodels';

import reducer from '../store/reducers';
import * as Actions from "../store/actions";

import modelJSON from '../../Schemas/CSonNet_modelDefinition_v3';
import { Input } from '../../SelectFile.js'
import Toaster from "../../../Toaster";

import * as JobAppActions from "../../../store/actions";

const CSonNet_Contagion_Simulation_v3 = (props) => {

    const dispatch = useDispatch();
    const jobData = useSelector(
        ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
    );
    const input_file_meta = useSelector(({ SimForm }) => SimForm.input_file);
    const [inputFileChangeCounter, setInputFileChangeCounter]  = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [success, setSuccess] = useState();
    const [, setOnSubmit] = useState();
    const [, setSpinnerFlag] = useState(true);
    const [dynamicProps, setDynamicProps] = useState({});
    const [staticProps, setStaticProps] = useState({});
    const [inputFileMessage, setInputFileMessage] = useState(false);
    const [enableBlocking, setEnableBlocking] = useState(false);
    const [validInputFile, setValidInputFile] = useState(false);
    const [inputSchema, setInputSchema] = useState({});
    const [submodelArray, setSubmodelArray] = useState([]);
    const [statesArray, setStatesArray] = useState([]);
    const [rules, setRules] = useState([]);
    const [randomNumberSeed, setRandomNumberSeed] = useState();
    const history = useHistory();

    const childGrid = {
        paddingLeft: '8px',
        alignSelf: 'center',
    };

    var blockingStatesValue = "";
    var blockingNodesValue = "";

    // Use Effect #1 for setInitialState
    useEffect(() => {
        let pathEnd = `${props.namespace}/${props.module}`;
        setIsToasterFlag(false);
        if ((!jobData || jobData.id && (jobData.id !== `${props.namespace}/${props.module}`)) || Object.keys(jobData).length === 0) {
            dispatch(JobAppActions.setSelectedItem(`${props.namespace}/${props.module}@${props.version}`));
        } else if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
            setSpinnerFlag(false);
            if (jobData) {
                if (input_file_meta && input_file_meta.provenance && input_file_meta.provenance.input) {
                    const updatedState = {
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
                    setInitialState(updatedState);
                } else {
                    if(props.resubmit && props.resubmit.inputData) {
                        setRandomNumberSeed(props.resubmit.inputData.input.random_number_seed);
                    }
                    setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                }
                props.resubmit && localStorage.setItem('last_selected_folder', props.resubmit.inputData.output_container);
                setInputSchema(jobData.input_schema);
            }
        }
    }, [jobData.id]);

    // Use Effect #2 for setInitialState
    useEffect(() => {
        if (dynamicProps && dynamicProps.input_file && dynamicProps.input_file[1] && dynamicProps.input_file[1].value) {
            if (!input_file_meta || !input_file_meta.id || (dynamicProps.input_file[1].value !== input_file_meta.full_path)) {
                // console.log(`dispatch getFileMeta(${dynamicProps.input_file[1].value})`)
                dispatch(Actions.getFileMeta(dynamicProps.input_file[1].value));
            }
            // else {
            //     console.log(`${dynamicProps.input_file[1].value} == ${input_file_meta.full_path}`)
            // }
        }
    }, [dispatch, dynamicProps])

    useEffect(() => {
        return (
            localStorage.removeItem('last_selected_folder')
        )
    }, [])

    useEffect (() => {
        if(props.resubmit) {
            if (input_file_meta.hasOwnProperty("name")) { 
                if(props.resubmit.inputData.input["input_file"].includes(input_file_meta["name"])) {
                    blockingStatesValue = props.resubmit.inputData.input["blocking_states"];
                    blockingNodesValue = props.resubmit.inputData.input["blocking_nodes"];
                }
            }
            setInputFileChangeCounter(inputFileChangeCounter  + 1);
        }
    },[input_file_meta])

    useEffect(() => {
        // console.log("Use Effect #1 for setInitialState")
        // console.log("resubmit: ", props.resubmit)
        // console.log("job_definition: ", props.job_definition)
        // console.log("jobData: ", jobData)
        // console.log("dynamicProps: ", dynamicProps)
        // let pathEnd = 'net.science/CSonNet_Contagion_Simulation'
        let pathEnd = `${props.namespace}/${props.module}`
        setIsToasterFlag(false);
        // console.log("jobData.id: ", jobData.id, "Props version: ", `${props.namespace}/${props.module}@${props.version}`);
        if ((!jobData || jobData.id && (jobData.id !== `${props.namespace}/${props.module}`)) || Object.keys(jobData).length === 0) {
            // dispatch(JobAppActions.setSelectedItem(pathEnd));
            // console.log(`Dispatch setSelectedItem: ${props.namespace}/${props.module}@${props.version}`);
            dispatch(JobAppActions.setSelectedItem(`${props.namespace}/${props.module}@${props.version}`));
        } else if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
            setSpinnerFlag(false);
            if (jobData) {
                if (input_file_meta && input_file_meta.provenance && input_file_meta.provenance.input) {
                    const updatedState = {
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
                    // console.log("Calling setInitialState #1 : ", updatedState);
                    setInitialState(updatedState);
                } else {
                    // console.log("Set from else: ", props.resubmit);
                    setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                }
                props.resubmit && localStorage.setItem('last_selected_folder', props.resubmit.inputData.output_container);
                setInputSchema(jobData.input_schema);
            }
        }
        // eslint-disable-next-line
    }, [jobData.id]);

    function getInputFileFromProvenance(provenance, name) {
        var found;
        if (provenance.input_files && provenance.input_files.length > 0) {
            if (provenance.input_files.some((f) => {
                if (f.name === name) {
                    found = f;
                    return true;
                }
            })) {
                return found;
            }
        }
        return false
    }

    useEffect(() => {
        // console.log("Use Effect #2 for setInitialState")   
        if (jobData && input_file_meta) {
            // console.log("input_file_meta: ", input_file_meta);
            if (input_file_meta.type === "csonnet_simulation_container") {
                if (input_file_meta.provenance && input_file_meta.provenance.input) {
                    // console.log("Calling setInitialState #1", input_file_meta.provenance);
                    const pfile = getInputFileFromProvenance(input_file_meta.provenance, "input_file");
                    if (pfile && pfile['type'] !== "csonnet_simulation_container") {
                        setInitialState({
                            input: props.resubmit ? {
                                ...input_file_meta.provenance.input, 
                                input_file: props.resubmit.inputData.input["input_file"], 
                                blocking_states: inputFileChangeCounter <= 2 ? blockingStatesValue : '',
                                blocking_nodes: inputFileChangeCounter <= 2 ? blockingNodesValue : '',
                                // blocking_states: input_file_meta.hasOwnProperty("name") && props.resubmit.inputData.input["input_file"].includes(input_file_meta["name"]) ? props.resubmit.inputData.input["blocking_states"] : "",
                                // blocking_nodes: input_file_meta.hasOwnProperty("name") && props.resubmit.inputData.input["input_file"].includes(input_file_meta["name"]) ? props.resubmit.inputData.input["blocking_nodes"] : "",
                            } : {
                                ...input_file_meta.provenance.input
                            },
                            output_container: (staticProps.outputPath && staticProps.outputPath[1]) ? staticProps.outputPath[1].value : "",
                        })
                        setInputFileMessage(`Graph File: ${pfile.stored_name}`)
                        // console.log("setValidInputFile(true)");
                        setValidInputFile(true);
                        setEnableBlocking(true);
                    } else {
                        setInputFileMessage(<div className="text-red-600 text-base mt-0">
                            Choosing a simulation as input that was previously run with another simulation as input is currently prohibited
                        </div>)
                        setValidInputFile(false);
                        setEnableBlocking(false);
                    }
                } else {
                    setEnableBlocking(false);
                    setInputFileMessage(false);
                }
            } else if (input_file_meta.type) {
                // console.log("setValidInputFile(false) non-container");
                setInputFileMessage(false);
                setValidInputFile(true);
                setEnableBlocking(false);
            } else {
                setValidInputFile(false);
                setEnableBlocking(false);
                setInputFileMessage(false);
            }
        } else {
            // console.log("setValidInputFile(false)");
            setValidInputFile(false);
            setEnableBlocking(false);
            setInputFileMessage(false);
        }
    }, [input_file_meta])

    useEffect(() => {
        return (() =>
            dispatch(Actions.initializeInputForm())
        )
    }, [])

    useEffect(() => {
        ReactTooltip.rebuild();
    })

    useEffect(() => {
        // console.log("Resubmit Props Data --->",props.resubmit);
        if(props.resubmit) {
            setDynamicProps(props.resubmit.inputData.input.dynamicProps);
            setSubmodelArray(props.resubmit.inputData.input.submodelArrayData);
            setRules(props.resubmit.inputData.input.rules);
            setStatesArray(props.resubmit.inputData.input.states);
        }
    },[props.resubmit])

    const setInitialState = (state) => {

        if (staticProps.Output_name) {
            var retainedName = staticProps.Output_name.value;
        } else {
            retainedName = state.output_name;
        }

        const dp = {
            Behaviour: { id: 101, value: state && state.input && state.input.dynamic_inputs ? state.input.dynamic_inputs['Behaviour_model'] : "" },
            input_file: [jobData.input_files[0].name, {
                formLabel: jobData.input_files[0].name,
                key: "input_file",
                id: 0,
                name: jobData.input_files[0].name,
                outputFlag: false,
                required: true,
                types: jobData.input_files[0].types,
                value: state && state.input ? state.input["input_file"] : "",
            }],
            blocking_state: {id: 307, value: state && state.input && state.input['blocking_states'] ? state.input['blocking_states'] :""},
            blocking_nodes: [jobData.input_files[1].name || '', {
                key: "blocking_nodes",
                formLabel: jobData.input_files[1].name || '',
                id: 1,
                name: jobData.input_files[1].name || '',
                outputFlag: false,
                types: jobData.input_files[1].types || [],
                required: false,
                value: state && state.input ? state.input["blocking_nodes"] : "",
            }]
        };

            // console.log("State", state);
            if (state.hasOwnProperty("input")) {
              setSubmodelArray(state.input.submodelArrayData);
              setDynamicProps(dp, ...submodelArray);
              setRules(state.input.rules);
              setStatesArray(state.input.states);
            } else if (props.resubmit === undefined) {
              setDynamicProps(dp, ...submodelArray);
            }
        
        setStaticProps({
            Seed: { value: state && state.input ? (randomNumberSeed ? randomNumberSeed : state.input['random_number_seed']) : "" },
            Iterations: { value: state && state.input ? state.input['iterations'] : "" },
            TimeSteps: { value: state && state.input ? state.input['time_steps'] : "" },
            InitialConditions: state && state.input ? state.input['initial_states_method'] : [{ type: 'random', number_nodes: "", state: "" }],
            default_state: { value: state && state.input ? state.input['default_state'] : "" },
            Output_name: { value: (state && state.state !== "Completed") ? retainedName : "" },
            outputPath: ['outputPath', {
                description: "Select the path from File manager where the output file is to be stored.",
                formLabel: "Output Container",
                required: true,
                id: 200,
                outputFlag: true,
                types: ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"],
                value: state && state.input ? state.output_container : "",
            }]
        });
    };

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

    const enableButton = () => {
        setIsFormValid(true);
    }

    const disableButton = () => {
        setIsFormValid(false);
    }

    const dynamicChangedHandler = (event, obj, subId, submodelFlag) => {
        const updatedJobSubmissionForm = { ...dynamicProps };
        var updatedFormElement;
        if (dynamicProps[obj] instanceof Array) {
            updatedFormElement = [dynamicProps[obj][0], { ...dynamicProps[obj][1] }];
        } else {
            updatedFormElement = { ...dynamicProps[obj] };
        }
        // Changing Start
        if (obj === 'Behaviour') {
            let tempSubmodels = [];
            if (modelJSON.models[event.target.value].hasOwnProperty('submodels')) {
                setStatesArray([]);
                setRules([]);
                staticProps.default_state.value = '';
                staticProps.InitialConditions[0].state = '';
                const tempMenu = (event.target.value + '.submodels').split('.').reduce((o, i) => o[i], modelJSON.models);
                tempSubmodels.push({ 'submodel_1': '', 'menu': Object.keys(tempMenu), 'value': '' });
            } else {
                setStatesArray(modelJSON.models[event.target.value]['states']);
                staticProps.default_state.value = modelJSON.models[event.target.value]['default_state'];
                staticProps.InitialConditions[0].state = '';
                let rules=[];
                modelJSON.models[event.target.value]['rules'].map(x => {
                    rules.push(x.rule);
                    Object.keys(x.input).map(y => {
                        let inputObj = {};
                        inputObj[y] = x.input[y];
                        inputObj['value'] = '';
                        inputObj['description'] = x.input[y].description;
                        tempSubmodels.push(inputObj);
                        rules[rules.length-1][y] = '';
                    })
                    // console.log(rules);
                })
                setRules(rules);
            }
            setSubmodelArray(tempSubmodels);
        }
        if (submodelFlag) {
            if (obj.includes('submodel')) {
                let sliceIndex = submodelArray.length - 1;
                let tempSubmodels = [...submodelArray];
                tempSubmodels.map((x, index) => {
                    if (x.hasOwnProperty(obj)) {
                        x[obj] = event.target.value;
                        x['value'] = event.target.value;
                        sliceIndex = index + 1;
                    }
                })
                tempSubmodels.splice(sliceIndex, tempSubmodels.length - 1)
                var initSubmodel = modelJSON.models[dynamicProps.Behaviour.value].submodels
                tempSubmodels.forEach((x, index) => index !== tempSubmodels.length - 1 ? initSubmodel = initSubmodel[x[Object.keys(x)[0]]]['submodels'] : initSubmodel = initSubmodel[x[Object.keys(x)[0]]])
                tempSubmodels[tempSubmodels.length-1].description = initSubmodel['description']
                if (typeof initSubmodel['submodels'] !== 'undefined') {
                    setStatesArray([]);
                    setRules([]);
                    staticProps.default_state.value = '';
                    const nextSub = `submodel_${parseInt(obj.substr(-1)) + 1}`;
                    let subObj = {};
                    subObj[nextSub] = '';
                    subObj['menu'] = Object.keys(initSubmodel['submodels']);
                    subObj['value'] = '';
                    tempSubmodels.push(subObj);
                    // console.log(tempSubmodels);
                } else {
                    setStatesArray(initSubmodel['states'])
                    staticProps.default_state.value = initSubmodel['default_state']
                    // console.log(initSubmodel['rules'])
                    let rules = [];
                    initSubmodel['rules'].map(x => {
                        rules.push(x.rule);
                        Object.keys(x.input).map(y => {
                            let inputObj = {};
                            inputObj[x.input[y].label] = x.input[y];
                            inputObj['id'] = y
                            inputObj['value'] = '';
                            inputObj['description'] = x.input[y].description;
                            tempSubmodels.push(inputObj);
                            rules[rules.length-1][y] = '';
                            rules[rules.length-1]["input"] = x.input[y].label;
                            console.log(rules);
                        })
                        // console.log(tempSubmodels);
                    })
                    setRules(rules);
                }
                // console.log(tempSubmodels)
                setSubmodelArray(tempSubmodels);
            }
            else {
                let tempSubmodels = [...submodelArray];
                tempSubmodels.map((x, index) => {
                    if (x.hasOwnProperty(obj)) {
                        x['value'] = event.target.value;
                    }
                })
                setSubmodelArray(tempSubmodels);
                // console.log(tempSubmodels);
            }
        }
        //END
        if (updatedFormElement instanceof Array) {
            updatedFormElement[1].value = event.target.value;
        } else {
            updatedFormElement.value = event.target.value;
            if(subId)
                updatedFormElement.id = subId
        }
        updatedJobSubmissionForm[obj] = updatedFormElement;
        setDynamicProps({ ...updatedJobSubmissionForm });
    }

    function populatesubmitJSON() {
        // console.log(staticProps);
        // console.log("DYNAMIC",dynamicProps);
        // console.log(rules);
        if (!staticProps.Seed.value || Number(staticProps.Seed.value) === 0) {
            let random_seed_value = Math.floor((Math.random() * 32000) + 1);
            staticProps.Seed.value = random_seed_value;
        } 
        let submitJSON = {
            "dynamicProps": dynamicProps,
            "submodelArrayData": submodelArray,
            "input_file": dynamicProps.input_file[1].value,
            "states_that_affect_neighbors": [],
            "iterations": parseInt(staticProps.Iterations.value),
            "time_steps": parseInt(staticProps.TimeSteps.value),
            'initial_states_method': staticProps.InitialConditions,
            "default_state": staticProps.default_state.value,
            "states": statesArray,
            "random_number_seed": parseInt(staticProps.Seed.value),
            'decorations': [],
            "dynamic_inputs": {"Behaviour_model": dynamicProps.Behaviour.value},
            "rules": rules,
        };

        if (dynamicProps.blocking_nodes && dynamicProps.blocking_nodes[1].value){
            submitJSON.blocking_nodes = dynamicProps.blocking_nodes[1].value
            submitJSON.blocking_states = dynamicProps.blocking_state.value
        }
        // console.log("Resubmit rules", rules);
        let newRules = [...rules];
        newRules.forEach(x=>{
            Object.keys(dynamicProps).forEach(y=>{
                if(x.hasOwnProperty(dynamicProps[y].id) && x.input === y){
                  x[dynamicProps[y].id] = parseFloat(dynamicProps[y].value) 
                }
            })
        });
        submitJSON.rules = newRules;
        // console.log(newRules);
        // setRules(newRules)
        populateBody(submitJSON);
    }

    function populateBody(submitJSON) {
        // setIsToasterFlag(true);
        // var path = window.location.pathname.replace("/apps/job-definition/", "");
        // var jobDefinition = path;
        var requestJson = {
            input: submitJSON,
            job_definition: `${jobData.id}@${jobData.version}`,
            output_container: staticProps.outputPath[1].value,
            output_name: staticProps.Output_name.value
        };
        console.log("-----REquest JSON",requestJson);
        onFormSubmit(requestJson);
    }

    function onFormSubmit(requestJson) {
        setOnSubmit(true);
        const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`;
        const token = localStorage.getItem('id_token');;
        const jobServiceInstance = new JobService(url, token);
        // console.log("DO SUBMIT HERE: ",requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container)
        // return;
        jobServiceInstance.createJobInstance(requestJson.job_definition, requestJson.input, requestJson.pragmas, requestJson.output_name, requestJson.output_container).then(res => {
            setIsToasterFlag(true);
            setSuccess(true);
            window.setTimeout(
                delayNavigation
                , 4000);
        },
            (error) => {
                setSuccess(false)
                if (error.response)
                    setErrorMsg(`${error.response.status}-${error.response.statusText} error occured. Please try again`);
                else
                    setErrorMsg("An internal error occured. Please try again");
                setIsToasterFlag(true);
                window.setTimeout(handlingError, 4000);
            }
        )
    }

    function handlingError() {
        setIsToasterFlag(false);
        setSuccess();
        setOnSubmit(true);
    }

    function delayNavigation() {
        setIsToasterFlag(false);
        dispatch(Actions.initializeInputForm())
        history.push('/apps/my-jobs/');
    }

    const description = (desc) =>
        <span style={{ marginTop: '38px' }} data-tip={desc}>
            <Icon fontSize="small">info</Icon>
        </span>

    if (!(Object.keys(inputSchema).length === 0 && inputSchema.constructor === Object))
        return (
            <FusePageSimple
                classes={{ root: 'root', header: 'headerDisplay' }}
                header={<div className="text-white-600">Head Content</div>}
                content={
                    <div className='flex'>
                        <ReactTooltip clickable={true} isCapture={true} scrollHide={true} className='toolTip' place='top' effect='solid' />
                        <div className='content'>
                            <div className='flex flex-col'>
                                {isToasterFlag && (
                                    <Toaster errorMsg={errorMsg} success={success} id="CSonNet Contagion Simulation"></Toaster>
                                )}
                                <Formsy onValid={enableButton} onInvalid={disableButton} className="content1">
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
                                                />
                                                {input_file_meta && input_file_meta.type && (inputFileMessage) && (
                                                    <React.Fragment>{inputFileMessage}</React.Fragment>
                                                )}
                                            </Grid>
                                        </div>
                                        <div className='borderStyle'>
                                            <h3><b>Dynamics Model</b></h3>
                                            <Grid style={childGrid} item container xs={12} >
                                                {/* {console.log("-----Dynamic Props",dynamicProps)} */}
                                                <SelectFormsy
                                                    className="my-12 inputStyle1 model"
                                                    name="Behaviour Model"
                                                    label={["Behaviour Model", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                    value={dynamicProps.Behaviour.value}
                                                    disabled={enableBlocking || !validInputFile}
                                                    onChange={(event) => dynamicChangedHandler(event, 'Behaviour')}
                                                    required
                                                >
                                                    {Object.keys(modelJSON.models).length > 0 && Object.keys(modelJSON.models).map(model => {
                                                        return <MenuItem key={model} value={model}>{model}</MenuItem>
                                                    })}
                                                </SelectFormsy>
                                                {modelJSON.models[dynamicProps.Behaviour.value] !== undefined && description(modelJSON.models[dynamicProps.Behaviour.value].description)}
                                                {submodelArray.map((sub, index) => {
                                                    let padLeftValue = 8*(index+1);
                                                    return (
                                                        <Grid 
                                                        id={props.key} 
                                                        style={sub.hasOwnProperty(`submodel_${index+1}`) ? { paddingLeft: padLeftValue, alignSelf: 'center',} : {childGrid} }
                                                        item container xs={12} 
                                                        key={index}>
                                                            <Submodels
                                                                sub={sub}
                                                                changed={(event) =>
                                                                    dynamicChangedHandler(event, Object.keys(submodelArray[index])[0], sub.id, true)
                                                                }
                                                                desc={description}
                                                                enableBlocking={enableBlocking}
                                                                validInput={validInputFile}
                                                            >
                                                            </Submodels>
                                                        </Grid>)
                                                })}
                                            </Grid>
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
                                                    value={staticProps.Seed.value ? String(staticProps.Seed.value) : "0"}
                                                    label="Seed"
                                                    onBlur={(event) => staticChangedHandler(event, 'Seed')}
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    disabled={!validInputFile}
                                                    required
                                                />
                                                {/* && !RegExp(/^0+$/).test(value) */}
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
                                                        disabled={enableBlocking || !validInputFile}
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
                                                        disabled={enableBlocking || !validInputFile}
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
                                                            value={dynamicProps.blocking_nodes[1].value}
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
                                                            {modelJSON.models.Threshold.submodels['Absolute threshold models'].submodels['Deterministic absolute models'].submodels['Deterministic progressive absolute threshold'].blocking_states.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>
                                                        {description(inputSchema.properties.blocking_states.description)}
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
                                                        <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="state"
                                                            label={["State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            disabled={!validInputFile || statesArray.length === 0}
                                                            value={staticProps.InitialConditions[0].state}
                                                            onChange={(event) => ICChangedHandler(event, 'state')}
                                                            required
                                                        >
                                                            {statesArray.map((item) => {
                                                                return (
                                                                    <MenuItem key={item} value={item}>
                                                                        {item}
                                                                    </MenuItem>
                                                                );
                                                            })}
                                                        </SelectFormsy>
                                                        { description(inputSchema.properties.states.description)}
                                                    </Grid>
                                                </div>
                                            )}
                                            {!enableBlocking && dynamicProps.Behaviour.value !== '' && <div style={{ marginLeft: '26px' }}>
                                                <h4 className='my-16'><b>Initial Conditions (default)</b></h4>
                                                <Grid style={childGrid} item container xs={12} >
                                                    <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={staticProps.default_state.value}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
                                                        required
                                                        disabled={!validInputFile || statesArray.length === 0}
                                                    >
                                                        {statesArray.map((item) => {
                                                            return (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </SelectFormsy>
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
                                        disabled={!isFormValid || !validInputFile || success}
                                    >
                                        Submit
                                    </Button>
                                    {props.resubmit ? <Link to="/apps/my-jobs/" style={{ color: 'transparent' }}>
                                        <Button
                                            variant="contained"
                                            // onClick={onFormCancel}
                                            color="primary"
                                            className="w-30 mx-8 mt-32 mb-80"
                                        >
                                            Cancel
                                        </Button>
                                    </Link> :
                                        <Link to="/apps/job-definition/" style={{ color: 'transparent' }}>
                                            <Button
                                                variant="contained"
                                                // onClick={onFormCancel}
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
    else {
        return null;
    }
}
export default withReducer('SimForm', reducer)(React.memo(CSonNet_Contagion_Simulation_v3))