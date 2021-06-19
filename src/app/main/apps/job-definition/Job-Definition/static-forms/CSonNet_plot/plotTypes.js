/* eslint-disable */
import {
    RadioGroupFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';

const PlotTypes = (props) => {

    return (
        <>
            <div className="h3" style={{ width: '100%' }}><b>Plot types</b></div>
            <>
                <RadioGroupFormsy
                    className="my-16 inputStyle-plot"
                    name="errorbar_plot"
                    label='errorbar_plot'
                    value={props.dynamicProps.errorbar_plot.value}
                    onChange={(event) => props.inputChangedHandler(event, 'errorbar_plot')}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.plot_types.properties.errorbar_plot.oneOf[1].properties.exists.description)}
                {props.dynamicProps.errorbar_plot.value === 'true' && <div className='mt-0 inputStyle-plot descPlot'>
                    <TextFieldFormsy
                        className="mb-12 inputStyle-plot"
                        type="text"
                        name='errorbar_capsize'
                        style={{ width: '18px' }}
                        label="errorbar_capsize"
                        value={props.dynamicProps.errorbar_capsize.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'errorbar_capsize')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                     {props.description(props.modelJSON.properties.plot_types.properties.errorbar_plot.oneOf[1].properties.capsize.description)}


                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='capwidth'
                        style={{ width: '18px' }}
                        label="capwidth"
                        value={props.dynamicProps.capwidth.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'capwidth')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                   {props.description(props.modelJSON.properties.plot_types.properties.errorbar_plot.oneOf[1].properties.capwidth.description)}
                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='show_error_every'
                        style={{ width: '18px' }}
                        label="show_error_every"
                        value={props.dynamicProps.show_error_every.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'show_error_every')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                 {props.description(props.modelJSON.properties.plot_types.properties.errorbar_plot.oneOf[1].properties.show_error_every.description)}
                </div>}
                <RadioGroupFormsy
                    className="my-16 inputStyle-plot"
                    name="line_plot"
                    label='line_plot'
                    onChange={(event) => props.inputChangedHandler(event, 'line_plot')}
                    value={props.dynamicProps.line_plot.value}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.plot_types.properties.line_plot.description)}
                <RadioGroupFormsy
                    className="my-16 inputStyle-plot"
                    name="scatter_plot"
                    label='scatter_plot'
                    value={props.dynamicProps.scatter_plot.value}
                    onChange={(event) => props.inputChangedHandler(event, 'scatter_plot')}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.plot_types.properties.scatter_plot.description)}
                <RadioGroupFormsy
                    className="mt-16 inputStyle-plot"
                    name="bar_plot"
                    label='bar_plot'
                    value={props.dynamicProps.bar_plot.value}
                    onChange={(event) => props.inputChangedHandler(event, 'bar_plot')}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.plot_types.properties.bar_plot.oneOf[1].properties.exists.description)}
                {props.dynamicProps.bar_plot.value === 'true' && <div className='inputStyle-plot descPlot'>
                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='bar_width'
                        style={{ width: '18px' }}
                        label="bar_width"
                        value={props.dynamicProps.bar_width.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'bar_width')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/).test(value)
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                {props.description(props.modelJSON.properties.plot_types.properties.bar_plot.oneOf[1].properties.bar_width.description)}

                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='bar_annotation_fontsize'
                        style={{ width: '18px' }}
                        label="bar_annotation_fontsize"
                        value={props.dynamicProps.bar_annotation_fontsize.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'bar_annotation_fontsize')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                    {props.description(props.modelJSON.properties.plot_types.properties.bar_plot.oneOf[1].properties.bar_annotation_fontsize.description)}
                </div>}
            </>
        </>

    );
}

export default PlotTypes;