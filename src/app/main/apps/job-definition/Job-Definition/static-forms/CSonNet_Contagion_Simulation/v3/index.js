/* eslint-disable no-mixed-operators */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import Formsy from 'formsy-react';
import { JobService } from 'node-sciduct';
import { Button, Fab, Grid, Icon, MenuItem, Tooltip } from '@material-ui/core';
import { FusePageSimple, SelectFormsy, TextFieldFormsy } from '@fuse';

import withReducer from 'app/store/withReducer';
import { Submodels } from './submodels';

import reducer from '../store/reducers';
import * as Actions from "../store/actions";

import modelJSON from '../../Schemas/CSonNet_modelDefinition_v3';
import { Input } from '../../SelectFile.js'
import Toaster from "../../../Toaster";
import LegendRow from './legendRow';

import * as JobAppActions from "../../../store/actions";
const CSonNet_Contagion_Simulation_v3 = (props) => {  

    const dispatch = useDispatch();
    // const jobData = useSelector(
    //     ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
    // );
    const jobData = useSelector(({ JobDefinitionApp }) => { return JobDefinitionApp.job_definition })

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
    const [rowNum, setRowNum] = useState(0);
    const [inputFields, setInputFields] = useState([]);
    const history = useHistory();
    const [resetProps, setResetProps] = useState({})
    const [edgeDirectionality, setEdgeDirectionality] = useState('')

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
            dispatch(JobAppActions.getJobDefinition(`${props.namespace}/${props.module}@${props.version}`));
        }else if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
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
                        setRandomNumberSeed(props.resubmit.inputData.input.random_number_seed ? props.resubmit.inputData.input.random_number_seed : "");
                        setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                        props.resubmit && localStorage.setItem('last_selected_folder', props.resubmit.inputData.output_container);

                    }else if(props.localResubmit){
                        setRandomNumberSeed(props.localResubmit.input.random_number_seed ? props.localResubmit.input.random_number_seed : "");
                        setInitialState((props.localResubmit) ? props.localResubmit : {});
                        props.localResubmit && localStorage.setItem('last_selected_folder', props.localResubmit.output_container);

                    }else{
                        setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                    }
                }
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
            setEdgeDirectionality(input_file_meta.autometa.edgeDirectionality)
            }
            setInputFileChangeCounter(inputFileChangeCounter  + 1);
        }else if(props.localResubmit){
            if (input_file_meta.hasOwnProperty("name")) {
                if(props.localResubmit.input["input_file"] && props.localResubmit.input["input_file"].includes(input_file_meta["name"])) {
                    blockingStatesValue = props.localResubmit.input["blocking_states"];
                    blockingNodesValue = props.localResubmit.input["blocking_nodes"];
                }
            setEdgeDirectionality(input_file_meta.autometa.edgeDirectionality)
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
                    if(props.resubmit && props.resubmit.inputData) {
                        setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                        props.resubmit && localStorage.setItem('last_selected_folder', props.resubmit.inputData.output_container);

                    }else if(props.localResubmit){
                        setInitialState((props.localResubmit) ? props.localResubmit : {});
                        props.localResubmit && localStorage.setItem('last_selected_folder', props.localResubmit.output_container);

                    }else{
                    setInitialState((props.resubmit && props.resubmit.inputData) ? props.resubmit.inputData : {});
                    }
                }
                // props.resubmit && localStorage.setItem('last_selected_folder', props.resubmit.inputData.output_container);
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
                        if(props.resubmit){
                        setInitialState({
                            input: props.resubmit ? {
                                ...input_file_meta.provenance.input, 
                                input_file: props.resubmit.inputData.input["input_file"], 
                                blocking_states: inputFileChangeCounter <= 2 ? blockingStatesValue : '',
                                blocking_nodes: inputFileChangeCounter <= 2 ? blockingNodesValue : '',
                            } : {
                                ...input_file_meta.provenance.input
                            },
                            output_container: (staticProps.outputPath && staticProps.outputPath[1]) ? staticProps.outputPath[1].value : "",
                        })
                    }else if(props.localResubmit){
                        setInitialState({
                            input: props.localResubmit ? {
                                ...input_file_meta.provenance.input, 
                                input_file: props.localResubmit.input["input_file"], 
                                blocking_states: inputFileChangeCounter <= 2 ? blockingStatesValue : '',
                                blocking_nodes: inputFileChangeCounter <= 2 ? blockingNodesValue : '',
                            } : {
                                ...input_file_meta.provenance.input
                            },
                            output_container: (staticProps.outputPath && staticProps.outputPath[1]) ? staticProps.outputPath[1].value : "",
                        })
                    }else{
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
                    }
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
        if(props.resubmit) {
            setDynamicProps(props.resubmit.inputData.input.dynamicProps);
            if(props.resubmit.inputData.input && props.resubmit.inputData.input.submodelArrayData){
                setSubmodelArray(props.resubmit.inputData.input.submodelArrayData);
            }else{
                setSubmodelArray([]);
            }
            setRules(props.resubmit.inputData.input.rules);
            setStatesArray(props.resubmit.inputData.input.states);
        }       
        if(props.localResubmit){
            if(!props.localResubmit.input.dynamicProps){ 
                setInitialState((props.localResubmit) ? props.localResubmit : {});
                // setDynamicProps(props.localResubmit.input.dynamic_inputs);
            }else{
                setDynamicProps(props.localResubmit.input.dynamicProps);
            }
            if(props.localResubmit.input && props.localResubmit.input.submodelArrayData){
                setSubmodelArray(props.localResubmit.input.submodelArrayData);
            }else{
                setSubmodelArray([]);
            }
            setRules(props.localResubmit.input.rules);
            setStatesArray(props.localResubmit.input.states);
        }
    },[props.resubmit, props.localResubmit])

    const setInitialState = (state) => {

        if (staticProps.Output_name) {
            var retainedName = staticProps.Output_name.value;
        } else {
            retainedName = state.output_name;
        }
        let blockingNode;
        let inputFileVal;
        if(state && state.input && !state.input["blocking_nodes"]){
            blockingNode = [ jobData.input_files[1].name || '', {
                key: "blocking_nodes",
                formLabel: jobData.input_files[1].name || '',
                id: 1,
                name:  jobData.input_files[1].name || '',
                outputFlag: false,
                types: jobData.input_files[1].types || [],
                required: false,
                value: "",
            }]
        }else{
            blockingNode = [
                jobData.input_files[1].name || '', {
                key: "blocking_nodes",
                formLabel: jobData.input_files[1].name || '',
                id: 1,
                name: jobData.input_files[1].name || '',
                outputFlag: false,
                types: jobData.input_files[1].types || [],
                required: false,
                value: state && state.input ? state.input["blocking_nodes"] : "",
            }]
        }
        if(state && state.input && !state.input["input_file"]){
            if(state.input["Graph"])
            inputFileVal = `${state.input["Graph"]} **(Reselect the file)`
        }else{
            inputFileVal = state && state.input ? state.input["input_file"] : ""
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
                value: inputFileVal
            }],
            blocking_state: {id: 307, value: state && state.input && state.input['blocking_states'] ? state.input['blocking_states'] :""},
            blocking_nodes: blockingNode
        };

        const dpp = {
            Behaviour: dp.Behaviour,
            blocking_state: dp.blocking_state,
            blocking_nodes:dp.blocking_nodes,
            input_file: dp.input_file
        }
        setResetProps(dpp)

            if (state.hasOwnProperty("input")) {
                if(state.input && state.input['submodelArrayData']){
                    setSubmodelArray(state.input.submodelArrayData);
                    setDynamicProps(dp, ...submodelArray);
                    if(!window.restoreSubmodelArray){
                        window.restoreSubmodelArray = state.input.submodelArrayData
                    }
                }else{
                    setSubmodelArray([]);
                    setDynamicProps(dp, ...submodelArray)
                    if(!window.restoreSubmodelArray){
                        window.restoreSubmodelArray = []
                    }
                }
              setRules(state.input.rules);
              setStatesArray(state.input.states);
              if(!window.restoreRules){
                window.restoreRules = state.input.rules
              }
              if(!window.restoreStatesArray){
                window.restoreStatesArray = state.input.states
              }
            } 
            else if (props.resubmit === undefined) {
              setDynamicProps(dp, ...submodelArray);
            }
            let statProps = {
                Seed: { value: state && state.input ? (randomNumberSeed ? randomNumberSeed : state.input['random_number_seed']) : "" },
                Iterations: { value: state && state.input ? state.input['iterations'] : "" },
                TimeSteps: { value: state && state.input ? state.input['time_steps'] : "" },
                InitialConditions: state && state.input ? state.input['initial_states_method'] : [{ type: '', number_nodes: "", state: "" }],
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
            }
            window.restoreOutputName = statProps.Output_name.value
            window.restoreOutputPath = statProps.outputPath[1].value
        
        setStaticProps(statProps);

        if(!window.restoreStatic){
            window.restoreStatic = statProps
        }
        if(!window.restoreDynamicProps){
            window.restoreDynamicProps = {...dp, ...submodelArray}
        }
        if(state &&  state.input && state.input['initial_states_method'][0] && state.input['initial_states_method'][0]['node_selection_criteria']){
            const rowArray = [...state.input['initial_states_method'][0]['node_selection_criteria']]
            const rowArrayLength = rowArray.length
            setInputFields(rowArray);
            setRowNum(rowArrayLength)
            if(!window.restoreInputFields){
                window.restoreInputFields = rowArray
            }
        }
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
        window.restoreStatic = { ...updatedJobSubmissionForm }
        window.formEdited = true
        if(obj === "Output_name"){
            window.restoreOutputName = event.target.value
        }
        if(obj === "outputPath"){
            window.restoreOutputPath = event.target.value
        }
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
        window.restoreStatic = { ...updatedJobSubmissionForm }
        window.formEdited = true
    }

    const enableButton = () => {
        setIsFormValid(true);
    }

    const disableButton = () => {
        setIsFormValid(false);
    }

    const dynamicChangedHandler = (event, obj, subId, submodelFlag) => {
        let updatedJobSubmissionForm = { ...dynamicProps };
        var updatedFormElement;
        if (dynamicProps[obj] instanceof Array) {
            updatedFormElement = [dynamicProps[obj][0], { ...dynamicProps[obj][1] }];
        } else {
            updatedFormElement = { ...dynamicProps[obj] };
        }
        // Changing Start
        if (obj === 'Behaviour') {
            //Reset dynamicProps
            resetProps.input_file = dynamicProps.input_file
            updatedJobSubmissionForm = resetProps
            let tempSubmodels = [];
            if (modelJSON.models[event.target.value].hasOwnProperty('submodels')) {
                setStatesArray([]);
                window.restoreStatesArray = []
                setRules([]);
                window.restoreRules = []
                staticProps.default_state.value = '';
                staticProps.InitialConditions[0].state = '';
                const tempMenu = (event.target.value + '.submodels').split('.').reduce((o, i) => o[i], modelJSON.models);
                tempSubmodels.push({ 'submodel_1': '', 'menu': Object.keys(tempMenu), 'value': '' });
            } else {
                setStatesArray(modelJSON.models[event.target.value]['states']);
                window.restoreStatesArray = modelJSON.models[event.target.value]['states']
                staticProps.default_state.value = modelJSON.models[event.target.value]['default_state'];
                staticProps.InitialConditions[0].state = '';
                let rules=[];
                modelJSON.models[event.target.value]['rules'].map(x => {
                    rules.push(x.rule);
                    let pushInputArr = Object.keys(x.input).length > 1 ? true : false
                    let inputArr = []
                    Object.keys(x.input).map(y => {
                        let inputObj = {};
                        inputObj[x.input[y].label] = x.input[y];
                        inputObj['id'] = y
                        // inputObj[y] = x.input[y];
                        inputObj['value'] = '';
                        inputObj['description'] = x.input[y].description;
                        tempSubmodels.push(inputObj);
                        rules[rules.length-1][y] = '';
                        // inputArr.push(x.input[y].label);
                        // rules[rules.length-1]["input"] = inputArr
                        if(pushInputArr){
                            inputArr.push(x.input[y].label);
                            rules[rules.length-1]["input"] = inputArr
                        }else{
                            rules[rules.length-1]["input"] = x.input[y].label;
                        }
                    })
                })
                setRules(rules);
                window.restoreRules = rules
            }
            setSubmodelArray(tempSubmodels);
            window.restoreSubmodelArray = tempSubmodels
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
                    window.restoreStatesArray = []
                    setRules([]);
                    window.restoreRules = []
                    staticProps.default_state.value = '';
                    const nextSub = `submodel_${parseInt(obj.substr(-1)) + 1}`;
                    let subObj = {};
                    subObj[nextSub] = '';
                    subObj['menu'] = Object.keys(initSubmodel['submodels']);
                    subObj['value'] = '';
                    tempSubmodels.push(subObj);
                } else {
                    setStatesArray(initSubmodel['states'])
                    window.restoreStatesArray = initSubmodel['states']
                    staticProps.default_state.value = initSubmodel['default_state']
                    let rules = [];
                    initSubmodel['rules'].map(x => {
                        rules.push(x.rule);
                    let pushInputArr = Object.keys(x.input).length > 1 ? true : false
                    let inputArr = []

                        Object.keys(x.input).map(y => {
                            let inputObj = {};
                            inputObj[x.input[y].label] = x.input[y];
                            inputObj['id'] = y
                            inputObj['value'] = '';
                            inputObj['description'] = x.input[y].description;
                            tempSubmodels.push(inputObj);
                            rules[rules.length-1][y] = '';
                            if(pushInputArr){
                                inputArr.push(x.input[y].label);
                                rules[rules.length-1]["input"] = inputArr
                            }else{
                                rules[rules.length-1]["input"] = x.input[y].label;
                            }
                        })
                    })
                    setRules(rules);
                    window.restoreRules = rules
                }
                setSubmodelArray(tempSubmodels);
                window.restoreSubmodelArray = tempSubmodels
            }
            else {
                let tempSubmodels = [...submodelArray];
                tempSubmodels.map((x, index) => {
                    if (x.hasOwnProperty(obj)) {
                        x['value'] = event.target.value;
                    }
                })
                setSubmodelArray(tempSubmodels);
                window.restoreSubmodelArray = tempSubmodels

            }
        }
        if(obj === "input_file"){
            setEdgeDirectionality(event.edgeDirectionality)
        }
        //END
        if (updatedFormElement instanceof Array) {
            updatedFormElement[1].value = event.target.value;
        } else {
            updatedFormElement.value = event.target.value;
            if(subId)
                updatedFormElement.id = subId
                // updatedFormElement['label'] = obj
        }
        // if(subId){
        //     updatedJobSubmissionForm[subId] = updatedFormElement;
        // }else {
            updatedJobSubmissionForm[obj] = updatedFormElement;
        // }
        setDynamicProps({ ...updatedJobSubmissionForm });
        window.restoreDynamicProps = { ...updatedJobSubmissionForm }
        window.formEdited = true
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
        if(inputFields.length > 0 && submitJSON['initial_states_method'][0]['type'] === 'custom'){
            let changedInputFields = inputFields.map((ele) =>{
                if(ele.min === ""){
                    delete ele.min
                }
                if(ele.max === ""){
                    delete ele.max
                }
                if(ele.weight === ""){
                    delete ele.weight
                }
            return ele
            })

            submitJSON['initial_states_method'][0]['node_selection_criteria'] = changedInputFields
        }else if(submitJSON['initial_states_method'][0].hasOwnProperty('node_selection_criteria') || submitJSON['initial_states_method'][0].hasOwnProperty('node_selection_criteria')){
            delete submitJSON['initial_states_method'][0]['node_selection_criteria'] 
            delete submitJSON['initial_states_method'][0]['node_selection_method']
        }

        if (dynamicProps.blocking_nodes && dynamicProps.blocking_nodes[1].value){
            submitJSON.blocking_nodes = dynamicProps.blocking_nodes[1].value
            submitJSON.blocking_states = dynamicProps.blocking_state.value
        }
        // console.log("Resubmit rules", rules);
        let newRules = [...rules];
        newRules.forEach(x=>{
            Object.keys(dynamicProps).forEach(y=>{
                if(x.hasOwnProperty(dynamicProps[y].id) && x.input.includes(y)){
                    x[dynamicProps[y].id] = parseFloat(dynamicProps[y].value) 
                }
            })
        });
        // let newDynamicProps = [...dynamicProps]
        // console.log(newDynamicProps)
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
        onFormSubmit(requestJson);
    }

    function onFormSubmit(requestJson) {
        setOnSubmit(true);
        const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`;
        const token = localStorage.getItem('id_token');;
        const jobServiceInstance = new JobService(url, token);
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

    const handleAddCustomRow = () => {
        const values = [...inputFields];
        values.push({property: 'degree', ordering: 'increasing', min: '', max: '', weight: ''});
        setInputFields(values); 
        window.restoreInputFields = values
        setRowNum(rowNum + 1);
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
                                                    name={dynamicProps.input_file.name}
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
                                                            elementType={dynamicProps.blocking_nodes[1].types}
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
                                                    <h4 className='mt-16'><b>Initial Conditions(Seeding)</b></h4>
                                                    <Grid style={childGrid} item container xs={12} >
                                                        <SelectFormsy
                                                            className="my-12 inputStyle1 model"
                                                            name="type"
                                                            label={["Seeding Method", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                            disabled={!validInputFile}
                                                            value={staticProps.InitialConditions[0].type ? staticProps.InitialConditions[0].type : ''}
                                                            onChange={(event) => ICChangedHandler(event, 'type')}
                                                            required
                                                        >
                                                            <MenuItem key="Random" value="random"> Random </MenuItem>
                                                            <MenuItem key="Custom" value="custom"> Custom </MenuItem>
                                                        </SelectFormsy>
                                                    </Grid>
                                                    {staticProps.InitialConditions[0].type && staticProps.InitialConditions[0].type === "random" && (
                                                        <div style={{display: "flex", flexDirection: "row", marginRight: '11%'}}>
                                                            <Grid style={childGrid} item container xs={8} >
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
                                                            <Grid style={childGrid} item container xs={8} >
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
                                                    {staticProps.InitialConditions[0].type && staticProps.InitialConditions[0].type === "custom" && (
                                                        <>
                                                            <div style={{display: "flex", flexDirection: "row", marginRight: '11%'}}>
                                                                <Grid style={childGrid} item container xs={8} >
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
                                                                <Grid style={childGrid} item container xs={8} >
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
                                                            <div style={{display: "flex", flexDirection: "row", marginRight: '11%'}}>
                                                                <Grid style={childGrid} item xs={11} >
                                                                    <SelectFormsy
                                                                        className="my-12 inputStyle2 model"                                                    
                                                                        name="node_selection_method"
                                                                        label={["Node Selection Method", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                                        disabled={!validInputFile}
                                                                        value={staticProps.InitialConditions[0].node_selection_method ? staticProps.InitialConditions[0].node_selection_method : ''}
                                                                        onChange={(event) => ICChangedHandler(event, 'node_selection_method')}
                                                                        required
                                                                    >
                                                                        <MenuItem key="random-weighted" value="random-weighted"> Random-weighted </MenuItem>
                                                                        <MenuItem key="random-uniform" value="random-uniform"> Random-uniform </MenuItem>
                                                                        <MenuItem key="min-weighted-values" value="min-weighted-values"> Min-weighted-values </MenuItem>
                                                                        <MenuItem key="max-weighted-values" value="max-weighted-values"> Max-weighted-values </MenuItem>

                                                                    </SelectFormsy>
                                                                </Grid>
                                                                <Grid item xs={3} >
                                                                    <Tooltip title="Click to add a state row" aria-label="add">
                                                                        <Fab color="secondary" aria-label="add" size="small" className="mt-12" style={{alignSelf:'flex-end', marginLeft:'20px'}}>
                                                                            <Icon className="flex flex-col" onClick={handleAddCustomRow}>add</Icon>
                                                                        </Fab>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </div>
                                                            <Grid  item container xs={12} >
                                                                {rowNum > 0 && 
                                                                    <LegendRow edgeDirectionality={edgeDirectionality} inputFields={inputFields} setInputFields={(p) => {setInputFields(p)}}/>
                                                                }
                                                            </Grid>
                                                        </>
                                                    )}
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
                                    {(props.resubmit || props.localResubmit) ? <Link to="/apps/my-jobs/" style={{ color: 'transparent' }}>
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