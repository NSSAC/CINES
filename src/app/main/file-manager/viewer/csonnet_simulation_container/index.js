import React, { useState } from 'react';
import {  Tab, Tabs } from '@material-ui/core';
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import SimulationOverviewPanel from "./SimulationOverviewPanel"
import SimVizPanel from "./SimVizPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
import OutputFilesPanel from "./OutputFilesPanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"
import {MAX_RAW_FILE_VIEW_SIZE} from "../../FileManagerAppConfig"

function CSonnetSimulationContainer(props) {
    const dispatch = useDispatch();
    const files = useSelector(({ CSonnetSimulationContainerApp }) => CSonnetSimulationContainerApp.files);
    const output_file = useSelector(({ CSonnetSimulationContainerApp }) => CSonnetSimulationContainerApp.output_file);

    const [selectedTab, setSelectedTab] = useState(0);
    const [maxFileSize] = useState(props.max_file_size || MAX_RAW_FILE_VIEW_SIZE)
    const [enableOutputFileView,setEnableOutputFileView] = useState(false)
    const [enableDynamicVisualization, setEnableDynamicVisualization] = useState(false)
    const [tabs,setTabs] = useState([])

    React.useEffect(() =>{
        dispatch(Actions.getFiles(props.meta.id))
    },[dispatch,props.meta])

    React.useEffect(()=>{
        if (files){
            if (files.output && ((files.output.state==="staged") || (files.output.state==="stored")) && (files.output.size<maxFileSize)  ){ 
                setEnableOutputFileView(true)
            }else{
                setEnableOutputFileView(false)
            }

            if (files.analysis && files.analysis.length>0){
                setEnableDynamicVisualization(true)
            }else{
                setEnableDynamicVisualization(false)
            }   
          
            if (enableOutputFileView){
                console.log("Get Simulation Output")
                dispatch(Actions.getSimulationOutput(files.output))
            }
        }
    },[dispatch,files,files.analysis,enableOutputFileView,maxFileSize])

    React.useEffect(()=>{
        var tabs=[]

        tabs.push({
            label: "Overview",
            content: <div className="p-4 overflow-auto flex-grow"><SimulationOverviewPanel meta={props.meta}/></div>
        })

        if (enableOutputFileView){
            console.log("output_file: ", output_file)
            tabs.push({
                label: "Output",
                content: <div className="p-4 overflow-auto flex-grow"><pre>{output_file}</pre></div>
            })
        }

        tabs.push({
            label: "Files",
            content: <div className="p-4 overflow-auto flex-grow"><OutputFilesPanel meta={props.meta} files={files} /></div>
        })

        tabs.push({
            label: "Metadata",
            content: <div className="p-4 overflow-auto flex-grow"><MetadataPanel meta={props.meta} /></div>
        })

        tabs.push({
            label: "Provenance",
            content: <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>
        })

        if (enableDynamicVisualization){
            tabs.push({
                label: "Visualization",
                content: <div className="p-4 overflow-auto flex-grow"><SimVizPanel meta={props.meta}/></div>
            })
        }
        setTabs(tabs)

    },[props, props.meta, enableOutputFileView,enableDynamicVisualization,output_file,files])

    function handleTabChange(event, value) {
        setSelectedTab(value);
    }

    return (
        <div className="flex flex-col overflow-hidden h-full ">
            <div>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="standard"
                    className="m-8"
                >

                    {tabs.map((tab,idx)=>{
                        return (
                            <Tab
                                key={idx}
                                className="min-w-0"
                                label={tab.label}
                            />
                        )
                    })}
                </Tabs>
            </div>
                
            {(tabs && (tabs.length>0))?tabs[selectedTab].content:null}

        </div>
    )
}

export default withReducer("CSonnetSimulationContainerApp", reducer)(CSonnetSimulationContainer);