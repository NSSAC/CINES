import { Icon, Typography, LinearProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";

import { FusePageSimple } from '@fuse';
import withReducer from 'app/store/withReducer';

import JobDefinitionForm from "./JobDefinitionForm"
import MainSidebarContent from './MainSidebarContent';
import MainSidebarHeader from './MainSidebarHeader';
import * as Actions from './store/actions';
import reducer from './store/reducers'; 
import './JobDefinition.css'

import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles } from '@material-ui/core/styles';
import semver  from 'semver';
import "../../../CustomWebComponents/cwe-jsonRenderer";


function JobDefinitionView(props) {
    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
        nativeSelect: {
            color: '#FFA726',
            marginTop: '-3px',
        },

      }));

    const classes = useStyles();
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const history = useHistory();
    const job_definition = useSelector(({ JobDefinitionApp }) => { return JobDefinitionApp.job_definition })
    // const [version, setVersion] = useState();
    // const [versionArr, setVersionArr] = useState([]);
    const [restoreData, setRestoreData] = useState();
    // const [form_version, setForm_version] = useState();
    
    const handleChange = (event) => {
        localStorage.removeItem("jdTrigger")
        // setVersion(event.target.value);
        dispatch(Actions.clearJobDefinition());
        // dispatch(Actions.clearSelectedItem())
        const url = window.location.pathname + "?version=" + event.target.value
        let v;
        let form_version = false
        let  inputFileCheck;
        if(props.static_form && props.module !== "CSonNet_Plotting" ){
            const versionsx = {
                "<1.2.10": "v1",
                "<=2.1.0": "v2",
                ">2.1.0": "v3"
            }
            if(Object.keys(versionsx).some(function(avail_version){
                if(semver.satisfies(semver.coerce(event.target.value), avail_version)){
                    v = versionsx[avail_version]
                    return true
                }
                return false;
            })){
                form_version = v;
                // setForm_version(form_version)
            }
            if(window.restoreDynamicProps){
                inputFileCheck = window.restoreDynamicProps && window.restoreDynamicProps.input_file ? window.restoreDynamicProps.input_file[1].value  : 
                window.restoreDynamicProps && window.restoreDynamicProps.inputFile_Graph ? window.restoreDynamicProps.inputFile_Graph[1].value : 
                window.restoreDynamicProps && window.restoreDynamicProps.csonnet_simulation[1].value ? window.restoreDynamicProps.csonnet_simulation[1].value : false

                if(props.module === "CSonNet_Contagion_Simulation"){
                    if(form_version !== "v3"){
                        if(window.restoreDynamicProps && inputFileCheck){
                            extractRunTimeData_staticF(form_version, "CSonNet_Contagion_Simulation")
                        }
                    }else{
                        if(window.restoreDynamicProps && inputFileCheck){
                            extractRunTimeData_staticF(form_version, "CSonNet_Contagion_Simulation")
                        }
                    }
                }else if(props.module === "CSonNet_Generate_Blocking_Nodes"){
                    if(window.restoreDynamicProps && inputFileCheck){
                        extractRunTimeData_staticF(form_version, "CSonNet_Generate_Blocking_Nodes")
                    }
                }

            }

        }else if(props.module === "CSonNet_Plotting"){
            inputFileCheck = window.restoreDynamicProps && window.restoreDynamicProps.input_file ? window.restoreDynamicProps.input_file[1].value  :
                            window.restoreDynamicProps && window.restoreDynamicProps.inputFile_Graph ? window.restoreDynamicProps.inputFile_Graph[1].value : false
            if(inputFileCheck){
                extractRunTimeData_staticPlotF()
            }
        }else if(!props.static_form){
            extractRunTimeData_DynamicF()
        }


        history.replace(url)
      };

      function extractRunTimeData_staticPlotF(){
          let dynamicProps = window.restoreDynamicProps
          let inputFields = window.restoreInputFields

          if(inputFields && inputFields.length > 0){
            const tempTriples = {
                ...dynamicProps
            };
            const tempTriple = {
                ...dynamicProps.triples
            };
    
            var count = 0
    
            for (var i = 0; i < inputFields.length; i++) {
                if (inputFields[i].data_color !== '' && inputFields[i].alpha_values !== '') {
                    if (inputFields[i].legend_name !== "")
                        tempTriple.value[count] = { legend_name: inputFields[i].legend_name, data_color: inputFields[i].data_color, alpha_values: inputFields[i].alpha_values }
                    else
                        tempTriple.value[count] = { data_color: inputFields[i].data_color, alpha_values: inputFields[i].alpha_values }
                    count++;
                }
    
                tempTriples.triples = tempTriple
                dynamicProps = { ...tempTriples }
    
            }
          }
          
            const requestJson = {
                "csonnet_data_analysis": dynamicProps.inputFile_Graph[1].value,
                "plot_types": {
                    "errorbar_plot": {
                        "exists": dynamicProps.errorbar_plot.value === 'true' ? true : false,
                        "capwidth": parseInt(dynamicProps.capwidth.value),
                        "capsize": parseInt(dynamicProps.errorbar_capsize.value),
                        "show_error_every": parseInt(dynamicProps.show_error_every.value)
                    },
                    "line_plot": dynamicProps.line_plot.value === 'true' ? true : false,
                    "scatter_plot": dynamicProps.scatter_plot.value === 'true' ? true : false,
                    "bar_plot": {
                        "exists": dynamicProps.bar_plot.value === 'true' ? true : false,
                        "bar_width": parseFloat(dynamicProps.bar_width.value),
                        "bar_annotation_fontsize": parseInt(dynamicProps.bar_annotation_fontsize.value)
                    }
                },
                "show_points": dynamicProps.show_points.value === 'true' ? true : false,
                "line_width": parseInt(dynamicProps.line_width.value),
                "output_filetype": dynamicProps.output_filetype.value,
                "text_sections": {
                    "legend_section": {
                        "legend_fontsize": parseInt(dynamicProps.legend_fontsize.value),
                        "legend_items": dynamicProps.triples.value,
                    },
                    "title_section": {
                        "title_fontsize": parseInt(dynamicProps.title_fontsize.value),
                        "title_text": dynamicProps.title_text.value
                    },
                    "x_axis_section": {
                        "x_axis_fontsize": parseInt(dynamicProps.x_axis_fontsize.value),
                        "x_axis_text": dynamicProps.x_axis_text.value,
                        "x_scale": dynamicProps.x_scale.value,
                        "set_x_limits": (dynamicProps.set_x_limits.value === 'true' ? true : false),
                        ...(dynamicProps.set_x_limits.value === 'true' && { "x_limit_lower": parseFloat(dynamicProps.x_limit_lower.value), "x_limit_higher": parseFloat(dynamicProps.x_limit_higher.value) }),
                        "set_x_increment": (dynamicProps.set_x_increment.value === 'true' ? true : false),
                        ...(dynamicProps.set_x_increment.value === 'true' && { "x_increment": parseFloat(dynamicProps.x_increment.value) })
    
                    },
                    "y_axis_section": {
                        "y_axis_fontsize": parseInt(dynamicProps.y_axis_fontsize.value),
                        "y_axis_text": dynamicProps.y_axis_text.value,
                        "y_scale": dynamicProps.y_scale.value,
                        "set_y_limits": (dynamicProps.set_y_limits.value === 'true' ? true : false),
                        ...(dynamicProps.set_y_limits.value === 'true' && { "y_limit_lower": parseFloat(dynamicProps.y_limit_lower.value), "y_limit_higher": parseFloat(dynamicProps.y_limit_higher.value) }),
                        "set_y_increment": (dynamicProps.set_y_increment.value === 'true' ? true : false),
                        ...(dynamicProps.set_y_increment.value === 'true' && { "y_increment": parseFloat(dynamicProps.y_increment.value) })
                    },
                    "tick_section": {
                        "tick_fontsize": parseInt(dynamicProps.tick_fontsize.value),
                        "axes_in_scientific": dynamicProps.axes_in_scientfic.value,
                    }
                },
                "dpi": parseInt(dynamicProps.dpi.value)
            }
            const finalJSON = {
                input: requestJson,
                output_container: dynamicProps.outputPath[1].value,
                output_name: dynamicProps.Output_name.value
            };
            setRestoreData(finalJSON)
            window.restorePlotData = finalJSON
        
      }

      function extractRunTimeData_DynamicF() {
        let formElementsArray = window.restoreD_FEArray
        var input = {};
    
        var requestJson = {
          input: {},
          job_definition: `${props.namespace}/${props.jobdef}@${props.version}`,
          pragmas: {},
        };
        for (let key in formElementsArray) {
          if (
            formElementsArray[key].id >= 200 &&
            formElementsArray[key].formLabel === "output_container"
          ) {
            requestJson["output_container"] = formElementsArray[key].value;
          } else if (
            formElementsArray[key].id >= 200 &&
            formElementsArray[key].formLabel === "output_name"
          ) {
            requestJson["output_name"] = formElementsArray[key].value;
          }
    
          else {
            if (formElementsArray[key].type === "integer") {
              input[key] = formElementsArray[key].value ? parseInt(formElementsArray[key].value) : "";
            } else if (formElementsArray[key].type === "boolean") {
              if (formElementsArray[key].value === "true" || formElementsArray[key].value === true) {
                input[key] = true;
              }
              else {
                input[key] = false;
              }
              // updatedFormElement["value"] = Boolean(event.target.value);
            } else if (formElementsArray[key].type === "number") {
              input[key] = formElementsArray[key].value ? parseFloat(formElementsArray[key].value) : "";
            } else {
              input[key] = formElementsArray[key].value;
            }
          }
        }
        requestJson.input = input;
        setRestoreData(requestJson)
        window.restoreDynamicFData = requestJson
      };

      function extractRunTimeData_staticF(form_version,modType) {
        if(modType === "CSonNet_Contagion_Simulation"){
            let dynamicProps = window.restoreDynamicProps;
            let staticProps = window.restoreStatic;
            let submodelArray = window.restoreSubmodelArray;
            let inputFields = window.restoreInputFields;
            let statesArray = window.restoreStatesArray;
            let rules = window.restoreRules || [];
            let inputFileCheck = window.restoreDynamicProps.input_file ? window.restoreDynamicProps.input_file[1].value  : window.restoreDynamicProps.inputFile_Graph ? window.restoreDynamicProps.inputFile_Graph[1].value : ""
            let restoreOutputName =  window.restoreOutputName || ""
            let restoreOutputPath = window.restoreOutputPath || ""
            let submitJSON = {
                "dynamicProps": dynamicProps,
                "input_file": inputFileCheck,
                "states_that_affect_neighbors": [],
                "iterations": staticProps && staticProps.Iterations.value ? parseInt(staticProps.Iterations.value) : "",
                "time_steps": staticProps && staticProps.TimeSteps.value ? parseInt(staticProps.TimeSteps.value) : "",
                'initial_states_method': staticProps ? staticProps.InitialConditions : "",
                "default_state": staticProps ? staticProps.default_state.value : "",
                "states": statesArray,
                "random_number_seed": staticProps && staticProps.Seed.value !== "" ? parseInt(staticProps.Seed.value) : "",
                'decorations': [],
                "dynamic_inputs": {"Behaviour_model": dynamicProps.Behaviour.value},
                "rules": rules ? rules : [],
            };
            if(form_version === "v3"){
                submitJSON["submodelArrayData"] = submodelArray
            }

            let checkInputFields = inputFields && inputFields.length > 0  ? true : false;
            let checkInitial_states_method = submitJSON['initial_states_method'] && submitJSON['initial_states_method'][0] ? true : false;

            if(checkInputFields && checkInitial_states_method && submitJSON['initial_states_method'][0]['type'] === 'custom'){
                let changedInputFields = inputFields.map((ele) =>{
                    if(ele.min === ""){
                        delete ele.min
                    }
                    if(ele.max === ""){
                        delete ele.max
                    }
                    if(ele.weight === ""){
                        delete ele.weight
                    }
                return ele
                })
                if(checkInitial_states_method){
                    submitJSON['initial_states_method'][0]['node_selection_criteria'] = changedInputFields
                }
            }else if(checkInputFields && checkInitial_states_method && submitJSON['initial_states_method'][0].hasOwnProperty('node_selection_criteria') ){
                delete submitJSON['initial_states_method'][0]['node_selection_criteria'] 
                delete submitJSON['initial_states_method'][0]['node_selection_method']
            }
            if (dynamicProps.blocking_nodes && dynamicProps.blocking_nodes[1].value){
                submitJSON.blocking_nodes = dynamicProps.blocking_nodes[1].value
                submitJSON.blocking_states = dynamicProps.blocking_state.value
            }

            let newRules;
            if(rules.length > 0){
                newRules = [...rules]
                newRules.forEach(x=>{
                    Object.keys(dynamicProps).forEach(y=>{
                        if(x.hasOwnProperty(dynamicProps[y].id) && x.input.includes(y)){
                            x[dynamicProps[y].id] = parseFloat(dynamicProps[y].value) 
                        }
                    })
                });
            }else{
                newRules = rules
            }

            submitJSON.rules = newRules;
            let createdJSON = {
                "input" : submitJSON,
                "output_container":  restoreOutputPath,
                "output_name": restoreOutputName
            }
            setRestoreData(createdJSON)
        }else if(modType === "CSonNet_Generate_Blocking_Nodes"){
            let dynamicProps = window.restoreDynamicProps;
            const random_seed = (dynamicProps.random_seed.value === "0")?(Math.floor(Math.random() * 1000)):parseInt(dynamicProps.random_seed.value)
            let submitJSON = {
                "csonnet_simulation": dynamicProps.csonnet_simulation[1].value,
                "blocking_class": dynamicProps.blocking_class.value,
                "blocking_method": dynamicProps.blocking_method.value,
                "random_seed": random_seed,
                "blocking_node_state": dynamicProps.blocking_node_state.value,
                "inactive_state": dynamicProps.inactive_state.value,
                "number_blocking_nodes": parseInt(dynamicProps.number_blocking_nodes.value),
                "blocking_type": "node"
            }
            var requestJson = {
                input: submitJSON,
                pragmas: {},
                output_container: dynamicProps.output_path[1].value,
                output_name: dynamicProps.output_name.value
            };
            window.restoreDynamicForm = requestJson
        }
    }


    function renderTask(a){
    if (a.type ) {

        if (a.type["$ref"]) {
            var parts = a.type["$ref"].split("/")
            var t = parts[parts.length - 1]
            return(<span>{t}</span>) 
        }else{
            return(<span>{a.type.toString()}</span>)
        }
    }else if(a.types){
        return(<span>{a.types.toString()}</span>)
    }
    }

    useEffect(() => {
        if(job_definition && job_definition.versions && (!localStorage.getItem("verDrop") || JSON.parse(localStorage.getItem("verDrop")).id !== job_definition.id) ){

            if(localStorage.getItem("selectedJdId") === job_definition.id){
                const verDroDetail = {
                    "array": job_definition.versions.reverse(),
                    "currentSelected": job_definition.version,
                    "id": job_definition.id
                }
                // setVersion(job_definition.version)
                localStorage.setItem("verDrop",JSON.stringify(verDroDetail))
            }
        }else{
            if(localStorage.getItem("verDrop")){
                setTimeout(()=> {
                    // const verDroDetail = JSON.parse(localStorage.getItem("verDrop"))
                    // setVersionArr(verDroDetail.array)
                },50)
                if(job_definition && job_definition.version){
                    // setVersion(job_definition.version)
                }
            }
        }
    },[job_definition])

      useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type === 1) {
            localStorage.removeItem("jdTrigger")
            }
          }
           // eslint-disable-next-line
      },[window.performance.navigation])


    useEffect(() => {
        var id;
        // console.log(`Check Job_Definition: ${job_definition.id} ${job_definition.version} vs ${props.namespace}/${props.jobdef} ${props.version}`)
        if (job_definition && (job_definition.id === `${props.namespace}/${props.jobdef}`) && (job_definition.version === props.version)) {
            return;
        }
        if (!props.namespace || !props.jobdef) {
            return;
        }
        if (job_definition && job_definition.failed) {
            dispatch(Actions.switchVersion("default"))

            return
        }

        if (job_definition && (job_definition.id !== `${props.namespace}/${props.jobdef}`)) {
            dispatch(Actions.clearJobDefinition())
            return
        }
        let jdTrigger = localStorage.getItem("jdTrigger")
        if(!jdTrigger){
            if (!props.version || (props.version === "default")) {
                id = `${props.namespace}/${props.jobdef}`;
                localStorage.setItem("jdTrigger", "true")
                dispatch(Actions.getJobDefinition(id))
            } else if (props.version ) {
                id = `${props.namespace}/${props.jobdef}@${props.version}`
                dispatch(Actions.getJobDefinition(id))
            }
        }

    }, [props.namespace, props.jobdef, props.version, job_definition, dispatch])

    if (job_definition && job_definition.failed) {
        return <div>Invalid Job Definition</div>
    }

    if (props.version === "default" && job_definition && (job_definition.version === job_definition.default_version)) {
        history.replace(`/apps/job-definition/${props.namespace}/${props.module}?version=${job_definition.version}`)
    } else if (job_definition && job_definition.switch_version) {
        history.replace(`/apps/job-definition/${props.namespace}/${props.module}?version=${job_definition.switch_version}`)
    }

    function describeOutput(jd) {
        var of = jd.output_files;
        var os = jd.output_schema || false;
        var hasFileOut = false;
        var out = []
        if (of && of.type) {
            hasFileOut = true;
            if (of.type === "folder") {
                out.push(<span key={4} className="ml-4">This task outputs files of type {of.contents && of.contents.map(a => {
                    return <React.Fragment><span className="text-orange-400">
                        {renderTask(a)}
                    </span>, </React.Fragment>
                })} to a chosen location.</span>)
            } else {
                if (typeof of.type === "object") {
                    if (of.type["$ref"]) {
                        var parts = of.type["$ref"].split("/")
                        var t = parts[parts.length - 1];
                        out.push(<React.Fragment key={3}><span>The type of output of this task is dependent on the '</span><span className="text-orange-400">{t}</span><span>' option provided as input.</span></React.Fragment>)
                    }
                } else {
                    out.push(<span key={4}>This task outputs a file of type <span className="text-orange-400" >{of.type}</span> to a chosen location.</span>)
                }

            }
            hasFileOut = true;
        }
        if (os && os.properties) {
            if (hasFileOut) {
                out.push(<span key={1} className="ml-4">Some data will also be attached to the job itself. </span>)
            } else {
                out.push(<span key={2} className="ml-4">Output data will be attached directly to the job itself.</span>)
            }
        }

        return out
    }

    function getForm() {
        if (!job_definition) {
            // return <div>Loading Job Definition</div>
            return <div className="flex flex-1 flex-col items-center justify-center mt-40">
            <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
            <LinearProgress className="w-xs" color="secondary" />
          </div>
        }
        if (props.static_form) {
            let InputForm;
            if(props.module.startsWith("plot")) {
                InputForm = React.lazy(() => import(`./static-forms/Plot_Jobs`))
            } else {
                InputForm = React.lazy(() => import(`./static-forms/${props.module}/`))
            }   
            let resubmitFormDetail;
            if(props.module === "CSonNet_Plotting"){
                if(!window.formEdited && localStorage.getItem("resubmitJob")){
                    resubmitFormDetail = JSON.parse(localStorage.getItem("resubmitJob"))
                }else if( window.restorePlotData){
                    resubmitFormDetail = window.restorePlotData
                }
            }else if(props.module === "CSonNet_Contagion_Simulation"){
                if(!window.formEdited && localStorage.getItem("resubmitJob")){
                    resubmitFormDetail = JSON.parse(localStorage.getItem("resubmitJob"))
                }else if( window.formEdited && restoreData){
                    resubmitFormDetail = restoreData
                }
            }else if(props.module === "CSonNet_Generate_Blocking_Nodes"){
                if(!window.formEdited && localStorage.getItem("resubmitJob")){
                    resubmitFormDetail = JSON.parse(localStorage.getItem("resubmitJob"))
                }else if(window.restoreDynamicForm){
                    resubmitFormDetail = window.restoreDynamicForm
                }
            }
                return <InputForm resubmit={props.location.state} job_definition={job_definition} localResubmit={resubmitFormDetail}  {...props} /> //trigger={trigger}
        } else {
            let resubmitFormDetail;
            if(!window.formEdited && localStorage.getItem("resubmitJob")){
                resubmitFormDetail = JSON.parse(localStorage.getItem("resubmitJob"))
            }else if( window.restoreDynamicFData ){
                resubmitFormDetail = window.restoreDynamicFData
            }
            
            if(job_definition.id === 'exceads_dev/moviemaker'){
                return <cwe-jsonrenderer job_data={JSON.stringify(job_definition.input_schema)}></cwe-jsonrenderer>
            }else{
                return <JobDefinitionForm state={job_definition} resubmit={props.location.state} localResubmit={resubmitFormDetail} {...props} />
            }
        }
    }


    return (
        <FusePageSimple
            classes={{
                root: "bg-red",
                header: "min-h-128 overflow h-auto jobDefHeader",
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
                                        <span className="ml-2" title={`Container Version ${job_definition.version}`}>
                                            <span style={{paddingRight: "6px"}}> v</span>
                                           
                                            {<FormControl>
                                                <NativeSelect
                                                      value={job_definition.version}
                                                      onChange={handleChange}
                                                      name="version"
                                                      className={`${classes.nativeSelect} MuiNativeSelect-nativeInput`}
                                                      inputProps={{ 'aria-label': 'version' }}
                                                    >
                                                      { job_definition.versions.map((x, index) => {
                                                            return <option className={"text-center"} key={index} value={x}>{x}</option>
                                                        })}
                                                </NativeSelect>
                                            </FormControl>}
                                            </span>
                                    </div>
                                )}
                            </div>

                            {/* <Typography variant="h6">Job Definition</Typography> */}
                        </div>
                    </div>
                    <div className="ml-0">
                        <Typography className="ml-0" variant="h5">{props.module.replace(/_/g, " ")}</Typography>
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
