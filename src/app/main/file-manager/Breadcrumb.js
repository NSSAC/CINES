import React from 'react';
import {Icon} from '@material-ui/core';
import { withRouter } from 'react-router-dom';


function Breadcrumb({props,className, styles, path})
{
    // const ellipsis={
    //     textOverflow:'ellipsis',
    //     whiteSpace: 'nowrap',
    //     overflow: 'hidden',
    //     maxWidth: '170px'
    // }
    
   function onclickRoute(i) {
       if(i !== arr.length-1){
        arr.splice(i+1-arr.length)
        var targetPath='/'
        for(i=0;i<arr.length;i++){
            targetPath = targetPath + arr[i] + '/'
        }
         props.history.push(targetPath)
       }

    }

    const arr = path.split('/');
    arr[0]="files"
    // arr.shift()
    if(arr[arr.length-1] === ""){
      arr.pop()
    }

    return  (
        <span className={className} >
            {arr.map((path, i) => (   
                <span key={i} className="items-center"> 
                     <span  onClick={() => onclickRoute(i)} className="align-top cursor-pointer overflow-ellipsis"  title={path} >{(i===0)?"File Manager":path} </span>
                      {arr.length - 1 !== i && (
                        <Icon className="text-16">
                            chevron_right
                      </Icon>
                    )}
                </span>))}
        </span>
    )

}


export default withRouter(Breadcrumb);
