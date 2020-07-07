import React from 'react';
import {Icon, Typography, Link} from '@material-ui/core';
import { withRouter } from 'react-router-dom';


function Breadcrumb({width, props,className, path})
{

   function onclickRoute(path) {
        var target = window.location.pathname.split(path)
        var targetPath= target[0] + path + "/"
         props.history.push(targetPath)

    }

    const arr = path.split('/');
    arr[0]="files"

    if(width == true){
    return  (
        <Typography className={className} >
            {arr.map((path, i) => (   
                <span key={i}  className="flex items-center" > 
                     <span  onClick={() => onclickRoute(path)} className="cursor-pointer" >{path} </span>
                      {arr.length - 1 !== i && (
                        <Icon>chevron_right</Icon>
                    )}
                </span>))}
        </Typography>
    )}
    else{
        return(null)
    }
}


export default withRouter(Breadcrumb);
