/* eslint-disable */
import {
    SelectFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';

const TickSection = (props) => {

    return (
        <>
            <div className="h4 mt-24 ml-16" style={{ width: '100%', fontWeight: '600' }}>Tick section</div>
            <>
                    <TextFieldFormsy
                        className="mb-12 inputStyle-plot"
                        type="text"
                        name='tick_fontsize'
                        style={{ width: '18px' }}
                        label="tick_fontsize"
                        value='35'
                        onBlur={(event) => props.inputChangedHandler(event, 'tick_fontsize')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && Number(value) > 1
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                    {props.description(props.modelJSON.properties.text_sections.properties.tick_section.properties.tick_fontsize.description)}
                    <SelectFormsy
                    className="my-12 inputStyle-plot"
                    name="axes_in_scientfic"
                    label={["axes_in_scientfic", <span key={1} style={{color: 'red'}}>{'*'}</span>]}
                    value=''
                    onChange={(event) => props.inputChangedHandler(event, 'axes_in_scientfic')}
                    required
                >
                    {props.modelJSON.properties.text_sections.properties.tick_section.properties.axes_in_scientfic.enum.map((item) => {
                        return (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        );
                    })}
                </SelectFormsy>
                {props.description(props.modelJSON.properties.text_sections.properties.tick_section.properties.axes_in_scientfic.description)}
                
            </>
        </>

    );
}

export default TickSection;