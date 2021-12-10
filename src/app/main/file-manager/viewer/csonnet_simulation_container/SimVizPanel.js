import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {  Grid } from '@material-ui/core';
import clsx from 'clsx';
import filesize from 'filesize';
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import { VegaLite } from 'react-vega'

function SimVizPanel(props) {
    const dispatch = useDispatch();
    const files = useSelector(({ CSonnetSimulationContainerApp }) => CSonnetSimulationContainerApp.files);   
    const analysis_files = useSelector(({ CSonnetSimulationContainerApp }) => CSonnetSimulationContainerApp.analysis_files);   
    const states = props.meta.provenance.input.states
    var sorted = []

    React.useState(()=>{
        if (files && files.analysis && files.analysis.length>0){
            dispatch(Actions.getAnalysisFiles(files))
        }else{
            console.log("no analysis files: ", files)
        }
    },[dispatch,files, files.analysis])

    console.log("analysis_files: ", analysis_files)
    if (analysis_files) {
        states.forEach((state)=>{
            var newf=false,current=false,cumulative=false;

            analysis_files.some((f)=>{
                if (f.analysis_state===state){
                    if (f.analysis_type==="new") {newf = f }
                    if (f.analysis_type==="current") {current = f }
                    if (f.analysis_type==="cumulative") {cumulative = f }
                }
                return newf && current && cumulative
            })
            if (newf) sorted.push(newf)
            if (current) sorted.push(current)
            if (cumulative) sorted.push(cumulative)
        })
    }


    console.log("SimVizPanel Files: ", sorted)
    return (
        <Grid  container className="w-full h-full m-auto p-8">
            {/* <VegaLite className="w-full h-full" spec={spec} data={barData} /> */}

            {(sorted||[]).map((file,idx)=>{
                // if (idx>0) {return null}
                var headers = file.contents.meta.fields.filter((h)=>{return h!=="time"})
                if (headers.length < 1){
                    console.warn("Not enough header for graph, need at least one iteration")
                    return null
                }
                if (file.contents.meta.fields.indexOf("time")<0){
                    console.warn("Not enough header for graph, need at least one iteration")
                    return null
                }
                var headers = file.contents.meta.fields.filter((h)=>{return h!=="time"})
                const cspec = {
                    width: "container",
                    mark: 'line',
                    encoding: {
                        x: { 
                          field: 'time', type: 'ordinal', "title": "Time", legend: false,
                          "axis": {
                            "labels": true,
                            ticks: true,
                            labelAngle: 0,
                            labelOverlap: "parity"
                          }
                        },
                        y: { field: {repeat: "layer"}, type: 'quantitative', legend: false },
                        color: {datum: {repeat: "layer"}, legend: false}
                    },
                    data: {"name": "data"}, // note: vega-lite data attribute is a plain object instead of an array
                }
                // console.log("filecontents.meta.fi")

                const repeat = {"layer": headers}
                console.log(`${file.analysis_state} ${file.analysis_type}`)
                cspec.encoding.y.title = `${file.analysis_state} ${file.analysis_type}`
                const fullSpec = {
                    repeat: repeat,
                    spec: cspec,
                    config: {
                        "axis": {
                            "domainColor": "#ddd",
                            "tickColor": "#ddd",
                        }
                    }
                }
                // console.log("File: ",file, cspec)
                return ( 
                    <Grid item xs={12} lg={4} key={idx} className="pr-24">
                        <VegaLite className="w-full h-full" spec={fullSpec} data={{data: file.contents.data}}/>
                    </Grid> 
                )
            })}
        </Grid>    
    )
}
export default withReducer("CSonnetSimulationContainerApp", reducer)(SimVizPanel);
