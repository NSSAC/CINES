import { Icon } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { FusePageSimple } from '@fuse';
/* eslint-disable */
import { TextFieldFormsy } from '@fuse/components/formsy';

const SEIR1 = (props) => {

    const childGrid = {
        paddingLeft: '20px',
        alignSelf: 'center'
    };

    const data_source =
        <TextFieldFormsy
            className="dataSource"
            type="text"
            name="Data Source"
            label="Data Source"
            value="Fixed"
            autoComplete="off"
            required
            InputProps={{
                readOnly: true,
            }}
        />

    const description = (desc) =>
        <span style={{ marginTop: '38px' }} data-tip={desc}>
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
                        {/* {data_source} */}
                        <TextFieldFormsy
                            className="my-12 inputStyle1"
                            type="text"
                            name="Edge probability"
                            style={{ width: '18px' }}
                            value={String(props.dynamicProps.Edge_probability.value)}
                            onBlur={(event) => props.changed(event, "Edge_probability")}
                            label="Edge probability"
                            autoComplete="off"
                            validations={{
                                isPositiveInt: function (values, value) {
                                    return RegExp(/^(0+\.?|0*\.\d+|0*1(\.0*)?)$/).test(value) 
                                },
                            }}
                            validationError="This is not a valid value"
                            disabled={props.disabled}
                            required
                        />
                        {description(props.modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].rules[0].input.edge_probability_value.description)}
                    </Grid>
                    <Grid style={childGrid} item container xs={12} >
                        {/* {data_source} */}
                        <TextFieldFormsy
                            className="my-12 inputStyle1"
                            type="text"
                            name='Exposed_duration'
                            style={{ width: '18px' }}
                            value={String(props.dynamicProps.Exposed_duration.value)}
                            onBlur={(event) => props.changed(event, 'Exposed_duration')}
                            label="Exposed duration"
                            validations={{
                                isPositiveInt: function (values, value) {
                                    return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                }
                            }}
                            validationError="This is not a valid value"
                            autoComplete="off"
                            disabled={props.disabled}
                            required
                        />
                        {description(props.modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].rules[1].input.discrete_time_auto_value.description)}
                    </Grid>
                    <Grid style={childGrid} item container xs={12} >
                        {/* {data_source} */}
                        <TextFieldFormsy
                            className="my-12 inputStyle1"
                            type="text"
                            name="Infectious Duration"
                            style={{ width: '18px' }}
                            value={String(props.dynamicProps.Infectious_duration.value)}
                            onBlur={(event) => props.changed(event, "Infectious_duration")}
                            label="Infectious duration"
                            validations={{
                                isPositiveInt: function (values, value) {
                                    return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                }
                            }}
                            validationError="This is not a valid value"
                            autoComplete="off"
                            disabled={props.disabled}
                            required
                        />
                        {description(props.modelJSON.models.SEIR.submodels['fixed exposed fixed infectious'].rules[2].input.discrete_time_auto_value.description)}
                    </Grid>
                    <ReactTooltip clickable={true} isCapture = {true} scrollHide = {true} className='toolTip' place='top' effect='solid' />
                </div>
            }
        />

    );
}

export default SEIR1;