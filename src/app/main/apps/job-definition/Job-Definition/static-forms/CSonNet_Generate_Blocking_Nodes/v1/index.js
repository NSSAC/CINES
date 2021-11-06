import { Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
// import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import { JobService } from 'node-sciduct';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { FusePageSimple } from '@fuse';
/* eslint-disable */
import { SelectFormsy, TextFieldFormsy } from '@fuse/components/formsy';

import Toaster from '../../../Toaster.js';
import { Input } from '../../SelectFile'

import '../../SelectFile.css'

const CSonNet_Generate_Blocking_Nodes = (props) => {
    const [modelJSON, setModelJSON] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [success, setSuccess] = useState();
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [existsFlag, setExistsFlag] = useState(false);
    const [inputFields, setInputFields] = useState([]);
    const [errorMsg, setErrorMsg] = useState();
    const [dynamicProps, setDynamicProps] = useState({})
    const [staticProps, setStaticProps] = useState({})
    const history = useHistory();
    const dispatch = useDispatch()

    const childGrid = {
        paddingLeft: '15px',
        alignSelf: 'center'
    };

    function disableButton() {
        console.log("Disable Button form invalid")
        setIsFormValid(false);
    }

    const onFormCancel = () => {
    };

    function enableButton() {
        console.log(`enableBut() existsFlag: ${existsFlag}`)
        if (existsFlag)
            setIsFormValid(true);
        else
            setIsFormValid(false);

    }

    useEffect(() => {
        setIsToasterFlag(false);
        // let pathEnd = 'net.science/Contagion_dynamics'
        // setIsToasterFlag(false);
        // if (props.job_definition.id && !props.job_definition.id.includes(pathEnd) || Object.keys(props.job_definition).length === 0)
        // dispatch(Actions.setSelectedItem(pathEnd));
        // if (Object.keys(props.job_definition).length !== 0 && props.job_definition.id.includes(pathEnd)) {
        //         if (props.job_definition) {
        // console.log(`useEffect() setDynamicProps from resubmit`, props.resubmit)
        setDynamicProps({
            blocking_class: { id: 101, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input && typeof props.resubmit.inputData.input.blocking_class !== 'undefined')?props.resubmit.inputData.input.blocking_class:"" , required: true },
            blocking_method: {id: 102, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input && typeof props.resubmit.inputData.input.blocking_method !== 'undefined')?props.resubmit.inputData.input.blocking_method:"", required: true},
            random_seed: {id: 103, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input && typeof props.resubmit.inputData.input.random_seed !== 'undefined')?props.resubmit.inputData.input.random_seed:0, required: true},
            number_blocking_nodes: {id: 104, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input && typeof props.resubmit.inputData.input.number_blocking_nodes !== 'undefined')?props.resubmit.inputData.input.number_blocking_nodes:1, required: true},
            blocking_node_state: {id: 105, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input)?props.resubmit.inputData.input.blocking_node_state:"", required: true},
            inactive_state: {id: 105, value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input)?props.resubmit.inputData.input.inactive_state:"", required: true},
            output_name: { value: (props.resubmit && props.resubmit.inputData && props.resubmit.inputData.input && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name : '' },
            csonnet_simulation: ['Simulation output file', {
                formLabel: 'Simulation Output File',
                id: 1,
                name: 'Simulation output file',
                outputFlag: false,
                required: true,
                types: ['csonnet_simulation_container'],
                value: props.resubmit ? props.resubmit.inputData.input["csonnet_simulation"] : ""
            }],
            output_path: ['output_path', {
                description: "Select the path from File manager where the output file is to be stored.",
                formLabel: "Output Container",
                id: 200,
                outputFlag: true,
                types: ["folder"],
                value: props.resubmit ? props.resubmit.inputData.output_container : ""
            }]
        },[props.resubmit])


        console.log("DYNAMIC_PROPS: ", dynamicProps)
        props.resubmit && localStorage.setItem('formLastPath', props.resubmit.inputData.output_container)
         setModelJSON(props.job_definition.input_schema)

    }, [props]);

    // useEffect(() => {
    //     inputFields.length == 0 && props.resubmit && props.resubmit.inputData.input.text_sections.legend_section.legend_items && setInputFields(props.resubmit.inputData.input.text_sections.legend_section.legend_items)
    //     // dynamicProps.triples && inputFields.length && setInputFields(dynamicProps.triples.value)
    // }, [dynamicProps])

    useEffect(()=>{
        console.log("Dynamic Props Changed: ", dynamicProps)
    }, [dynamicProps])

    const description = (desc) =>
        <span style={{ marginTop: '38px' }} data-tip={desc}>
            <Icon fontSize="small">info</Icon>
        </span>

    function inputChangedHandler(event, obj) {
        const updatedJobSubmissionForm = {
            ...dynamicProps
        };
        const updatedFormElement = {
            ...dynamicProps[obj]
        };

        updatedFormElement.value = event.target.value;

        updatedJobSubmissionForm[obj] = updatedFormElement;
        setDynamicProps({ ...updatedJobSubmissionForm });
    }

    const createSubmissionData = () => {
        console.log("Random Seed: ", dynamicProps.random_seed)
        const random_seed = (dynamicProps.random_seed.value === "0")?(Math.floor(Math.random() * 1000)):parseInt(dynamicProps.random_seed.value)
        let requestJson = {
            "csonnet_simulation": dynamicProps.csonnet_simulation[1].value,
            "blocking_class": dynamicProps.blocking_class.value,
            "blocking_method": dynamicProps.blocking_method.value,
            "random_seed": random_seed,
            "blocking_node_state": dynamicProps.blocking_node_state.value,
            "inactive_state": dynamicProps.inactive_state.value,
            "number_blocking_nodes": parseInt(dynamicProps.number_blocking_nodes.value),
            "blocking_type": "node"

        }
        populateBody(requestJson)
    }

    function populateBody(submitJSON) {
        setIsToasterFlag(true);
        var path = window.location.pathname.replace("/apps/job-definition/", "");
        var jobDefinition = `${props.job_definition.namespace}/${props.jobdef}@${props.version}`;
        var requestJson = {
            input: submitJSON,
            job_definition: jobDefinition,
            pragmas: {},
            output_container: dynamicProps.output_path[1].value,
            output_name: dynamicProps.output_name.value
        };

        console.log("Form Data: ", requestJson)
        onFormSubmit(requestJson)

    }

    function onFormSubmit(requestJson) {
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
                window.setTimeout(handlingError, 4000);
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

    function handlingError() {
        setIsToasterFlag(false);
    }

    function delayNavigation() {
        history.push('/apps/my-jobs/');
    }

    useEffect(() => {
        // var count = 0;
        // Object.entries(dynamicProps).map((formElement) => {
        //     console.log("formElement: ", formElement[1].id, formElement[1].value)
        //     if (formElement[1].id > 100 && formElement[1].id < 105) {
        //         if (formElement[1].value === 'true')
        //             count++;
        //     }
        //     return null;
        // })
        // console.log("Count: ", count)
        // if (count === 0)
            // setExistsFlag(false)
        // else
             setExistsFlag(true)

        ReactTooltip.rebuild();
    })

    // if (!(Object.keys(modelJSON).length === 0 && modelJSON.constructor === Object))
    if (!(Object.keys(dynamicProps).length === 0 && dynamicProps.constructor === Object))
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
                    <div className="content">
                        <div >
                            {isToasterFlag ? (
                                <Toaster errorMsg={errorMsg} success={success} id="CSonNet Blocking Contagion Dynamics"></Toaster>
                            ) : null}
                            <div>
                                <Formsy
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    className="content1"
                                >
                                    <div className='columnStyle'>
                                        <Grid style={childGrid} item container xs={12}>

                                            <div style={{ width: '100%' }} className='descPlot'>
                                                <div className="pl-20">
                                                    <Input
                                                        key='Simulation output file'
                                                        name="output_path"
                                                        formData={dynamicProps.csonnet_simulation}
                                                        elementType={dynamicProps.csonnet_simulation.types}
                                                        value=""
                                                        changed={(event) => inputChangedHandler(event, 'output_path')}
                                                    />
                                                </div>

                                                <SelectFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    name="blocking_class"
                                                    label={["Blocking Class", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                    value={dynamicProps.blocking_class.value}
                                                    onChange={(event) => inputChangedHandler(event, 'blocking_class')}
                                                >
                                                    <MenuItem key='global' value='global'>global</MenuItem>
                                                    {/* <MenuItem key='local' value='local'>local</MenuItem> */}
                                                </SelectFormsy>
                                                {description(null)}
                                                {dynamicProps.blocking_class.value !== '' && <React.Fragment>
                                                    <SelectFormsy
                                                        className="my-12 mt-16 inputStyle-plot"
                                                        name="blocking_method"
                                                        label={["Blocking Method", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value={dynamicProps.blocking_method.value}
                                                        onChange={(event) => inputChangedHandler(event, 'blocking_method')}
                                                    >
                                                        {dynamicProps.blocking_class.value === 'global' && <MenuItem key='RandomNodes' value='randomNodes'>Random Nodes</MenuItem>}
                                                        {dynamicProps.blocking_class.value === 'global' && <MenuItem key='HighDegreeNodes' value='highDegreeNodes'>High Degree Nodes</MenuItem>}

                                                        {/* {dynamicProps.blocking_class.value === 'local' && <MenuItem key='Covering' value='Covering'>Covering</MenuItem>} */}
                                                    </SelectFormsy>
                                                    {description(null)}
                                                </React.Fragment>}
                                            </div>
                                        </Grid>
                                    </div>
                                    <div className='columnStyle divideProps'>
                                        <Grid style={childGrid} item container xs={12}>
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='random_seed'
                                                value={(dynamicProps && dynamicProps.random_seed)?dynamicProps.random_seed.value:0}
                                                style={{ width: '18px' }}
                                                label="Random Seed"
                                                onBlur={(event) => inputChangedHandler(event, 'random_seed')}
                                                validations={{
                                                    gte0: function (_values, value) {
                                                        return parseInt(value)>=0
                                                    }
                                                }}
                                                validationError="This is not a valid value"
                                                autoComplete="off"
                                                required
                                            />
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='number_blocking_nodes'
                                                style={{ width: '18px' }}
                                                label="Number of blocking nodes"
                                                value={dynamicProps.number_blocking_nodes.value}
                                                onBlur={(event) => inputChangedHandler(event, 'number_blocking_nodes')}
                                                validations={{
                                                    isPositiveInt: function (_values, value) {
                                                        return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                    }
                                                }}
                                                validationError="This is not a valid value"
                                                autoComplete="off"
                                                required
                                            />
                                            {description(null)}
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='blocking_node_state'
                                                style={{ width: '18px' }}
                                                value={dynamicProps.blocking_node_state.value}
                                                label="Blocking State"
                                                onBlur={(event) => inputChangedHandler(event, 'blocking_node_state')}
                                                autoComplete="off"
                                                validationError="This is not a valid value"
                                                required
                                            />
                                            {description(null)}
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='inactive_state'
                                                style={{ width: '18px' }}
                                                value={dynamicProps.inactive_state.value}
                                                label="Inactive State"
                                                onBlur={(event) => inputChangedHandler(event, 'inactive_state')}
                                                autoComplete="off"
                                                validationError="This is not a valid value"
                                                required
                                            />
                                            {description(null)}
                                            <div className="h3 mt-12" style={{ width: '100%' }}><b>Output</b></div>
                                            <div className="pl-20">
                                                <Input
                                                    key='output_path'
                                                    name="output_path"
                                                    formData={dynamicProps.output_path}
                                                    elementType={dynamicProps.output_path.types}
                                                    value=""
                                                    changed={(event) => inputChangedHandler(event, 'output_path')}
                                                />
                                            </div>
                                            <TextFieldFormsy
                                                className="mb-12 inputStyle-plot"
                                                type="text"
                                                name='output_name'
                                                style={{ width: '18px' }}
                                                value=""
                                                label="Output Name"
                                                onBlur={(event) => inputChangedHandler(event, 'output_name')}
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
                                    </div>

                                </Formsy>
                                <div style={{ textAlign: 'end' }}>
                                    <Button
                                        // type="submit"
                                        variant="contained"
                                        color="primary"
                                        className="w-30  mt-32 mb-80"
                                        aria-label="LOG IN"
                                        onClick={createSubmissionData}
                                        disabled={!isFormValid || success}                                    >
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
                        <ReactTooltip clickable={true} isCapture={true} scrollHide={true} className='toolTip' place='top' effect='solid' />
                    </div>
                }
            />

        );

    else return null;
}

export default CSonNet_Generate_Blocking_Nodes;
