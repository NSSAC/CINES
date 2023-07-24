/* eslint-disable */
import {
    TextFieldFormsy
} from '@fuse/components/formsy';
import React from 'react';
import { Fab, Icon,Tooltip } from '@material-ui/core';
import Legend_triple from './legendTriple';

const LegendSection = (props) => {

    const handleAddFields = () => {
        const values = [...props.inputFields];
        values.push({ legend_name: '', data_color: '', alpha_values: 1 });
        props.setInputFields(values);
        window.restoreInputFields = values
        window.formEdited = true
      };

    return (
        <>
          <div className='flex content'>
            <div className="h4 mt-12 ml-16" style={{ width: '72%', fontWeight: '600'}}>Legend section</div>
            {props.inputFields.length === 0 && <Tooltip title="Click to add a legend item" aria-label="add">
                  <Fab
                    color="secondary"
                    aria-label="add"
                    size="small"
                    className="mb-12"
                    style={{alignSelf:'flex-end', marginLeft:'20px'}}
                  >
                    <Icon
                      className="flex flex-col"
                      onClick={handleAddFields}
                    >
                      add
                    </Icon>
                  </Fab>
                </Tooltip>}
          </div>
            <>
                    <TextFieldFormsy
                        className="mt-2 inputStyle-plot"
                        type="text"
                        name='legend_fontsize'
                        style={{ width: '18px' }}
                        label="legend_fontsize"
                        value={props.dynamicProps.legend_fontsize.value}
                        onBlur={(event) => props.inputChangedHandler(event, 'legend_fontsize')}
                        validations={{
                            isPositiveInt: function (values, value) {
                                return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && Number(value) > 1
                            }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                    {props.description(props.modelJSON.properties.text_sections.properties.legend_section.properties.legend_fontsize.description)}
                    {props.inputFields.length > 0 && <Legend_triple modelJSON={props.modelJSON} inputFields={props.inputFields} setInputFields={(p)=>{props.setInputFields(p)}} description={props.description}></Legend_triple>}
            </>
        </>

    );
}

export default LegendSection;