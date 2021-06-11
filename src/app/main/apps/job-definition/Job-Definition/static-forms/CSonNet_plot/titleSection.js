/* eslint-disable */
import {
    TextFieldFormsy
} from '@fuse/components/formsy';
import React from 'react';

const TitleSection = (props) => {

    return (
        <>
            <div className="h4 mt-24 ml-16" style={{ width: '100%', fontWeight: '600' }}>Title section</div>
            <>
                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='title_fontsize'
                        style={{ width: '18px' }}
                        label="title_fontsize"
                        value={props.dynamicProps.title_fontsize.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'title_fontsize')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && Number(value) > 1
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                    {props.description(props.modelJSON.properties.text_sections.properties.title_section.properties.title_fontsize.description)}
                    <TextFieldFormsy
                        className="my-12 inputStyle-plot"
                        type="text"
                        name='title_text'
                        style={{ width: '18px' }}
                        label="title_text"
                        value={props.dynamicProps.title_text.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'title_text')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^[^-\s]/).test(value) || value === '';
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    />
                    {props.description(props.modelJSON.properties.text_sections.properties.title_section.properties.title_text.description)}
           
            </>
        </>

    );
}

export default TitleSection;