import React from 'react';
import {Icon, Typography, Link} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Breadcrumb(props)
{
    const dispatch = useDispatch()
    const path = window.location.pathname

    const ellipsis={
        textOverflow:'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '170px',
        color:'#61dafb'
    }

    const breadcrumb_wrap={
        width: '100%',
        flexWrap: 'wrap'
    }
    
   function onclickRoute(path) {
        props.setSearch("")
        var target = props.targetPath.split(path)
        if(target.length == 1)
         props.setTargetPath("/")
        else
         props.setTargetPath(target[0] + path + "/")

    }

    const arr = props.targetPath.split('/');
    if(props.fileManager)
      arr[0]="files"
    else
      arr[0]="home"


    return  (
        <div className="flex text-16 pb-8 sm:text-16" style={breadcrumb_wrap} >
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
