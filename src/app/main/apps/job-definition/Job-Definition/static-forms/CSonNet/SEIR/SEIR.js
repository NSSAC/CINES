/* eslint-disable */
import {
    SelectFormsy,
} from '@fuse/components/formsy';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FusePageSimple } from '@fuse';
import { MenuItem } from '@material-ui/core';
import SEIR1 from './SEIR1';
import SEIR3 from './SEIR3';
import SEIR4 from './SEIR4';
import SEIR2 from './SEIR2';

const SEIR = (props) => {

    const childGrid = {
        paddingLeft: '20px',
        alignSelf: 'center'
    };

        return (
            <FusePageSimple
                classes={{
                    root: 'root',
                    header: 'headerDisplay'
                }}

                content={
                    <div>
                                  <Grid style={childGrid} item container xs={12} >
                                                <SelectFormsy
                                                    className="my-12 inputStyle1 model"
                                                    name="Submodel"
                                                    label= {["Submodel", <span key={1} style={{color: 'red'}}>{'*'}</span>]}
                                                    value={props.dynamicProps.SEIR_Submodel.value}
                                                    onChange={(event) => props.changed(event, 'SEIR_Submodel')}
                                                    required

                                                >

                                                    <MenuItem key='SEIR1' value='SEIR1'>Fixed exposed duration and fixed infectious duration</MenuItem>
                                                    <MenuItem key='SEIR2' value='SEIR2'>Fixed exposed duration and stochastic infectious duration</MenuItem>
                                                    <MenuItem key='SEIR3' value='SEIR3'>Stochastic exposed duration and fixed infectious duration</MenuItem>
                                                    <MenuItem key='SEIR4' value='SEIR4'>Stochastic exposed duration and stochastic infectious duration</MenuItem>
                                                </SelectFormsy>
                                            </Grid>
                                            {props.dynamicProps.SEIR_Submodel.value === 'SEIR1' && <SEIR1 changed={props.changed}
                                                dynamicProps={props.dynamicProps}></SEIR1>}
                                                {props.dynamicProps.SEIR_Submodel.value === 'SEIR2' && <SEIR2 changed={props.changed}
                                                dynamicProps={props.dynamicProps}></SEIR2>}
                                                {props.dynamicProps.SEIR_Submodel.value === 'SEIR3' && <SEIR3 changed={props.changed}
                                                dynamicProps={props.dynamicProps}></SEIR3>}
                                                {props.dynamicProps.SEIR_Submodel.value === 'SEIR4' && <SEIR4 changed={props.changed}
                                                dynamicProps={props.dynamicProps}></SEIR4>}


                    </div>
                }
            />

        );
}

export default SEIR;