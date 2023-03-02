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
            values[index].min =  parseInt(event.target.value) || "0";
        }else if (prop === "max") {
            values[index].max =  parseInt(event.target.value) || "";
        }else{
            values[index].weight =  parseInt(event.target.value) || "";
        }
        props.setInputFields(values);
      };

    //Validation for min, max, weight is - allow any number as well as empty

    return (
        <>
            {props.inputFields.map((inputField, index) => (
                <div style={triple}>
                    <Grid container xs={12} key={`${inputField}~${index}`}>
                        <Grid item xs={6} style={{paddingLeft: "2%"}}>
                            <SelectFormsy
                            className="my-12 inputStyle1 model"
                            name="property"
                            label={["Property"]}
                            value={inputField.property}
                            onChange={(event) => handleInputChange("property", index, event)}
                            required
                            req="true"
                            >
                                <MenuItem key="Degree" value="degree"> Degree </MenuItem>
                                <MenuItem key="In-Degree" value="in-degree"> In-Degree </MenuItem>
                                <MenuItem key="Out-Degree" value="out-degree"> Out-Degree </MenuItem>
                                <MenuItem key="Betweenness Centrality" value="betweenness-centrality"> Betweenness Centrality </MenuItem>
                                <MenuItem key="Authority Score" value="authority-score"> Authority Score </MenuItem>
                                <MenuItem key="Hub Score" value="hub-score"> Hub Score </MenuItem>
                                <MenuItem key="Clustering Coefficient" value="clustering-coefficient"> Clustering Coefficient </MenuItem>
                                <MenuItem key="Eigenvalue Centrality" value="eigenvalue-centrality"> Eigenvalue Centrality </MenuItem>
                                <MenuItem key="Page Rank" value="page-rank"> Page Rank </MenuItem>
                                <MenuItem key="Closeness Centrality" value="closeness-centrality"> Closeness Centrality </MenuItem>
                                <MenuItem key="kCore" value="kcore"> kCore </MenuItem>
                            </SelectFormsy>
                        </Grid>

                        <Grid item xs={4}>
                            <SelectFormsy
                            className="my-12 inputStyle1 model"
                            name="ordering"
                            label={["Ordering"]}
                            value={inputField.ordering}
                            onChange={(event) => handleInputChange("ordering", index, event)}
                            required
                            req="true"
                            >
                                <MenuItem key="increasing" value="increasing"> Increasing </MenuItem>
                                <MenuItem key="decreasing" value="decreasing"> Decreasing </MenuItem>
                                <MenuItem key="ignore" value="ignore"> Ignore </MenuItem>
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
                                value={inputField.min || '0'}
                                onBlur={(event) => handleInputChange('min', index, event)}
                                validations={{
                                    isPositiveInt: function (values, value) {
                                      return RegExp(/^-?(?:\d+\.?\d*)?$/).test(value)                             }
                                }}
                                validationError="This is not a valid value"
                                label="Min" 
                                required
                                autoComplete="off"/>
                        </Grid>

                        <Grid item xs={4} style={{paddingLeft: "2%"}}>
                            <TextFieldFormsy
                                className="my-12 inputStyle3"
                                type="number"
                                name='max'
                                style={{ width: '18px' }}
                                value={inputField.max}
                                onBlur={(event) => handleInputChange('max', index, event)}
                                // validations={{
                                //     isPositiveInt: function (values, value) {
                                //       return RegExp(/^-?(?:\d+\.?\d*)?$/).test(value)                             }
                                // }}
                                // validationError="This is not a valid value"
                                label="Max"
                                autoComplete="off"/>
                        </Grid>

                        <Grid item xs={4} style={{paddingLeft: "2%"}}>
                            <TextFieldFormsy
                                className="my-12 inputStyle3"
                                type="number"
                                name='weight'
                                style={{ width: '18px' }}
                                value={inputField.weight}
                                onBlur={(event) => handleInputChange('weight', index, event)}
                                // validations={{
                                //     isPositiveInt: function (values, value) {
                                //       return RegExp(/^-?(?:\d+\.?\d*)?$/).test(value)                             }
                                // }}
                                // validationError="This is not a valid value"
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