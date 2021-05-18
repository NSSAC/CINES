import React, { Fragment } from "react";
import {
  TextFieldFormsy,
  SelectFormsy
} from '@fuse/components/formsy';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import { Fab, Icon, Tooltip } from "@material-ui/core";

const triple = {
  borderRadius: '20px',
    width: '75%',
    border: '1px solid black',
    marginLeft: '26px',
    marginTop: '20px'
}

const Legend_triple = (props) => {

  const handleAddFields = () => {
    const values = [...props.inputFields];
    values.push({ legend_name: '', data_color: '', alpha_values: 1 });
    props.setInputFields(values);
  };

  const handleRemoveFields = index => {
    const values = [...props.inputFields];
    values.splice(index, 1);
    props.setInputFields(values);
  };

  const handleInputChange = (prop, index, event) => {
    const values = [...props.inputFields];
    if (prop === "legend_name") {
      values[index].legend_name = event.target.value;
    } else if (prop === "data_color") {
      values[index].data_color = event.target.value;
    } else{
      values[index].alpha_values = event.target.value;
    }
     

    props.setInputFields(values);
  };


  return (
    <>
     <div className='flex' style={{width:'100%'}}>
     <div style={triple}>
        {props.inputFields.map((inputField, index) => (
          <Fragment key={`${inputField}~${index}`}>
            <div className="flex">
            <TextFieldFormsy
              className="my-12 mt-16 col-sm-6 inputStyle-plot"
              type="text"
              name='legend_name'
              style={{ width: '18px' }}
              label="legend_name"
              value={inputField.legend_name}
              onBlur={event => handleInputChange("legend_name", index, event)}
              // onChange={(event) => props.inputChangedHandler(event, 'legend_fontsize')}
              validations={{
                isPositiveInt: function (values, value) {
                  return RegExp(/^[^-\s]/).test(value) || value === '';
                }
              }}
              validationError="This is not a valid value"
              autoComplete="off"
              // required
            />
             { props.description(props.modelJSON.properties.text_sections.properties.legend_section.properties.legend_items.items.properties.legend_name.description)}
             { <button
                className="btn btn-link mt-48"
                type="button"
                style={{marginLeft:'20px'}}
                title='delete legend item'
                onClick={() => handleRemoveFields(index)}
              >
                <DeleteIcon />
                </button>}
            </div>
            <div className="flex legendWrap pr-12" style={{borderBottom:`${index !== props.inputFields.length -1 ? '1px dashed black': ''}`}}>
              <SelectFormsy
              className="mb-12 mt-16 col-sm-6 inputStyle-plot"
              name="data_color"
              label={["data_color", <span key={1} style={{color: 'red'}}>{'*'}</span>]}
              value=''
              onChange={event => handleInputChange("data_color", index, event)}
              required
            >
              {props.modelJSON.properties.text_sections.properties.legend_section.properties.legend_items.items.properties.data_color.enum.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </SelectFormsy>
            {props.description(props.modelJSON.properties.text_sections.properties.legend_section.properties.legend_items.items.properties.data_color.description)}
            <TextFieldFormsy
              className="my-12 mt-16 col-sm-6 inputStyle-plot"
              type="text"
                        name='alpha_values'
                        style={{ width: '18px' }}
                        label="alpha_values"
                        value={inputField.alpha_values}
                        onBlur={event => handleInputChange("alpha_values", index, event)}
                        validations={{
                            isPositiveInt: function (values, value) {
                              return RegExp(/^(0+\.?|0*\.\d+|0*1(\.0*)?)$/).test(value)                             }
                        }}
                        validationError="This is not a valid value"
                        autoComplete="off"
                    required
                    />
                   { props.description(props.modelJSON.properties.text_sections.properties.legend_section.properties.legend_items.items.properties.alpha_value.description)}
            </div>
          </Fragment>
        ))}
      </div>
      <Tooltip title="Click to add another legend item" aria-label="add">
                  <Fab
                    color="secondary"
                    aria-label="add"
                    size="small"
                    className="ml-20 mb-12"
                    style={{alignSelf:'flex-end',marginLeft:'20px'}}
                  >
                    <Icon
                      className="flex flex-col"
                      onClick={handleAddFields}
                    >
                      add
                    </Icon>
                  </Fab>
                </Tooltip>
      </div>
      <br />
    </>
  );
};

export default Legend_triple;
