/* eslint-disable */
import {
    SelectFormsy,
    TextFieldFormsy
} from '@fuse/components/formsy';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import ReactTooltip from 'react-tooltip';
import { Icon } from '@material-ui/core';
import { modelJSON } from '../Schemas/CSonNet_modelDefinition';


const Deterministic_threshold = (props) => {

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
                <div className="flex content">
                    <Grid style={childGrid} item container xs={12} >
                        {data_source}
                        <TextFieldFormsy
                            className="dataSource"
                            type="text"
                            name='Threshold'
                            style={{ width: '18px' }}
                            value={props.dynamicProps.threshold.value}
                            onBlur={(event) => props.changed(event, 'threshold')}
                            label="Threshold Value"
                            validations={{
                                isPositiveInt: function (values, value) {
                                    return RegExp(/^(?:[+]?(?:[0-9]\d*))$/).test(value) && !RegExp(/^0+$/).test(value)
                                }
                            }}
                            validationError="This is not a valid value"
                            autoComplete="off"
                            required
                        />
                        {description(modelJSON.models.threshold_model.rules[0].input.threshold_value.description)}
                    </Grid>
                    <ReactTooltip clickable={true} className='toolTip' place='top' effect='solid' />
                </div>
            }
        />

    );
}

export default Deterministic_threshold;