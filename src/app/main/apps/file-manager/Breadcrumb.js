import React from 'react';
import {Icon, Typography, Link} from '@material-ui/core';
import { withRouter } from 'react-router-dom';


function Breadcrumb({props,className, path})
{
   function onclickRoute(path) {
        var target = window.location.pathname.split(path)
        var targetPath= target[0] + path + "/"
         props.history.push(targetPath)

    }

    console.log("selected: ", )
    const arr = path.split('/');
    arr[0]="files"

    return (
        <Typography className={className}>
            {arr.map((path, i) => (   
                <span key={i}  className="flex items-center" > 
                     <span  onClick={() => onclickRoute(path)} className="cursor-pointer" >{path} </span>
                      {arr.length - 1 !== i && (
                        <Icon>chevron_right</Icon>
                    )}
                </span>))}
        </Typography>
    )
}

export default withRouter(Breadcrumb);
