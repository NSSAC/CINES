import { Icon, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, useHistory } from "react-router-dom";

import { FusePageSimple } from '@fuse';
import withReducer from 'app/store/withReducer';

import JobDefinitionForm from "./JobDefinitionForm"
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import * as Actions from './store/actions';
import reducer from './store/reducers';

function JobDefinitionView(props) {

    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const history = useHistory();
    const job_definition = useSelector(({ JobDefinitionApp }) => { return JobDefinitionApp.job_definition})

    useEffect(()=>{
        var id;
        // console.log(`Check Job_Definition: ${job_definition.id} ${job_definition.version} vs ${props.namespace}/${props.jobdef} ${props.version}`)
        if (job_definition && (job_definition.id===`${props.namespace}/${props.jobdef}`) && (job_definition.version===props.version)){
            return;
        }
        if (!props.namespace || !props.jobdef){
            return;
        }
        if (job_definition && job_definition.failed){
            dispatch(Actions.switchVersion("default"))

            return
        }

        if (job_definition && (job_definition.id!==`${props.namespace}/${props.jobdef}`)){
            dispatch(Actions.clearJobDefinition())
            return
        }

        if (!props.version || (props.version==="default")){
            id = `${props.namespace}/${props.jobdef}`;
        }else if (props.version){
            id =`${props.namespace}/${props.jobdef}@${props.version}`
        }
        dispatch(Actions.getJobDefinition(id))    
    
    }, [props.namespace,props.jobdef,props.version, job_definition, dispatch])

    if (job_definition && job_definition.failed){
        return  <div>Invalid Job Definition</div>
    }

    if (props.version==="default" && job_definition && (job_definition.version === job_definition.default_version)){
        return <Redirect to={`/apps/job-definition/${props.namespace}/${props.module}?version=${job_definition.version}`}/>
    }else if (job_definition && job_definition.switch_version){
        return <Redirect to={`/apps/job-definition/${props.namespace}/${props.module}?version=${job_definition.switch_version}`}/>
    }

    function navigateHome() {
        history.push('/home/')
    }

    function describeOutput(jd){
        var of = jd.output_files;
        var os = jd.output_schema || false;
        var hasFileOut=false;
        var out=[]
        if (of && of.type){
            hasFileOut=true;
            if (of.type==="folder"){
                out.push(<span key={4} className="ml-4">This task outputs files of type {of.contents && of.contents.map(a=> {return <React.Fragment><span className="text-orange-400">{a.type.toString()}</span>, </React.Fragment>})} to a chosen location.</span>)
            }else{
                if (typeof of.type === "object"){
                    if (of.type["$ref"]){
                        var parts = of.type["$ref"].split("/")
                        var t = parts[parts.length-1];
                        out.push(<React.Fragment key={3}><span>The type of output of this task is dependent on the '</span><span className="text-orange-400">{t}</span><span>' option provided as input.</span></React.Fragment>)
                    }
                }else{
                    out.push(<span key={4}>This task outputs a file of type <span className="text-orange-400" >{of.type}</span> to a chosen location.</span>)
                }
                
            }
            hasFileOut=true;
        } 
        if (os && os.properties){
            if (hasFileOut){
                out.push(<span key={1} className="ml-4">Some data will also be attached to the job itself. </span>)
            }else{
                out.push(<span key={2} className="ml-4">Output data will be attached directly to the job itself.</span>)
            }
        }

        return out
    }

    function getForm(){
        if (!job_definition){
            return <div>Loading Job Definition</div>
        }
        if (props.static_form){
            const InputForm = React.lazy(() => import(`./static-forms/${props.module}/`))
            return <InputForm resubmit={props.location.state} job_definition={job_definition} {...props} />
        }else{

            return <JobDefinitionForm state={job_definition} resubmit={props.location.state} {...props} />
        }
    }

    return (
        <FusePageSimple
            classes={{
                root: "bg-red",
                header: "min-h-128 overflow h-auto",
                sidebarHeader: "h-128 min-h-128",
                // content: "contentStyle",
                // sidebarHeader: "h-96 min-h-96 sidebarHeader1",
                // sidebarContent: "sidebarWrapper",
                rightSidebar: "w-320",
                contentWrapper: "jobBody"
            }}
            header={
                <div className="flex flex-col flex-1 p-8 sm:p-12 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col" style={{ flexGrow: "1" }}>
                            <div className="flex items-center mb-16 ">
                                <Link to="/"><Icon className="text-18 cursor-pointer" color="action">home</Icon></Link>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography className="w-max" color="textSecondary">Input</Typography>
                                <Icon className="text-16" color="action">chevron_right</Icon>
                                <Typography className="w-max" color="textSecondary">{props.module}</Typography>
       
                            {job_definition && job_definition.id && (
                                <div className="w-max flex-1 text-right text-orange-400 text-sm">
                                    <span className="" title={`This job is defined the ${job_definition.namespace} namespace`}>{job_definition.namespace}</span>
                                    <span className="ml-2" title={`Container Version ${job_definition.version}`}>v{job_definition.version}</span>
                                </div>                                
                            )}
                            </div>

                            {/* <Typography variant="h6">Job Definition</Typography> */}
                        </div>
                    </div>
                    <div className="mt-4 ml-0">
                        <Typography className="ml-0 uppercase" variant="h5">{props.module.replace(/_/g," ")}</Typography>
                    </div>
                    <div className="mt-4 ml-0">
                        {job_definition && job_definition.description && (
                                <Typography color="textSecondary">{job_definition.description} {describeOutput(job_definition)}</Typography>
                        )}
                    </div>
                </div>
            }
            content={getForm()}
            
            leftSidebarVariant="temporary"

            leftSidebarHeader={
                <MainSidebarHeader />
            }
            leftSidebarContent={
                <MainSidebarContent />
            }
            
            ref={pageLayout}
            innerScroll
        />
    )
}

export default withReducer('JobDefinitionApp', reducer)(JobDefinitionView);
