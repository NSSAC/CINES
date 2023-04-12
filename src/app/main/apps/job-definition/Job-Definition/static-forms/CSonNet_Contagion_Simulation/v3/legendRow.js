import React from "react";

import { SelectFormsy, TextFieldFormsy } from '@fuse';
import { Button, MenuItem, Grid } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import '../CSonNet_CS.css'

const triple = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: '20px',
    width: '85%',
    border: '1px solid black',
    marginTop: '10px'
}
const undirected = [
    {label: "Degree", value: "degree"},
    {label: "Betweenness Centrality", value: "betweenness-centrality"},
    {label: "Authority Score", value: "authority-score"},
    {label: "Hub Score", value: "hub-score"},
    {label: "Clustering Coefficient", value: "clustering-coefficient"},
    {label: "Eigenvalue Centrality", value: "eigenvalue-centrality"},
    {label: "Page Rank", value: "page-rank"},
    {label: "Closeness Centrality", value: "closeness-centrality"},
    {label: "kCore", value: "kcore"}
]
const directed = [
    {label: "Degree", value: "degree"},
    {label: "In-Degree ", value: "in-degree"},
    {label: "Out-Degree", value: "out-degree"},
    {label: "Betweenness Centrality", value: "betweenness-centrality"},
    {label: "Authority Score", value: "authority-score"},
    {label: "Hub Score", value: "hub-score"},
    {label: "Clustering Coefficient", value: "clustering-coefficient"},
    {label: "Page Rank", value: "page-rank"},
    {label: "Closeness Centrality", value: "closeness-centrality"},
    {label: "kCore", value: "kcore"}]

const allProperties = [
    {label: "Degree", value: "degree"},
    {label: "In-Degree ", value: "in-degree"},
    {label: "Out-Degree", value: "out-degree"},
    {label: "Betweenness Centrality", value: "betweenness-centrality"},
    {label: "Authority Score", value: "authority-score"},
    {label: "Hub Score", value: "hub-score"},
    {label: "Clustering Coefficient", value: "clustering-coefficient"},
    {label: "Eigenvalue Centrality", value: "eigenvalue-centrality"},
    {label: "Page Rank", value: "page-rank"},
    {label: "Closeness Centrality", value: "closeness-centrality"},
    {label: "kCore", value: "kcore"}
]

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
            values[index].min =  parseInt(event.target.value) || "";
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
                                {props.edgeDirectionality == "undirected" ? 
                                undirected.map((ele) => {
                                    return <MenuItem key={ele.value} value={ele.value}> {ele.label} </MenuItem>
                                }) : props.edgeDirectionality == "directed" ?
                                directed.map((ele) => {
                                    return <MenuItem key={ele.value} value={ele.value}> {ele.label} </MenuItem>
                                }) : 
                                allProperties.map((ele) => {
                                    return <MenuItem key={ele.value} value={ele.value}> {ele.label} </MenuItem>
                                })
                            }
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
                                className="my-12 inputStyle3 hideArrow"
                                type="number"
                                name='min'
                                style={{ width: '18px'}}
                                // value={inputField.min || '0'}
                                value={inputField.min}

                                onBlur={(event) => handleInputChange('min', index, event)}
                                // validations={{
                                //     isPositiveInt: function (values, value) {
                                //       return RegExp(/^-?(?:\d+\.?\d*)?$/).test(value)                             }
                                // }}
                                // validationError="This is not a valid value"
                                label="Min" 
                                // required
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