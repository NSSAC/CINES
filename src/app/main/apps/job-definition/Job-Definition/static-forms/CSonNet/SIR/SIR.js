import { MenuItem } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';

import { FusePageSimple } from '@fuse';
/* eslint-disable */
import { SelectFormsy } from '@fuse/components/formsy';

// import Submodel_SID from './Submodel_SID';
import Submodel_FIP from './Submodel_FIP';

const SIR = (props) => {

    const childGrid = {
        paddingLeft: '20px',
        alignSelf: 'center'
    };

        // console.log(`SIR:`,props)
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
                                                    value={props.dynamicProps.SIR_Submodel.value}
                                                    onChange={(event) => props.changed(event, 'SIR_Submodel')}
                                                    disabled={props.disabled}
                                                    required

                                                >

                                                    <MenuItem key='Fixed infectious' value='fixed infectious'>Fixed infectious</MenuItem>
                                                    {/* <MenuItem key='Stochastic infectious' value='stochastic infectious'>Stochastic infectious</MenuItem> */}
                                                </SelectFormsy>
                                            </Grid>
                                            {props.dynamicProps.SIR_Submodel.value === 'stochastic infectious' && <Submodel_SID disabled={props.disabled} modelJSON={props.modelJSON} changed={props.changed}
                                                dynamicProps={props.dynamicProps}></Submodel_SID>}
                                                {props.dynamicProps.SIR_Submodel.value === 'fixed infectious' && <Submodel_FIP disabled={props.disabled} modelJSON={props.modelJSON} changed={props.changed}
                                                dynamicProps={props.dynamicProps}></Submodel_FIP>}


                    </div>
                }
            />

        );
}

export default SIR;