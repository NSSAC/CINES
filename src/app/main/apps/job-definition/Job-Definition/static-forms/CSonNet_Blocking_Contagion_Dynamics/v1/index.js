/* eslint-disable */
import {
    SelectFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import { Icon } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import { Input } from './SelectFile.js'
import './SelectFile.css'
import Toaster from '../Toaster.js';
import { useDispatch, useSelector } from "react-redux";
import { JobService } from 'node-sciduct';

const Contagion_dynamics = (props) => {
    const jobData = useSelector(
        ({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid
    );
    const [modelJSON, setModelJSON] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [success, setSuccess] = useState();
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [existsFlag, setExistsFlag] = useState(false);
    const [inputFields, setInputFields] = useState([]);
    const [errorMsg, setErrorMsg] = useState();
    const [dynamicProps, setDynamicProps] = useState({})
    const history = useHistory();
    const dispatch = useDispatch()

    const childGrid = {
        paddingLeft: '15px',
        alignSelf: 'center'
    };

    function disableButton() {
        setIsFormValid(false);
    }


    const onFormCancel = () => {
    };

    function enableButton() {
        if (existsFlag)
            setIsFormValid(true);
        else
            setIsFormValid(false);

    }

    useEffect(() => {
        setIsToasterFlag(false);
        // let pathEnd = 'net.science/Contagion_dynamics'
        // setIsToasterFlag(false);
        // if (jobData.id && !jobData.id.includes(pathEnd) || Object.keys(jobData).length === 0)
        // dispatch(Actions.setSelectedItem(pathEnd));
        // if (Object.keys(jobData).length !== 0 && jobData.id.includes(pathEnd)) {
        //         if (jobData) {
        setDynamicProps({
            blocking_class: { id: 101, value: '' },
            Output_name: { value: (props.resubmit && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name : '' },
            Graph: ['Graph', {
                formLabel: 'Graph',
                id: 0,
                name: 'Graph',
                outputFlag: false,
                required: true,
                types: ['PUNGraph', 'PNGraph', 'PNEANet'],
                value: props.resubmit ? props.resubmit.inputData.input["csonnet_data_analysis"] : ""
            }],
            inputFile_Graph: ['Simulation output file', {
                formLabel: 'Simulation output file',
                id: 1,
                name: 'Simulation output file',
                outputFlag: false,
                required: true,
                types: ['csonnet_simulation'],
                value: props.resubmit ? props.resubmit.inputData.input["csonnet_data_analysis"] : ""
            }],
            outputPath: ['outputPath', {
                description: "Select the path from File manager where the output file is to be stored.",
                formLabel: "output_container",
                id: 200,
                outputFlag: true,
                types: ["folder", "epihiper_multicell_analysis", "epihiperOutput"],
                value: props.resubmit ? props.resubmit.inputData.output_container : ""
            }]
        })
        props.resubmit && localStorage.setItem('formLastPath', props.resubmit.inputData.output_container)
        //  setModelJSON(jobData.input_schema)
        // }
        // }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        inputFields.length == 0 && props.resubmit && props.resubmit.inputData.input.text_sections.legend_section.legend_items && setInputFields(props.resubmit.inputData.input.text_sections.legend_section.legend_items)
        // dynamicProps.triples && inputFields.length && setInputFields(dynamicProps.triples.value)
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
        const requestJson = {}
        populateBody(requestJson)
    }

    function populateBody(submitJSON) {
        setIsToasterFlag(true);
        var path = window.location.pathname.replace("/apps/job-definition/", "");
        var jobDefinition = path;
        var requestJson = {
            input: submitJSON,
            job_definition: jobDefinition,
            pragmas: {
                account: "ARCS:bii_nssac",
            },
            output_container: dynamicProps.outputPath[1].value,
            output_name: dynamicProps.Output_name.value
        };

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
        var count = 0;
        Object.entries(dynamicProps).map((formElement) => {
            if (formElement[1].id > 100 && formElement[1].id < 105) {
                if (formElement[1].value === 'true')
                    count++;
            }
            return null;
        })
        if (count === 0)
            setExistsFlag(false)
        else
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
                            <Typography className="h2"><b>CSonNet Blocking Contagion Dynamics</b></Typography>
                            <Typography className="h4" style={{ whiteSpace: "break-spaces" }}>&nbsp;{modelJSON.description}
                                {/* {`. This task outputs files of type ${(jobData.output_files.contents.map(a => a.name)).toString()} in your chosen location. `} */}
                            </Typography>
                            <div>
                                <Formsy
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    className="content1"

                                >
                                    <div className='columnStyle'>
                                        <Grid style={childGrid} item container xs={12}>

                                            <div style={{ width: '100%' }} className='descPlot'>
                                                <SelectFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    name="blocking_class"
                                                    label={["Blocking Class", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                    value=""
                                                    onChange={(event) => inputChangedHandler(event, 'blocking_class')}
                                                >
                                                    <MenuItem key='global' value='global'>global</MenuItem>
                                                    <MenuItem key='local' value='local'>local</MenuItem>
                                                </SelectFormsy>
                                                {description(null)}
                                                {dynamicProps.blocking_class.value !== '' && <React.Fragment>
                                                    <SelectFormsy
                                                        className="my-12 mt-16 inputStyle-plot"
                                                        name="blocking_method"
                                                        label={["Blocking Method", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                        value=""
                                                    // onChange={(event) => inputChangedHandler(event, 'output_filetype')}
                                                    >
                                                        {dynamicProps.blocking_class.value === 'global' && <MenuItem key='random_heuristic' value='random_heuristic'>random heuristic</MenuItem>}
                                                        {dynamicProps.blocking_class.value === 'global' && <MenuItem key='high_degree_heuristic' value='high_degree_heuristic'>high degree heuristic</MenuItem>}
                                                        {dynamicProps.blocking_class.value === 'local' && <MenuItem key='covering_method' value='covering_method'>covering method</MenuItem>}
                                                    </SelectFormsy>
                                                    {description(null)}
                                                    <div className="pl-20 w-full">
                                                        <Input
                                                            key='Graph'
                                                            formData={dynamicProps.Graph}
                                                            elementType={dynamicProps.Graph.types}
                                                            value=""
                                                        // changed={(event) => inputChangedHandler(event, 'OutputPath')}
                                                        />
                                                    </div>
                                                    <div className="pl-20">
                                                        <Input
                                                            key='Simulation output file'
                                                            formData={dynamicProps.inputFile_Graph}
                                                            elementType={dynamicProps.inputFile_Graph.types}
                                                            value=""
                                                        // changed={(event) => inputChangedHandler(event, 'OutputPath')}
                                                        />
                                                    </div>
                                                </React.Fragment>}
                                            </div>
                                        </Grid>
                                    </div>
                                    <div className='columnStyle divideProps'>
                                        <Grid style={childGrid} item container xs={12}>
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='blocking_nodes'
                                                style={{ width: '18px' }}
                                                label="Number of blocking nodes"
                                                value=""
                                                // onBlur={(event) => inputChangedHandler(event, 'line_width')}
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
                                                name='Model state'
                                                style={{ width: '18px' }}
                                                value=""
                                                label="Model state"
                                                // onBlur={(event) => inputChangedHandler(event, 'Output_name')}
                                                autoComplete="off"
                                                validations={{
                                                    isPositiveInt: function (values, value) {
                                                        return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value);
                                                    },
                                                }}
                                                validationError="This is not a valid value"
                                                required
                                            />
                                            {description(null)}
                                            <div className="h3 mt-12" style={{ width: '100%' }}><b>Output</b></div>
                                            <div className="pl-20">
                                                <Input
                                                    key='output_path'
                                                    formData={dynamicProps.outputPath}
                                                    elementType={dynamicProps.outputPath.types}
                                                    value=""
                                                // changed={(event) => inputChangedHandler(event, 'OutputPath')}
                                                />
                                            </div>
                                            <TextFieldFormsy
                                                className="mb-12 inputStyle-plot"
                                                type="text"
                                                name='Output Name'
                                                style={{ width: '18px' }}
                                                value=""
                                                label="Output Name"
                                                // onBlur={(event) => inputChangedHandler(event, 'Output_name')}
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

export default Contagion_dynamics;
