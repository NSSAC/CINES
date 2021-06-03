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

const CSonNet_plot = (props) => {
    const [modelJSON, setModelJSON] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [success, setSuccess] = useState();
    const [isToasterFlag, setIsToasterFlag] = useState(false);
    const [existsFlag, setExistsFlag] = useState(false);
    const [inputFields, setInputFields] = useState([]);
    const [dynamicProps, setDynamicProps] = useState({
        errorbar_plot: { id: 101, value: '' },
        line_plot: { id: 102, value: '' },
        scatter_plot: { id: 103, value: '' },
        bar_plot: { id: 104, value: '' },
        errorbar_capsize: { id: 1011, value: 3 },
        capwidth: { id: 1012, value: 1 },
        show_error_every: { id: 1013, value: 1 },
        bar_width: { id: 1041, value: 0.25 },
        bar_annotation_fontsize: { id: 1042, value: 10 },
        show_points: { id: 201, value: "" },
        line_width: { id: 202, value: 4 },
        output_filetype: { id: 203, value: "" },
        legend_fontsize: { id: 301, value: 25 },
        triples: { id: 302, value: [] },
        add_legend_items: { id: 303, value: "" },
        title_fontsize: { id: 401, value: 15 },
        title_text: { id: 402, value: "" },
        x_axis_fontsize: { id: 501, value: 35 },
        x_axis_text: { id: 502, value: "" },
        x_scale: { id: 503, value: "" },
        set_x_limits: { id: 504, value: "" },
        x_limit_lower: { id: 505, value: "" },
        x_limit_higher: { id: 506, value: "" },
        set_x_increment: { id: 507, value: "" },
        x_increment: { id: 508, value: "" },
        y_axis_fontsize: { id: 601, value: 35 },
        y_axis_text: { id: 602, value: "" },
        y_scale: { id: 603, value: "" },
        set_y_limits: { id: 604, value: "" },
        y_limit_lower: { id: 605, value: "" },
        y_limit_higher: { id: 606, value: "" },
        set_y_increment: { id: 607, value: "" },
        y_increment: { id: 608, value: "" },
        tick_fontsize: { id: 701, value: 35 },
        axes_in_scientfic: { id: 702, value: "" },
        dpi: { id: 801, value: 600 },
        Output_name: { value: '' },
        outputPath: ['outputPath', {
            description: "Select the path from File manager where the output file is to be stored.",
            formLabel: "output_container",
            id: 200,
            outputFlag: true,
            types: ["folder", "epihiper_multicell_analysis", "epihiperOutput"],
            value: ""
        }]
    })
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
                    setModelJSON(res.data.input_schema)
                }
            },
            (error) => {

            }

        );
        // eslint-disable-next-line
    }, []);


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
                    ...(dynamicProps.set_y_limits.value === 'true' && { "x_limit_lower": parseFloat(dynamicProps.y_limit_lower.value), "x_limit_higher": parseFloat(dynamicProps.y_limit_higher.value) }),
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

        console.log(requestJson)
        // onFormSubmit(requestJson)
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
                                            <PlotTypes modelJSON={modelJSON} description={description} dynamicProps={dynamicProps} inputChangedHandler={inputChangedHandler}></PlotTypes>
                                            {existsFlag && <div className="h3 mt-12" style={{ width: '100%' }}><b>Plot properties</b></div>}
                                            {existsFlag && <div style={{ width: '100%' }} className='descPlot'>
                                                <RadioGroupFormsy
                                                    className="my-12 mt-16 inputStyle-plot"
                                                    name="show_points"
                                                    label='show_points'
                                                    value=''
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
                                                    value='4'
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
                                                    value=''
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
                                                value='600'
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
                                        disabled={!isFormValid}
                                    >
                                        Submit
							</Button>
                                    {props.resubmit ? <Link to="/apps/job-definition/" style={{ color: 'transparent' }}>
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
                        <ReactTooltip clickable={true} className='toolTip' place='top' effect='solid' />
                    </div>
                }
            />

        );

    else return null;
}

export default CSonNet_plot;