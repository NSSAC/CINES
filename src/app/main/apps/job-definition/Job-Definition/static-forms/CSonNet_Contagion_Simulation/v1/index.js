import modelJSON  from '../../Schemas/CSonNet_modelDefinition_v1';
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

import * as Actions from "../../../store/actions";
import Toaster from "../../../Toaster";
import Deterministic_threshold from '../../CSonNet/deterministic_threshold.js';
// import SIS from './CSonNet/SIS/SIS.js';
// import ICM from './CSonNet/ICM.js';
// import LTM from './CSonNet/LTM.js';
// import PTM from './CSonNet/PTM.js';
import SEIR from '../../CSonNet/SEIR/SEIR.js';
import SIR from '../../CSonNet/SIR/SIR.js';
import { Input } from '../../SelectFile.js'

const CSonNet_Contagion_Simulation_v1 = (props) => {
    const jobData = useSelector(
        ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
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
    const history = useHistory();
    const dispatch = useDispatch()

    const childGrid = {
        paddingLeft: '8px',
        alignSelf: 'center'
    };

    const descStyle = {
        whiteSpace: "break-spaces",
    }

    useEffect(() => {
        // let pathEnd = 'net.science/CSonNet_Contagion_Simulation'
        let pathEnd = `${props.namespace}/${props.module}`
        setIsToasterFlag(false);
        if (jobData.id && !jobData.id.includes(pathEnd) || jobData.version !== props.version || Object.keys(jobData).length === 0){
            dispatch(Actions.setSelectedItem(`${pathEnd}@${props.version}`));
        }
        if(Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
                setSpinnerFlag(false)
                if (jobData) {
                    if(props.resubmit){
                        const dp = {
                            Behaviour: { id: 101, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['Behaviour_model'] : "" },
                            SIR_Submodel: { id: 201, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SIR_Submodel'] : "" },
                            SIS_Submodel: { id: 202, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SIS_Submodel'] : "" },
                            SEIR_Submodel: { id: 203, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SEIR_Submodel'] : "" },
                            threshold: { id: 301, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.threshold) !== 'undefined' ? props.resubmit.inputData.input.dynamic_inputs['threshold'] : "" },
                            Edge_probability: { id: 302, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Edge_probability) !== 'undefined' ? props.resubmit.inputData.input.dynamic_inputs['Edge_probability'] : "" },
                            Infectious_probability_transition: { id: 303, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Infectious_probability_transition) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Infectious_probability_transition'] : "" },
                            Infectious_duration: { id: 304, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Infectious_duration) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Infectious_duration'] : "" },
                            Exposed_duration: { id: 305, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Exposed_duration) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Exposed_duration'] : "" },
                            Exposed_probability_transition: { id: 306, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Exposed_probability_transition) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Exposed_probability_transition'] : "" },
                            inputFile_Graph: [jobData.input_files[0].name, {
                                formLabel: jobData.input_files[0].name,
                                id: 0,
                                name: jobData.input_files[0].name,
                                outputFlag: false,
                                required: true,
                                types: jobData.input_files[0].types,
                                value: props.resubmit ? props.resubmit.inputData.input["Graph"] : ""
                            }]
                        }
                        setDynamicProps(dp)
                        let statProps = {
                            Seed: { value: props.resubmit ? props.resubmit.inputData.input['random_number_seed'] : "" },
                            Iterations: { value: props.resubmit ? props.resubmit.inputData.input['iterations'] : "" },
                            TimeSteps: { value: props.resubmit ? props.resubmit.inputData.input['time_steps'] : "" },
                            InitialConditions: props.resubmit ? props.resubmit.inputData.input['initial_states_method'] : [{ type: 'random', number_nodes: "", state: "" }],
                            default_state: { value: props.resubmit ? props.resubmit.inputData.input['default_state'] : "" },
                            Output_name: { value: (props.resubmit && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name : "" },
                            outputPath: ['outputPath', {
                                description: "Select the path from File manager where the output file is to be stored.",
                                formLabel: "Output Container",
                                id: 200,
                                outputFlag: true,
                                types: ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"],
                                value: props.resubmit ? props.resubmit.inputData.output_container : "",
                            }]
                        }
                        setStaticProps(statProps)
                        if(!window.restoreStatic){
                            window.restoreStatic = statProps
                        }
                        if(!window.restoreDynamicProps){
                            window.restoreDynamicProps = dp
                            generateRestoreRules(dp)
                        }
                        props.resubmit && localStorage.setItem('last_selected_folder',props.resubmit.inputData.output_container  + '/')
                    }else if(props.localResubmit){

                        if(props.localResubmit && props.localResubmit.input && props.localResubmit.input["dynamicProps"] && Object.keys(props.localResubmit.input.dynamic_inputs).length <= 1){
                            let a  = {...props.localResubmit.input.dynamicProps}
                            let input_file;
                            let blocking_nodes;
                            if(a.input_file){
                                input_file = a.input_file ? a.input_file : []
                                delete a.input_file
                            }
                            if(a.blocking_nodes){
                                blocking_nodes = a.blocking_nodes ? a.blocking_nodes : []
                                delete a.blocking_nodes
                            }
                                                       
                            Object.keys(a).forEach((ele) => {
                                    a[ele] = a[ele]['value']
                            })
                            a['input_file'] = input_file
                            a['blocking_nodes'] = blocking_nodes
                            // console.log(a)
                            props.localResubmit.input.dynamic_inputs = a
                            if(props.localResubmit.input.dynamic_inputs['Behaviour']){
                                props.localResubmit.input.dynamic_inputs['Behaviour_model'] = props.localResubmit.input.dynamic_inputs['Behaviour']
                                delete props.localResubmit.input.dynamic_inputs['Behaviour']
                            }
                        }
                        const dp = {
                            Behaviour: { id: 101, value: props.localResubmit && props.localResubmit.input.dynamic_inputs ? props.localResubmit.input.dynamic_inputs['Behaviour_model'] : "" },
                            SIR_Submodel: { id: 201, value: props.localResubmit && props.localResubmit.input.dynamic_inputs ? props.localResubmit.input.dynamic_inputs['SIR_Submodel'] : "" },
                            SIS_Submodel: { id: 202, value: props.localResubmit && props.localResubmit.input.dynamic_inputs ? props.localResubmit.input.dynamic_inputs['SIS_Submodel'] : "" },
                            SEIR_Submodel: { id: 203, value: props.localResubmit && props.localResubmit.input.dynamic_inputs ? props.localResubmit.input.dynamic_inputs['SEIR_Submodel'] : "" },
                            threshold: { id: 301, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.threshold) !== 'undefined' ? props.localResubmit.input.dynamic_inputs['threshold'] : "" },
                            Edge_probability: { id: 302, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.Edge_probability) !== 'undefined' ? props.localResubmit.input.dynamic_inputs['Edge_probability'] : "" },
                            Infectious_probability_transition: { id: 303, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.Infectious_probability_transition) !== 'undefined'? props.localResubmit.input.dynamic_inputs['Infectious_probability_transition'] : "" },
                            Infectious_duration: { id: 304, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.Infectious_duration) !== 'undefined'? props.localResubmit.input.dynamic_inputs['Infectious_duration'] : "" },
                            Exposed_duration: { id: 305, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.Exposed_duration) !== 'undefined'? props.localResubmit.input.dynamic_inputs['Exposed_duration'] : "" },
                            Exposed_probability_transition: { id: 306, value: props.localResubmit && props.localResubmit.input.dynamic_inputs && String(props.localResubmit.input.dynamic_inputs.Exposed_probability_transition) !== 'undefined'? props.localResubmit.input.dynamic_inputs['Exposed_probability_transition'] : "" },
                            inputFile_Graph: [jobData.input_files[0].name, {
                                formLabel: jobData.input_files[0].name,
                                id: 0,
                                name: jobData.input_files[0].name,
                                outputFlag: false,
                                required: true,
                                types: jobData.input_files[0].types,
                                value: props.localResubmit ? props.localResubmit.input['input_file'] : ""
                            }]
                        }
                        setDynamicProps(dp)
                        let statProps = {
                            Seed: { value: props.localResubmit ? props.localResubmit.input['random_number_seed'] : "" },
                            Iterations: { value: props.localResubmit ? props.localResubmit.input['iterations'] : "" },
                            TimeSteps: { value: props.localResubmit ? props.localResubmit.input['time_steps'] : "" },
                            InitialConditions: props.localResubmit ? props.localResubmit.input['initial_states_method'] : [{ type: 'random', number_nodes: "", state: "" }],
                            default_state: { value: props.localResubmit ? props.localResubmit.input['default_state'] : "" },
                            Output_name: { value: (props.localResubmit && props.localResubmit.state !== "Completed") ? props.localResubmit.output_name : "" },
                            outputPath: ['outputPath', {
                                description: "Select the path from File manager where the output file is to be stored.",
                                formLabel: "Output Container",
                                id: 200,
                                outputFlag: true,
                                types: ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"],
                                value: props.localResubmit ? props.localResubmit.output_container : "",
                            }]
                        }
                        setStaticProps(statProps)
                        window.restoreOutputName = statProps.Output_name.value
                        window.restoreOutputPath = statProps.outputPath[1].value

                        if(!window.restoreStatic){
                            window.restoreStatic = statProps
                        }
                        if(!window.restoreDynamicProps){
                            window.restoreDynamicProps = dp
                            generateRestoreRules(dp)
                        }
                        props.localResubmit && localStorage.setItem('last_selected_folder',props.localResubmit.output_container  + '/')
                    }else{
                        setDynamicProps({
                        Behaviour: { id: 101, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['Behaviour_model'] : "" },
                        SIR_Submodel: { id: 201, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SIR_Submodel'] : "" },
                        SIS_Submodel: { id: 202, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SIS_Submodel'] : "" },
                        SEIR_Submodel: { id: 203, value: props.resubmit && props.resubmit.inputData.input.dynamic_inputs ? props.resubmit.inputData.input.dynamic_inputs['SEIR_Submodel'] : "" },
                        threshold: { id: 301, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.threshold) !== 'undefined' ? props.resubmit.inputData.input.dynamic_inputs['threshold'] : "" },
                        Edge_probability: { id: 302, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Edge_probability) !== 'undefined' ? props.resubmit.inputData.input.dynamic_inputs['Edge_probability'] : "" },
                        Infectious_probability_transition: { id: 303, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Infectious_probability_transition) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Infectious_probability_transition'] : "" },
                        Infectious_duration: { id: 304, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Infectious_duration) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Infectious_duration'] : "" },
                        Exposed_duration: { id: 305, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Exposed_duration) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Exposed_duration'] : "" },
                        Exposed_probability_transition: { id: 306, value: props.resubmit && String(props.resubmit.inputData.input.dynamic_inputs.Exposed_probability_transition) !== 'undefined'? props.resubmit.inputData.input.dynamic_inputs['Exposed_probability_transition'] : "" },
                        inputFile_Graph: [jobData.input_files[0].name, {
                            formLabel: jobData.input_files[0].name,
                            id: 0,
                            name: jobData.input_files[0].name,
                            outputFlag: false,
                            required: true,
                            types: jobData.input_files[0].types,
                            value: props.resubmit ? props.resubmit.inputData.input["Graph"] : ""
                        }]
                    })
                    setStaticProps({
                        Seed: { value: props.resubmit ? props.resubmit.inputData.input['random_number_seed'] : "" },
                        Iterations: { value: props.resubmit ? props.resubmit.inputData.input['iterations'] : "" },
                        TimeSteps: { value: props.resubmit ? props.resubmit.inputData.input['time_steps'] : "" },
                        InitialConditions: props.resubmit ? props.resubmit.inputData.input['initial_states_method'] : [{ type: 'random', number_nodes: "", state: "" }],
                        default_state: { value: props.resubmit ? props.resubmit.inputData.input['default_state'] : "" },
                        Output_name: { value: (props.resubmit && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name : "" },
                        outputPath: ['outputPath', {
                            description: "Select the path from File manager where the output file is to be stored.",
                            formLabel: "Output Container",
                            id: 200,
                            outputFlag: true,
                            types: ["folder", "epihiper_multicell_analysis", "epihiperOutput", "csonnet_simulation_container"],
                            value: props.resubmit ? props.resubmit.inputData.output_container : "",
                        }]
                    })
                    }
                    setInputSchema(jobData.input_schema)

                }
            }
        // eslint-disable-next-line
    }, [jobData.id]);

    function disableButton() {
        setIsFormValid(false);
    }

    const onFormCancel = () => {
    };

    function generateRestoreRules(prop){
        let tempRules = {}
        let behaviourModel = prop ? prop.Behaviour.value : dynamicProps.Behaviour.value

        switch (behaviourModel) {
            case 'Threshold Model':
                window.restoreStatesArray = modelJSON['models']['threshold_model']['states'];
                tempRules = modelJSON['models']['threshold_model']['rules'][0]['rule'];
                tempRules['deterministic_progressive_node_threshold_value'] = prop ? parseInt(prop.threshold.value) :  parseInt(dynamicProps.threshold.value);
                window.restoreRules = []
                window.restoreRules[0] = tempRules;
                break;

            case 'SEIR Model':
                window.restoreStatesArray = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['states'];
                let subModel_SEIR = prop ? prop.SEIR_Submodel.value : dynamicProps.SEIR_Submodel.value
                window.restoreRules = []
                switch (subModel_SEIR) {
                    case 'SEIR1':
                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = prop ? parseInt(prop.Edge_probability.value) : parseFloat(dynamicProps.Edge_probability.value);
                        window.restoreRules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = prop ? parseInt(prop.Exposed_duration.value) : parseInt(dynamicProps.Exposed_duration.value);
                        window.restoreRules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed fixed infectious']['rules'][2]['rule'];
                        tempRules["discrete_time_auto_value"] = prop ? parseInt(prop.Infectious_duration.value) : parseInt(dynamicProps.Infectious_duration.value);
                        window.restoreRules[2] = tempRules;
                        break;

                    case 'SEIR2':
                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] =  prop ? parseInt(prop.Edge_probability.value) : parseFloat(dynamicProps.Edge_probability.value);
                        window.restoreRules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = prop ? parseInt(prop.Exposed_duration.value) : parseInt(dynamicProps.Exposed_duration.value);
                        window.restoreRules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['fixed exposed stochastic infectious']['rules'][2]['rule'];
                        tempRules["node_probability_auto_value"] = prop ? parseInt(prop.Infectious_probability_transition.value) : parseFloat(dynamicProps.Infectious_probability_transition.value);
                        window.restoreRules[2] = tempRules;
                        break;

                    case 'SEIR3':
                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = prop ? parseInt(prop.Edge_probability.value) : parseFloat(dynamicProps.Edge_probability.value);
                        window.restoreRules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][1]['rule'];
                        tempRules["node_probability_auto_value"] = prop ? parseInt(prop.Exposed_probability_transition.value) : parseFloat(dynamicProps.Exposed_probability_transition.value);
                        window.restoreRules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed fixed infectious']['rules'][2]['rule'];
                        tempRules["discrete_time_auto_value"] =  prop ? parseInt(prop.Infectious_duration.value) : parseInt(dynamicProps.Infectious_duration.value);
                        window.restoreRules[2] = tempRules;
                        break;

                    case 'SEIR4':
                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = prop ? parseInt(prop.Edge_probability.value) : parseFloat(dynamicProps.Edge_probability.value);
                        window.restoreRules[0] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][1]['rule'];
                        tempRules["node_probability_auto_value"] = prop ? parseInt(prop.Exposed_probability_transition.value) : parseFloat(dynamicProps.Exposed_probability_transition.value);
                        window.restoreRules[1] = tempRules;

                        tempRules = modelJSON['models']['SEIR']['submodels']['stochastic exposed stochastic infectious']['rules'][2]['rule'];
                        tempRules["node_probability_auto_value"] = prop ? parseInt(prop.Infectious_probability_transition.value) : parseFloat(dynamicProps.Infectious_probability_transition.value);
                        window.restoreRules[2] = tempRules;
                        break;
                }
                break;

            case 'SIR Model':
                window.restoreStatesArray = modelJSON['models']['SIR']['submodels']['fixed infectious']['states'];
                window.restoreRules = []
                switch (dynamicProps.SIR_Submodel.value) {
                    case 'fixed infectious':
                        tempRules = modelJSON['models']['SIR']['submodels']['fixed infectious']['rules'][0]['rule'];
                        tempRules["edge_probability_value"] = prop ? parseInt(prop.Edge_probability.value) : parseFloat(dynamicProps.Edge_probability.value);
                        window.restoreRules[0] = tempRules;

                        tempRules = modelJSON['models']['SIR']['submodels']['fixed infectious']['rules'][1]['rule'];
                        tempRules["discrete_time_auto_value"] = prop ? parseInt(prop.Infectious_duration.value) : parseInt(dynamicProps.Infectious_duration.value);
                        window.restoreRules[1] = tempRules;
                        break;
                }
                break;
        }
    }

    function populatesubmitJSON() {
        let submitJSON = {
            "Graph": dynamicProps.inputFile_Graph[1].value,
            "states_that_affect_neighbors": [],
            "iterations": parseInt(staticProps.Iterations.value),
            "time_steps": parseInt(staticProps.TimeSteps.value),
            'initial_states_method': staticProps.InitialConditions,
            "default_state": staticProps.default_state.value,
            "random_number_seed": parseInt(staticProps.Seed.value),
            'decorations': [],
            "dynamic_inputs": {}
        }
        let tempRules = {}

        switch (dynamicProps.Behaviour.value) {
            case 'Threshold Model':
                submitJSON.dynamic_inputs.Behaviour_model = dynamicProps.Behaviour.value
                submitJSON.states = modelJSON['models']['threshold_model']['states'];
                // submitJSON.default_state = modelJSON['models']['threshold_model']['default_state'];
                tempRules = modelJSON['models']['threshold_model']['rules'][0]['rule'];
                tempRules['deterministic_progressive_node_threshold_value'] = parseInt(dynamicProps.threshold.value);
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
        populateBody(submitJSON)
    }

    function populateBody(submitJSON) {
        setIsToasterFlag(true);
        // var path = window.location.pathname.replace("/apps/job-definition/", "");
        // var jobDefinition = path;
        var requestJson = {
            input: submitJSON,
            job_definition: `${jobData.id}@${jobData.version}`,
            pragmas: {},
            output_container: staticProps.outputPath[1].value,
            output_name: staticProps.Output_name.value
        };

        console.log("V1 requestJSON: ", requestJson)
        onFormSubmit(requestJson)

    }

    function onFormSubmit(requestJson) {
        setOnSubmit(true)
        const url = `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/`
        const token = localStorage.getItem('id_token');
        const jobServiceInstance = new JobService(url, token)
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
        const updatedFormElement = {
            ...dynamicProps[obj]
        };

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

        updatedFormElement.value = event.target.value;
        updatedJobSubmissionForm[obj] = updatedFormElement;
        setDynamicProps({ ...updatedJobSubmissionForm })
        window.restoreDynamicProps = { ...updatedJobSubmissionForm }
        generateRestoreRules()
        window.formEdited = true

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
        window.restoreStatic = { ...updatedJobSubmissionForm }
        window.formEdited = true
        if(obj === "Output_name"){
            window.restoreOutputName = event.target.value
        }
        if(obj === "OutputPath"){
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

    useEffect(() => {
        ReactTooltip.rebuild();
    })

    if (!(Object.keys(inputSchema).length === 0 && inputSchema.constructor === Object))
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
                    <div className="flex">
                        <ReactTooltip clickable={true} isCapture = {true} scrollHide = {true} className='toolTip' place='top' effect='solid' />
                        <div className="content">
                            <div className='flex flex-col' >
                                {isToasterFlag ? (
                                    <Toaster errorMsg={errorMsg} success={success} id="CSonNet Contagion Simulation"></Toaster>
                                ) : null}
                                <Formsy
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    // className="p-8 flex border-b border-gray-600"
                                    className="content1"
                                >
                                    <div className='columnStyle'>
                                        <div className='borderStyle '>
                                            <h3><b>Network</b></h3>
                                            <Grid style={childGrid} item container xs={12}>
                                                <Input
                                                    key='Graph'
                                                    formData={dynamicProps.inputFile_Graph}
                                                    elementType={dynamicProps.inputFile_Graph.types}
                                                    value={dynamicProps.inputFile_Graph.value}
                                                    changed={(event) => dynamicChangedHandler(event, 'inputFile_Graph')}
                                                />
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
                                            {dynamicProps.Behaviour.value === 'Threshold Model' && <Deterministic_threshold  modelJSON={modelJSON} threshold_property="deterministic_progressive_node_threshold_value" changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></Deterministic_threshold>}
                                            {dynamicProps.Behaviour.value === 'SEIR Model' && <SEIR   modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SEIR>}
                                            {dynamicProps.Behaviour.value === 'SIR Model' && <SIR  modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SIR>}
                                            {dynamicProps.Behaviour.value === 'SIS Model' && <SIS  modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></SIS>}
                                            {dynamicProps.Behaviour.value === 'Independent Cascade Model' && <ICM  modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></ICM>}
                                            {dynamicProps.Behaviour.value === 'Linear Threshold Model' && <LTM  modelJSON={modelJSON} changed={dynamicChangedHandler}
                                                dynamicProps={dynamicProps}></LTM>}
                                            {dynamicProps.Behaviour.value === 'Probabilistic Threshold Model' && <PTM  modelJSON={modelJSON} changed={dynamicChangedHandler}
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
                                                        required
                                                    />
                                                    {description(inputSchema.properties.time_steps.description)}
                                                </Grid>
                                            </div>
                                            <div style={{ marginLeft: '26px' }}>
                                                <h4 className='mt-16'><b>Initial Conditions</b></h4>
                                                <Grid style={childGrid} item container xs={12} >
                                                    <TextFieldFormsy
                                                        className="my-12 inputStyle1"
                                                        type="text"
                                                        name='Number nodes'
                                                        style={{ width: '18px' }}
                                                        value={String(staticProps.InitialConditions[0].number_nodes)}
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
                                                    />
                                                </Grid>
                                                <Grid style={childGrid} item container xs={12} >
                                                    {dynamicProps.Behaviour.value === 'Threshold Model' && <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.threshold_model.states.indexOf(staticProps.InitialConditions[0].state) !== -1?staticProps.InitialConditions[0].state:""}
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
                                                        value={modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].states.indexOf(staticProps.InitialConditions[0].state) !== -1?staticProps.InitialConditions[0].state:""}
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
                                                        value={modelJSON.models.SIR.submodels['fixed infectious'].states.indexOf(staticProps.InitialConditions[0].state) !== -1?staticProps.InitialConditions[0].state:""}
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

                                                    {dynamicProps.Behaviour.value !== '' && (dynamicProps.Behaviour.value == 'Threshold Model' || dynamicProps.Behaviour.value =='SEIR Model' || dynamicProps.Behaviour.value == 'SIR Model') &&
                                                            description(inputSchema.properties.initial_states_method.items.oneOf[0].properties.state.description)}
                                                </Grid>
                                            </div>
                                            {dynamicProps.Behaviour.value !== '' && <div style={{ marginLeft: '26px' }}>
                                                {dynamicProps.Behaviour.value !== '' && (dynamicProps.Behaviour.value == 'Threshold Model' || dynamicProps.Behaviour.value =='SEIR Model' || dynamicProps.Behaviour.value == 'SIR Model') &&
                                                        <h4 className='my-16'><b>Initial Conditions (default)</b></h4>}
                                               
                                                <Grid style={childGrid} item container xs={12} >
                                                    {dynamicProps.Behaviour.value === 'Threshold Model' && <SelectFormsy
                                                        className="my-12 inputStyle1 model"
                                                        name="state"
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.threshold_model.default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
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
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
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
                                                        label={["Default State", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={modelJSON.models.SIR.submodels['fixed infectious'].default_state}
                                                        onChange={(event) => staticChangedHandler(event, 'default_state')}
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
                                                    {dynamicProps.Behaviour.value !== '' && (dynamicProps.Behaviour.value == 'Threshold Model' || dynamicProps.Behaviour.value =='SEIR Model' || dynamicProps.Behaviour.value == 'SIR Model') && 
                                                    description(inputSchema.properties.default_state.description)}
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
                                                    key='output_path'
                                                    formData={staticProps.outputPath}
                                                    elementType={staticProps.outputPath.types}
                                                    value={staticProps.outputPath.value}
                                                    changed={(event) => staticChangedHandler(event, 'OutputPath')}
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
                                        aria-label="LOG IN"
                                        onClick={populatesubmitJSON}
                                        disabled={!isFormValid || success }                                    >
                                        Submit
							</Button>
                                    {(props.resubmit || props.localResubmit) ? <Link to="/apps/my-jobs/" style={{ color: 'transparent' }}>
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
export default CSonNet_Contagion_Simulation_v1;