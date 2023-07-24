import React, { useState } from 'react';
import { Tab, Tabs} from '@material-ui/core';
import * as Actions from './store/actions';
import reducer from "./store/reducers";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import JSONTree from 'react-json-tree'
import FileOverviewPanel from "app/main/file-manager/panel/FileOverviewPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"
import {MAX_RAW_FILE_VIEW_SIZE} from "../../FileManagerAppConfig"

function JsonViewer(props) {
    const dispatch = useDispatch();
    const data = useSelector(({ JsonViewerApp }) => JsonViewerApp.data);
    const [selectedTab, setSelectedTab] = useState(0);
    const [maxFileSize] = useState(props.max_file_size || MAX_RAW_FILE_VIEW_SIZE)
    const [enableFileView,setEnableFileView] = useState(false)

    React.useEffect(() =>{
        if (enableFileView){
            dispatch(Actions.getData(props.meta.id))
        }
    },[dispatch,props.meta,enableFileView])

    React.useEffect(()=>{
        if (props.meta &&  ((props.meta.state==="staged") || (props.meta.state==="stored")) && (props.meta.size<maxFileSize)  ){
            setEnableFileView(true)
        }else{
            setEnableFileView(false)
        }
    },[props.meta,maxFileSize])

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
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Overview"
                        label="Overview"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className={`${enableFileView?'':'hidden'} min-w-0`}
                        title="Data"
                        label="Data"

                    />

                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Metadata"
                        label="Metadata"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className="min-w-0"
                        title="Provenance"
                        label="Provenance"

                    />
                    <Tab
                        // icon={<FileIcon alt="JSON Tree" />}
                        className={`${enableFileView?'':'hidden'} min-w-0`}
                        title="JSON"
                        label="JSON"

                    />
                </Tabs>
            </div>
            {selectedTab === 1 && <div className="p-4 overflow-auto flex-grow "><pre>{JSON.stringify(data,null,4)}</pre></div>}
            {selectedTab === 0 && <div className="p-4 overflow-auto flex-grow"><FileOverviewPanel meta={props.meta}/></div>}
            {selectedTab === 2 && <div className="p-4 overflow-auto flex-grow"><MetadataPanel meta={props.meta}/></div>}
            {selectedTab === 3 && <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>}
            {selectedTab === 4 && data && (
                <div className={`${enableFileView?'':'hidden'} p-4 overflow-auto flex-grow`}>
                    <JSONTree data={data} hideRoot={true} theme={{
                            tree: {
                                backgroundColor: '#F7F7F7',
                            },
                            label: {
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                
                            }
                        }} 
                        // shouldExpandNode={()=>true}
                    />
                </div>
            )}
            
        </div>
    )
}

export default withReducer("JsonViewerApp", reducer)(JsonViewer);