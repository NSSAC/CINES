/* eslint-disable */
import {
    RadioGroupFormsy,
    SelectFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Formsy from 'formsy-react';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import axios from 'axios';
import { Icon } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import PlotTypes from './CSonNet_plot/plotTypes.js';
import LegendSection from './CSonNet_plot/legendSection.js';
import TitleSection from './CSonNet_plot/titleSection.js';
import XAxisSection from './CSonNet_plot/xAxisSection.js';
import YAxisSection from './CSonNet_plot/yAxisSection.js';
import TickSection from './CSonNet_plot/tickSection.js';
import { Input } from './SelectFile.js'
import './SelectFile.css'
import Toaster from '../Toaster.js';

const CSonNet_plot = (props) => {
    const [modelJSON, setModelJSON] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [success, setSuccess] = useState();
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [existsFlag, setExistsFlag] = useState(false);
    const [inputFields, setInputFields] = useState([]);
    const [errorMsg, setErrorMsg] = useState();
    const [dynamicProps, setDynamicProps] = useState({})
    const history = useHistory();

    const childGrid = {
        paddingLeft: '25px',
        alignSelf: 'center'
    };
    console.log("test" && "book")

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
        var userToken = localStorage.getItem('id_token');

        axios({
            method: 'get',
            url: `${process.env.REACT_APP_SCIDUCT_JOB_SERVICE}/job_definition/net.science/CSonNet_Plotting`,
            headers: {
                'Access-Control-Allow-Origin': '* ',
                Authorization: userToken
            }
        }).then(
            (res) => {
                // setSpinnerFlag(false)
                if (res.data) {
                    setDynamicProps({errorbar_plot: { id: 101, value: props.resubmit && Boolean(props.resubmit.inputData.input.plot_types.errorbar_plot.toString())? props.resubmit.inputData.input.plot_types.errorbar_plot.exists.toString(): '' },
                    line_plot: { id: 102, value: props.resubmit && Boolean(props.resubmit.inputData.input.plot_types.line_plot.toString())? props.resubmit.inputData.input.plot_types.line_plot.toString(): '' },
                    scatter_plot: { id: 103, value: props.resubmit && Boolean(props.resubmit.inputData.input.plot_types.scatter_plot.toString())? props.resubmit.inputData.input.plot_types.scatter_plot.toString():'' },
                    bar_plot: { id: 104, value: props.resubmit && Boolean(props.resubmit.inputData.input.plot_types.bar_plot.toString())? props.resubmit.inputData.input.plot_types.bar_plot.exists.toString():'' },
                    errorbar_capsize: { id: 1011, value: props.resubmit && props.resubmit.inputData.input.plot_types.errorbar_plot.capsize ? props.resubmit.inputData.input.plot_types.errorbar_plot.capsize:3 },
                    capwidth: { id: 1012, value: props.resubmit && props.resubmit.inputData.input.plot_types.errorbar_plot.capwidth ? props.resubmit.inputData.input.plot_types.errorbar_plot.capwidth:1 },
                    show_error_every: { id: 1013, value: props.resubmit && props.resubmit.inputData.input.plot_types.errorbar_plot.show_error_every ? props.resubmit.inputData.input.plot_types.errorbar_plot.show_error_every:1 },
                    bar_width: { id: 1041, value: props.resubmit && props.resubmit.inputData.input.plot_types.bar_plot.bar_width ? props.resubmit.inputData.input.plot_types.bar_plot.bar_width:0.25 },
                    bar_annotation_fontsize: { id: 1042, value: props.resubmit && props.resubmit.inputData.input.plot_types.bar_plot.bar_annotation_fontsize ? props.resubmit.inputData.input.plot_types.bar_plot.bar_annotation_fontsize:10 },
                    show_points: { id: 201, value: props.resubmit && Boolean(props.resubmit.inputData.input.show_points.toString()) ? props.resubmit.inputData.input.show_points.toString():"" },
                    line_width: { id: 202, value: props.resubmit && props.resubmit.inputData.input.line_width ? props.resubmit.inputData.input.line_width:4 },
                    output_filetype: { id: 203, value: props.resubmit && props.resubmit.inputData.input.output_filetype ? props.resubmit.inputData.input.output_filetype:"" },
                    legend_fontsize: { id: 301, value: props.resubmit && props.resubmit.inputData.input.text_sections.legend_section.legend_fontsize ? props.resubmit.inputData.input.text_sections.legend_section.legend_fontsize:25 },
                    triples: { id: 302, value:[] },
                    add_legend_items: { id: 303, value: "" },
                    title_fontsize: { id: 401, value: props.resubmit && props.resubmit.inputData.input.text_sections.title_section.title_fontsize ? props.resubmit.inputData.input.text_sections.title_section.title_fontsize:15 },
                    title_text: { id: 402, value: props.resubmit && props.resubmit.inputData.input.text_sections.title_section.title_text ? props.resubmit.inputData.input.text_sections.title_section.title_text:"" },
                    x_axis_fontsize: { id: 501, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_axis_fontsize ? props.resubmit.inputData.input.text_sections.x_axis_section.x_axis_fontsize:35 },
                    x_axis_text: { id: 502, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_axis_text ? props.resubmit.inputData.input.text_sections.x_axis_section.x_axis_text:"" },
                    x_scale: { id: 503, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_scale ? props.resubmit.inputData.input.text_sections.x_axis_section.x_scale:"" },
                    set_x_limits: { id: 504, value: props.resubmit && Boolean(props.resubmit.inputData.input.text_sections.x_axis_section.set_x_limits.toString()) ? props.resubmit.inputData.input.text_sections.x_axis_section.set_x_limits.toString():"" },
                    x_limit_lower: { id: 505, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_limit_lower ? props.resubmit.inputData.input.text_sections.x_axis_section.x_limit_lower:"" },
                    x_limit_higher: { id: 506, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_limit_higher ? props.resubmit.inputData.input.text_sections.x_axis_section.x_limit_higher:"" },
                    set_x_increment: { id: 507, value: props.resubmit && Boolean(props.resubmit.inputData.input.text_sections.x_axis_section.set_x_increment.toString()) ? props.resubmit.inputData.input.text_sections.x_axis_section.set_x_increment.toString():"" },
                    x_increment: { id: 508, value: props.resubmit && props.resubmit.inputData.input.text_sections.x_axis_section.x_increment ? props.resubmit.inputData.input.text_sections.x_axis_section.x_increment:"" },
                    y_axis_fontsize: { id: 601, value: props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_axis_fontsize ? props.resubmit.inputData.input.text_sections.y_axis_section.y_axis_fontsize:35 },
                    y_axis_text: { id: 602, value: props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_axis_text ? props.resubmit.inputData.input.text_sections.y_axis_section.y_axis_text:"" },
                    y_scale: { id: 603, value: props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_scale ? props.resubmit.inputData.input.text_sections.y_axis_section.y_scale:"" },
                    set_y_limits: { id: 604, value: props.resubmit && Boolean(props.resubmit.inputData.input.text_sections.y_axis_section.set_y_limits.toString()) ? props.resubmit.inputData.input.text_sections.y_axis_section.set_y_limits.toString():"" },
                    y_limit_lower: { id: 605, value:  props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_limit_lower ? props.resubmit.inputData.input.text_sections.y_axis_section.y_limit_lower:"" },
                    y_limit_higher: { id: 606, value: props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_limit_higher ? props.resubmit.inputData.input.text_sections.y_axis_section.y_limit_higher:"" },
                    set_y_increment: { id: 607, value: props.resubmit && Boolean(props.resubmit.inputData.input.text_sections.y_axis_section.set_y_increment.toString()) ? props.resubmit.inputData.input.text_sections.y_axis_section.set_y_increment.toString():"" },
                    y_increment: { id: 608, value:  props.resubmit && props.resubmit.inputData.input.text_sections.y_axis_section.y_increment ? props.resubmit.inputData.input.text_sections.y_axis_section.y_increment:"" },
                    tick_fontsize: { id: 701, value: props.resubmit && props.resubmit.inputData.input.text_sections.tick_section.tick_fontsize ? props.resubmit.inputData.input.text_sections.tick_section.tick_fontsize:35 },
                    axes_in_scientfic: { id: 702, value: props.resubmit && props.resubmit.inputData.input.text_sections.tick_section.axes_in_scientific ? props.resubmit.inputData.input.text_sections.tick_section.axes_in_scientific:"" },
                    dpi: { id: 801, value:  props.resubmit && props.resubmit.inputData.input.dpi ? props.resubmit.inputData.input.dpi:600 },
                    Output_name: { value: (props.resubmit && props.resubmit.inputData.state !== "Completed") ? props.resubmit.inputData.output_name :'' },
                    inputFile_Graph: [res.data.input_files[0].name, {
                        formLabel: res.data.input_files[0].name,
                        id: 0,
                        name: res.data.input_files[0].name,
                        outputFlag: false,
                        required: true,
                        types: res.data.input_files[0].types,
                        value: props.resubmit ? props.resubmit.inputData.input["csonnet_data_analysis"] : ""
                    }],
                    outputPath: ['outputPath', {
                        description: "Select the path from File manager where the output file is to be stored.",
                        formLabel: "output_container",
                        id: 200,
                        outputFlag: true,
                        types: ["folder", "epihiper_multicell_analysis", "epihiperOutput"],
                        value: props.resubmit ? props.resubmit.inputData.output_container :""
                    }]
                 })
                 setModelJSON(res.data.input_schema)
                }
            },
            (error) => {

            }

        );
        // eslint-disable-next-line
    }, []);

    useEffect(()=>{
        inputFields.length == 0 && props.resubmit && props.resubmit.inputData.input.text_sections.legend_section.legend_items && setInputFields(props.resubmit.inputData.input.text_sections.legend_section.legend_items)
        // dynamicProps.triples && inputFields.length && setInputFields(dynamicProps.triples.value)
    },[dynamicProps])


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
        const tempTriples = {
            ...dynamicProps
        };
        const tempTriple = {
            ...dynamicProps.triples
        };

        var count = 0

        for (var i = 0; i < inputFields.length; i++) {
            if (inputFields[i].data_color !== '' && inputFields[i].alpha_values !== '') {
                if (inputFields[i].legend_name !== "")
                    tempTriple.value[count] = { legend_name: inputFields[i].legend_name, data_color: inputFields[i].data_color, alpha_values: inputFields[i].alpha_values }
                else
                    tempTriple.value[count] = { data_color: inputFields[i].data_color, alpha_values: inputFields[i].alpha_values }
                count++;
            }

            tempTriples.triples = tempTriple
            setDynamicProps({ ...tempTriples });
            console.log(tempTriples)

        }


        const requestJson = {
            "csonnet_data_analysis": dynamicProps.inputFile_Graph[1].value,
            "plot_types": {
                "errorbar_plot": {
                    "exists": dynamicProps.errorbar_plot.value === 'true' ? true : false,
                    "capwidth": parseInt(dynamicProps.capwidth.value),
                    "capsize": parseInt(dynamicProps.errorbar_capsize.value),
                    "show_error_every": parseInt(dynamicProps.show_error_every.value)
                },
                "line_plot": dynamicProps.line_plot.value === 'true' ? true : false,
                "scatter_plot": dynamicProps.scatter_plot.value === 'true' ? true : false,
                "bar_plot": {
                    "exists": dynamicProps.bar_plot.value === 'true' ? true : false,
                    "bar_width": parseFloat(dynamicProps.bar_width.value),
                    "bar_annotation_fontsize": parseInt(dynamicProps.bar_annotation_fontsize.value)
                }
            },
            "show_points": dynamicProps.show_points.value === 'true' ? true : false,
            "line_width": parseInt(dynamicProps.line_width.value),
            "output_filetype": dynamicProps.output_filetype.value,
            "text_sections": {
                "legend_section": {
                    "legend_fontsize": parseInt(dynamicProps.legend_fontsize.value),
                    "legend_items": dynamicProps.triples.value,
                },
                "title_section": {
                    "title_fontsize": parseInt(dynamicProps.title_fontsize.value),
                    "title_text": dynamicProps.title_text.value
                },
                "x_axis_section": {
                    "x_axis_fontsize": parseInt(dynamicProps.x_axis_fontsize.value),
                    "x_axis_text": dynamicProps.x_axis_text.value,
                    "x_scale": dynamicProps.x_scale.value,
                    "set_x_limits": (dynamicProps.set_x_limits.value === 'true' ? true : false),
                    ...(dynamicProps.set_x_limits.value === 'true' && { "x_limit_lower": parseFloat(dynamicProps.x_limit_lower.value), "x_limit_higher": parseFloat(dynamicProps.x_limit_higher.value) }),
                    "set_x_increment": (dynamicProps.set_x_increment.value === 'true' ? true : false),
                    ...(dynamicProps.set_x_increment.value === 'true' && { "x_increment": parseFloat(dynamicProps.x_increment.value) })

                },
                "y_axis_section": {
                    "y_axis_fontsize": parseInt(dynamicProps.y_axis_fontsize.value),
                    "y_axis_text": dynamicProps.y_axis_text.value,
                    "y_scale": dynamicProps.y_scale.value,
                    "set_y_limits": (dynamicProps.set_y_limits.value === 'true' ? true : false),
                    ...(dynamicProps.set_y_limits.value === 'true' && { "y_limit_lower": parseFloat(dynamicProps.y_limit_lower.value), "y_limit_higher": parseFloat(dynamicProps.y_limit_higher.value) }),
                    "set_y_increment": (dynamicProps.set_y_increment.value === 'true' ? true : false),
                    ...(dynamicProps.set_y_increment.value === 'true' && { "y_increment": parseFloat(dynamicProps.x_increment.value) })
                },
                "tick_section": {
                    "tick_fontsize": parseInt(dynamicProps.tick_fontsize.value),
                    "axes_in_scientific": dynamicProps.axes_in_scientfic.value,
                }
            },
            "dpi": parseInt(dynamicProps.dpi.value)
        }

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

    if (!(Object.keys(modelJSON).length === 0 && modelJSON.constructor === Object))
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
                        <div >
                        {isToasterFlag ? (
                                    <Toaster errorMsg={errorMsg} success={success} id="CSonNet Plotting"></Toaster>
                                ) : null}
                            <Typography className="h2"><b>CSonNet plot</b></Typography>
                            <Typography className="h4" style={{ whiteSpace: "break-spaces" }}>&nbsp;{modelJSON.description}</Typography>
                            <div>
                                <Formsy
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    className="content1"

                                >
                                    <div className='columnStyle'>
                                        <Grid style={childGrid} item container xs={12}>
                                        <div className='borderStyle '>
                                            <h3><b>Network</b></h3>
                                            <Grid style={childGrid} item container xs={12}>
                                                <Input
                                                    key='Graph'
                                                    formData={dynamicProps.inputFile_Graph}
                                                    elementType={dynamicProps.inputFile_Graph.types}
                                                    value={dynamicProps.inputFile_Graph.value}
                                                    changed={(event) => inputChangedHandler(event, 'inputFile_Graph')}
                                                />
                                            </Grid>
                                        </div>
                                            <PlotTypes modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></PlotTypes>
                                            {existsFlag && <div className="h3 mt-12" style={{ width: '100%' }}><b>Plot properties</b></div>}
                                            {existsFlag && <div style={{ width: '100%' }} className='descPlot'>
                                                <RadioGroupFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    name="show_points"
                                                    label='show_points'
                                                    value={dynamicProps.show_points.value}
                                                    onChange={(event) => inputChangedHandler(event, 'show_points')}
                                                    required
                                                >
                                                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                                                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                                                </RadioGroupFormsy>
                                                {description(modelJSON.properties.show_points.description)}

                                                <TextFieldFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    type="text"
                                                    name='line_width'
                                                    style={{ width: '18px' }}
                                                    label="line_width"
                                                    value={dynamicProps.line_width.value}
                                                    onBlur={(event) => inputChangedHandler(event, 'line_width')}
                                                    validations={{
                                                        isPositiveInt: function (_values, value) {
                                                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                {description(modelJSON.properties.line_width.description)}

                                                <SelectFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    name="output_filetype"
                                                    label={["output_filetype", <span key={1} style={{ color: 'red' }}>{'*'}</span>]}
                                                    value={dynamicProps.output_filetype.value}
                                                    onChange={(event) => inputChangedHandler(event, 'output_filetype')}
                                                >
                                                    {modelJSON.properties.output_filetype.enum.map((item) => {
                                                        return (
                                                            <MenuItem key={item} value={item}>
                                                                {item}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </SelectFormsy>
                                                {description(modelJSON.properties.output_filetype.description)}
                                            </div>}
                                            <div className="h3 mt-12" style={{ width: '100%' }}><b>Output</b></div>
                                            <TextFieldFormsy
                                                className="my-12 mt-16 inputStyle-plot"
                                                type="text"
                                                name='Output Name'
                                                style={{ width: '18px' }}
                                                value={dynamicProps.Output_name.value}
                                                label="Output Name"
                                                onBlur={(event) => inputChangedHandler(event, 'Output_name')}
                                                autoComplete="off"
                                                validations={{
                                                    isPositiveInt: function (values, value) {
                                                        return RegExp(/^([0-9]|[a-zA-Z]|[._\-\s])+$/).test(value);
                                                    },
                                                }}
                                                validationError="This is not a valid value"
                                                required
                                            />
                                            <div className="my-20 pl-20">
                                                <Input
                                                    key='output_path'
                                                    formData={dynamicProps.outputPath}
                                                    elementType={dynamicProps.outputPath.types}
                                                    value={dynamicProps.outputPath.value}
                                                    changed={(event) => inputChangedHandler(event, 'OutputPath')}
                                                />
                                            </div>
                                        </Grid>
                                    </div>
                                    <div className='columnStyle divideProps'>
                                        <Grid style={childGrid} item container xs={12}>
                                            <div className="h3" style={{ width: '100%' }}><b>Text section</b></div>
                                            <LegendSection modelJSON={modelJSON} inputFields={inputFields} setInputFields={(p) => { setInputFields(p) }} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></LegendSection>
                                            <TitleSection modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></TitleSection>
                                            <XAxisSection modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></XAxisSection>
                                            <YAxisSection modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></YAxisSection>
                                            <TickSection modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></TickSection>
                                            <TextFieldFormsy
                                                className="mt-12 mx-0 inputStyle dpi"
                                                type="text"
                                                name='dpi'
                                                style={{ width: '18px' }}
                                                label="dpi"
                                                value={dynamicProps.dpi.value}
                                                onBlur={(event) => inputChangedHandler(event, 'dpi')}
                                                validations={{
                                                    isPositiveInt: function (values, value) {
                                                        return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                    }
                                                }}
                                                validationError="This is not a valid value"
                                                autoComplete="off"
                                                required
                                            />
                                            {description(modelJSON.properties.dpi.description)}

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
                        <ReactTooltip clickable={true} isCapture = {true} scrollHide = {true} className='toolTip' place='top' effect='solid' />
                    </div>
                }
            />

        );

    else return null;
}

export default CSonNet_plot;