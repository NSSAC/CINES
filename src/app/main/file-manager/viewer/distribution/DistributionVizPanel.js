import React from 'react';
import { Typography,LinearProgress } from '@material-ui/core';
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import { VegaLite } from 'react-vega'

function guessDistributionLabel(jobname){
    var parts = jobname.split("/")
    var final = parts.pop()
    const [name, version] = final.split("@")
    switch(name){
        case "snap_GetDegCnt":
            return "Degree"
        case "snap_GetInDegCnt":
            return "In-Degree"
        case "snap_GetOutDegCnt":
            return "Out-Degree" 
        case "snap_GetKCoreEdges":
            return "KCore Edges"
        case "snap_GetKCoreNodes":
            return "KCore Nodes"
        case "snap_Get1CnComSzCnt":
            return "Connected Component Size"
        case "snap_GetBiConSzCnt":
            return "Biconnected Component Size"
        case "snap_GetSccSzCnt":
            return "Strongly Connected Component Size"
        case "snap_GetWccSzCnt":
            return "Weakly Connected Component Size"
        default:
            return ""
    }
}

function SimVizPanel(props) {
    const dispatch = useDispatch();
    const data = useSelector(({ DistributionViewerApp }) => DistributionViewerApp.data);
    const parsed_data = useSelector(({ DistributionViewerApp }) => DistributionViewerApp.parsed_data);

    React.useEffect(()=>{
        if (data){
            dispatch(Actions.parseData(data))
        }
    },[dispatch, data])

    var label=""
    if (props && props.meta && props.meta.provenance && props.meta.provenance.job_definition){
        label=guessDistributionLabel(props.meta.provenance.job_definition)
    }

    const cspec = {
        width: "container",
        mark: 'point',
        encoding: {
            x: { 
                field: 'category', type: 'nominal',title: label||false, legend: false,"axis": {"labelAngle": 0, labelOverlap: "parity"},
            },
            y: { field: "count", type: 'quantitative', title: "Count", legend: false },
            // color: {datum: {repeat: "layer"}, legend: false}
        },
        data: {"name": "data"}, // note: vega-lite data attribute is a plain object instead of an array
    }

    // const fullSpec = {
    //     spec: cspec,
    //     config: {
    //         "axis": {
    //             "domainColor": "#ddd",
    //             "tickColor": "#ddd",
    //         }
    //     }
    // }

    if (!parsed_data){
        return (<div className="flex flex-1 flex-col items-center justify-center mt-40">
            <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
            <LinearProgress className="w-xs" color="secondary" />
        </div>)
    }



    console.log("parsed_data: ", parsed_data)
    return ( 
        <div className="p-8 w-full h-full">
            <VegaLite className="w-full h-full" spec={cspec} data={{data: parsed_data.data}}/>
        </div>
    )

}
export default withReducer("CSonnetSimulationContainerApp", reducer)(SimVizPanel);
