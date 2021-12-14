import { Icon } from '@material-ui/core';
import React from 'react';
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

    function onClickRoute(evt) {
        var path = evt.target.title;
        var parts = path.split("/").filter((x)=>!!x)
        var fp = "/" + parts.slice(1).join("/")
        setTimeout(() => {
            props.setTargetPath(fp)
        }, 200);
    }


    var breadcrumb_Array = []
    if(props.targetPath.charAt(0) === '/')
      breadcrumb_Array = props.targetPath.split('/');
    else
      breadcrumb_Array = ('/' + props.targetPath).split('/');
        breadcrumb_Array[0] = "files"
    

    if (breadcrumb_Array[breadcrumb_Array.length - 1] === "") {
        breadcrumb_Array.pop()
    }

    return (
        <div className={`flex text-16 sm:text-16 ${props.className||''}`} style={breadcrumb_wrap} >
            {
                (()=>{
                    var fp =""
                    return breadcrumb_Array.map((path, i) => {
                        fp = `${fp}/${path}`;
                        return (<div key={i} className="flex items-center">
                            <div onClick={onClickRoute} href={fp} className="cursor-pointer" style={breadcrumb_Array.length - 1 !== i ? ellipsis : {color: '#61dafb'}} title={fp} >{path} </div>
                            {breadcrumb_Array.length - 1 !== i && (
                                <Icon>chevron_right</Icon>
                            )}
                        </div>)
                    })
                })()
            }
        </div>
    )

}


export default withRouter(Breadcrumb);
