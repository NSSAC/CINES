/* eslint-disable */
import {
    TextFieldFormsy
} from '@fuse/components/formsy';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import { Icon } from '@material-ui/core';
import { modelJSON } from '../../Schemas/CSonNet_modelDefinition';
import ReactTooltip from 'react-tooltip';


const SEIR3 = (props) => {
   
    const childGrid = {
        paddingLeft: '20px',
        alignSelf: 'center'
    };

    const description = (desc) => 
    <span style={{ marginTop: '38px' }}  data-tip={desc}>
        <Icon fontSize="small">info</Icon>
    </span>

        return (
            <FusePageSimple
                classes={{
                    root: 'root',
                    header: 'headerDisplay'
                }}

                content={
                    <div>
                               <Grid style={childGrid} item container xs={12} >
                                                <TextFieldFormsy
                                                    className="my-12 inputStyle1"
                                                    type="text"
                                                    name="weight_probability_column_name"
                                                    style={{ width: '18px' }}
                                                    value={props.dynamicProps.weight_probability_column_name.value}
                                                    onBlur={(event) => props.changed(event, "weight_probability_column_name")}
                                                    label="Weight Column Name"
                                                    autoComplete="off"
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^[^-\s]/).test(value);
                                                        },
                                                    }}
                                                    validationError="This is not a valid value"
                                                    required
                                                />
                                                {description(modelJSON.models.SEIR.submodels['stochastic exposed fixed infectious'].rules[0].input.weight_probability_column_name.description)}
                                            </Grid>
                                            <Grid style={childGrid} item container xs={12} >
                                                <TextFieldFormsy
                                                    className="my-12 inputStyle1"
                                                    type="text"
                                                    name="Exposed probability transition"
                                                    style={{ width: '18px' }}
                                                    value={props.dynamicProps.Exposed_probability_transition.value}
                                                    onBlur={(event) => props.changed(event, "Exposed_probability_transition")}
                                                    label="Exposed Probability Transition"
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(0+\.?|0*\.\d+|0*1(\.0*)?)$/).test(value) 
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                {description(modelJSON.models.SEIR.submodels['stochastic exposed fixed infectious'].rules[1].input.probability.description)}
                                            </Grid>
                                            <Grid style={childGrid} item container xs={12} >
                                                <TextFieldFormsy
                                                    className="my-12 inputStyle1"
                                                    type="text"
                                                    name="Infectious duration"
                                                    style={{ width: '18px' }}
                                                    value={props.dynamicProps.Infectious_duration.value}
                                                    onBlur={(event) => props.changed(event, "Infectious_duration")}
                                                    label="Infectious Duration"
                                                    validations={{
                                                        isPositiveInt: function (values, value) {
                                                            return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                                        }
                                                    }}
                                                    validationError="This is not a valid value"
                                                    autoComplete="off"
                                                    required
                                                />
                                                 {description(modelJSON.models.SEIR.submodels['stochastic exposed fixed infectious'].rules[2].input.time_duration.description)}
                                            </Grid>
                                            <ReactTooltip clickable={true} className='toolTip' place='top' effect='solid' />
                    </div>
                }
            />

        );
}

export default SEIR3;