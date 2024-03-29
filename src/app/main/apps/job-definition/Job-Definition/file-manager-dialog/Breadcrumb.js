import React from 'react';
import { Icon } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

function Breadcrumb(props) {
    const ellipsis = {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '170px',
        color: '#61dafb'
    }

    const breadcrumb_wrap = {
        width: "100%",
        flexWrap: "wrap",
        wordBreak: "break-all"
    }

    function onclickRoute(i) {
        props.setSearch("")
        if (i !== breadcrumb_Array.length - 1) {
            breadcrumb_Array.splice(i + 1 - breadcrumb_Array.length)
            var targetPath = '/'

            for (i = 1; i < breadcrumb_Array.length; i++) {
                targetPath = targetPath + breadcrumb_Array[i] + '/'
            }
            setTimeout(() => {
                props.setTargetPath(targetPath)
            }, 1000);
        }
    }

    const breadcrumb_Array = props.targetPath.split('/');
    if (props.fileManager)
        breadcrumb_Array[0] = "files"
    else
        breadcrumb_Array[0] = "home"

    if (breadcrumb_Array[breadcrumb_Array.length - 1] === "") {
        breadcrumb_Array.pop()
    }


    return (
        <div className="flex text-16 pb-8 sm:text-16" style={breadcrumb_wrap} >
            {breadcrumb_Array.map((path, i) => (
                <div key={i} className="flex items-center">
                    <div onClick={() => onclickRoute(i)} className="cursor-pointer" style={breadcrumb_Array.length - 1 !== i ? ellipsis : {color: '#61dafb'}} title={path} >{path} </div>
                    {breadcrumb_Array.length - 1 !== i && (
                        <Icon className="text-16">chevron_right</Icon>
                    )}
                </div>))}
        </div>
    )

}


export default withRouter(Breadcrumb);
