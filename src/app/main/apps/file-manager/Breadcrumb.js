import React from 'react';
import {Icon, Typography, Link} from '@material-ui/core';
import { withRouter } from 'react-router-dom';


function Breadcrumb({props,className, styles, path})
{
    const ellipsis={
        textOverflow:'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '170px'
    }
    
   function onclickRoute(path) {
        var target = window.location.pathname.split(path)
        var targetPath= target[0] + path + "/"
         props.history.push(targetPath)

    }

    const arr = path.split('/');
    arr[0]="files"

    return  (
        <div className={className} style={styles} >
            {arr.map((path, i) => (   
                <div key={i}  className="flex items-center"> 
                     <div  onClick={() => onclickRoute(path)} className="cursor-pointer" style={ellipsis} title={path} >{path} </div>
                      {arr.length - 1 !== i && (
                        <Icon>chevron_right</Icon>
                    )}
                </div>))}
        </div>
    )

}


export default withRouter(Breadcrumb);
