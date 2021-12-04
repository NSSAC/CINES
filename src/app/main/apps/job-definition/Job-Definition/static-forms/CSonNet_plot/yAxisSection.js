/* eslint-disable */
import {
    RadioGroupFormsy,
    SelectFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import React from 'react';

const YAxisSection = (props) => {

    return (
        <>
            <div className="h4 mt-12 ml-16" style={{ width: '100%', fontWeight: '600' }}>Y-axis section</div>
            <>
                <TextFieldFormsy
                    className="my-12 inputStyle-plot"
                    type="text"
                    name='y_axis_fontsize'
                    style={{ width: '18px' }}
                    label="y_axis_fontsize"
                    value={props.dynamicProps.y_axis_fontsize.value}
                    onBlur={(event) => props.inputChangedHandler(event, 'y_axis_fontsize')}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && Number(value) > 1
                        }
                    }}
                    validationError="This is not a valid value"
                    autoComplete="off"
                    required
                />
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_axis_fontsize.description)}
                <TextFieldFormsy
                    className="my-12 inputStyle-plot"
                    type="text"
                    style={{ width: '18px' }}
                    name="y_axis_text"
                    label="y_axis_text"
                    value={props.dynamicProps.y_axis_text.value}
                    onBlur={(event) => props.inputChangedHandler(event, 'y_axis_text')}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^[^-\s]/).test(value) || value === '';
                        }
                    }}
                    validationError="This is not a valid value"
                    autoComplete="off"
                />
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_axis_text.description)}
                <SelectFormsy
                    className="inputStyle-plot"
                    name="y_scale"
                    style={{marginBottom:'12px'}}
                    label={["y_scale", <span key={1} style={{color: 'red'}}>{'*'}</span>]}
                    value={props.dynamicProps.y_scale.value}
                    onChange={(event) => props.inputChangedHandler(event, 'y_scale')}
                    required
                >
                    {props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_scale.enum.map((item) => {
                        return (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        );
                    })}
                </SelectFormsy>
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_scale.description)}
                <RadioGroupFormsy
                    className="mt-16 inputStyle-plot"
                    name="set_y_limits"
                    label='set_y_limits'
                    value={props.dynamicProps.set_y_limits.value}
                    onChange={(event) => props.inputChangedHandler(event, 'set_y_limits')}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.set_y_limits.description)}
                {props.dynamicProps.set_y_limits.value === 'true' && <>
                 <TextFieldFormsy
                    className="my-12 inputStyle-plot"
                    type="text"
                    name='y_limit_lower'
                    style={{ width: '18px' }}
                    value={props.dynamicProps.y_limit_lower.value}
                    label="y_limit_lower"
                    onBlur={(event) => props.inputChangedHandler(event, 'y_limit_lower')}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^[+-]?(?:\d*[.])?\d+$/).test(value) || RegExp(/^((\.\d+)?|1(\.0+)?)$/).test(value) || value === ""
                        }
                    }}
                    validationError="This is not a valid value"
                    autoComplete="off"
                    required
                />
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_limit_lower.description)}
                
                <TextFieldFormsy
                    className="inputStyle-plot mb-12"
                    type="text"
                    name='y_limit_higher'
                    style={{ width: '18px'}}
                    label="y_limit_higher"
                    value={props.dynamicProps.y_limit_higher.value}
                    onBlur={(event) => props.inputChangedHandler(event, 'y_limit_higher')}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^[+-]?(?:\d*[.])?\d+$/).test(value) || RegExp(/^((\.\d+)?|1(\.0+)?)$/).test(value) || value === ""
                        }
                    }}
                    validationError="This is not a valid value"
                    autoComplete="off"
                    required
                />
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_limit_higher.description)}
                </>}
                <RadioGroupFormsy
                    className="mt-16 inputStyle-plot"
                    name="set_y_increment"
                    label='set_y_increment'
                    value={props.dynamicProps.set_y_increment.value}
                    onChange={(event) => props.inputChangedHandler(event, 'set_y_increment')}
                    required
                >
                    <FormControlLabel value="true" control={<Radio color="primary" />} label="True" />
                    <FormControlLabel value="false" control={<Radio color="primary" />} label="False" />

                </RadioGroupFormsy>
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.set_y_increment.description)}
                {props.dynamicProps.set_y_increment.value === 'true' && <> 
                <TextFieldFormsy
                    className="my-12 inputStyle-plot"
                    type="text"
                    name='y_increment'
                    style={{ width: '18px' }}
                    label="y_increment"
                    value={props.dynamicProps.y_increment.value}
                    onBlur={(event) => props.inputChangedHandler(event, 'y_increment')}
                    validations={{
                        isPositiveInt: function (values, value) {
                            return RegExp(/^[+-]?(?:\d*[.])?\d+$/).test(value) || RegExp(/^((\.\d+)?|1(\.0+)?)$/).test(value) || value === ""
                        }
                    }}
                    validationError="This is not a valid value"
                    autoComplete="off"
                    required
                />
                {props.description(props.modelJSON.properties.text_sections.properties.y_axis_section.properties.y_increment.description)}
                </>}
            </>
        </>

    );
}

export default YAxisSection;