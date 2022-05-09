import React from "react";

import { SelectFormsy, TextFieldFormsy } from '@fuse';
import { Button, MenuItem, Grid } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const triple = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: '20px',
    width: '85%',
    border: '1px solid black',
    marginTop: '10px'
}

const LegendRow = (props) => {
    
    const handleRemoveFields = (index) => {
        const values = [...props.inputFields];
        values.splice(index, 1);
        props.setInputFields(values);
    }

    const handleInputChange = (prop, index, event) => {
        const values = [...props.inputFields];
        if (prop === "property") {
            values[index].property = event.target.value;
        } else if (prop === "ordering") {
            values[index].ordering = event.target.value;
        }else if (prop === "min") {
            values[index].min = event.target.value;
        }else if (prop === "max") {
            values[index].max = event.target.value;
        }else{
            values[index].weight = event.target.value;
        }
        props.setInputFields(values);
      };

    //Validation for min, max, weight is - allow any number as well as empty

    return (
        <>
            {props.inputFields.map((inputField, index) => (
                <div style={triple}>
                    <Grid container xs={12} key={`${inputField}~${index}`}>
                        <Grid item xs={5} style={{paddingLeft: "2%"}}>
                            <SelectFormsy
                            className="my-12 inputStyle1 model"
                            name="property"
                            label={["Property"]}
                            value={inputField.property}
                            onChange={(event) => handleInputChange("property", index, event)}
                            required
                            >
                                <MenuItem key="Degree" value="Degree"> Degree </MenuItem>
                                <MenuItem key="In-Degree" value="In-Degree"> In-Degree </MenuItem>
                                <MenuItem key="Out-Degree" value="Out-Degree"> Out-Degree </MenuItem>
                                <MenuItem key="Betweenness Centrality" value="Betweenness Centrality"> Betweenness Centrality </MenuItem>
                                <MenuItem key="Authority Score" value="Authority Score"> Authority Score </MenuItem>
                                <MenuItem key="Hub Score" value="Hub Score"> Hub Score </MenuItem>
                                <MenuItem key="Clustering Coefficient" value="Clustering Coefficient"> Clustering Coefficient </MenuItem>
                                <MenuItem key="Eigenvalue Centrality" value="Eigenvalue Centrality"> Eigenvalue Centrality </MenuItem>
                                <MenuItem key="Page Rank" value="Page Rank"> Page Rank </MenuItem>
                                <MenuItem key="Closeness Centrality" value="Closeness Centrality"> Closeness Centrality </MenuItem>
                                <MenuItem key="kCore" value="kCore"> kCore </MenuItem>
                            </SelectFormsy>
                        </Grid>

                        <Grid item xs={5} style={{paddingLeft: "2%"}}>
                            <SelectFormsy
                            className="my-12 inputStyle1 model"
                            name="ordering"
                            label={["Ordering"]}
                            value={inputField.ordering}
                            onChange={(event) => handleInputChange("ordering", index, event)}
                            required
                            >
                                <MenuItem key="High" value="High"> High </MenuItem>
                                <MenuItem key="Low" value="Low"> Low </MenuItem>
                                <MenuItem key="Random" value="Random"> Random </MenuItem>
                            </SelectFormsy> 
                        </Grid>

                        <Grid item xs={1}>
                            <Button
                            className="btn btn-link"
                            type="button"
                            title='Delete state row'
                            onClick={() => handleRemoveFields(index)}>
                                <DeleteIcon />
                            </Button>
                        </Grid>
                        
                        <Grid item xs={4} style={{paddingLeft: "2%"}}>
                            <TextFieldFormsy
                                className="my-12 inputStyle3"
                                type="text"
                                name='min'
                                style={{ width: '18px' }}
                                value={inputField.min}
                                onBlur={(event) => handleInputChange('min', index, event)}
                                validations={{
                                    isPositiveInt: function (values, value) {
                                      return RegExp(/^(?:-?\d+)?$/).test(value)                             }
                                }}
                                validationError="This is not a valid value"
                                label="Min" 
                                autoComplete="off"/>
                        </Grid>

                        <Grid item xs={4} style={{paddingLeft: "2%"}}>
                            <TextFieldFormsy
                                className="my-12 inputStyle3"
                                type="text"
                                name='max'
                                style={{ width: '18px' }}
                                value={inputField.max}
                                onBlur={(event) => handleInputChange('max', index, event)}
                                validations={{
                                    isPositiveInt: function (values, value) {
                                      return RegExp(/^(?:-?\d+)?$/).test(value)                             }
                                }}
                                validationError="This is not a valid value"
                                label="Max" 
                                autoComplete="off"/>
                        </Grid>

                        <Grid item xs={4} style={{paddingLeft: "2%"}}>
                            <TextFieldFormsy
                                className="my-12 inputStyle3"
                                type="text"
                                name='weight'
                                style={{ width: '18px' }}
                                value={inputField.weight}
                                onBlur={(event) => handleInputChange('weight', index, event)}
                                validations={{
                                    isPositiveInt: function (values, value) {
                                      return RegExp(/^(?:-?\d+)?$/).test(value)                             }
                                }}
                                validationError="This is not a valid value"
                                label="Weight" 
                                autoComplete="off"/>
                        </Grid>
                    </Grid>
                </div>
            ))}
        </>
    );
}

export default LegendRow;