/* eslint-disable */
import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple} from '@fuse';
import { useHistory } from "react-router-dom";

function UpdatingFuseReactDoc()
{
    const history = useHistory();

    function navigateHome() {
        history.push('/home/')
    }

    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                        <Icon className="text-18 cursor-pointer" color="action" onClick={navigateHome}>home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary" >Contact</Typography>
                            {/* <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Working with Fuse React</Typography> */}
                        </div>
                        <Typography variant="h6">Contact Us</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">
                    <Typography className="mb-16" component="p">
                        For any questions or suggestions, please send an email to <a style={{"color": "rgb(21, 101, 192)"}} href="mailto:net.science@virginia.edu">net.science@virginia.edu</a>
                    </Typography>

                </div>
            }
        />
    );
}

export default UpdatingFuseReactDoc;
