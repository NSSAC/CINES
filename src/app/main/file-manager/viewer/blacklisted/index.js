import React, { useState } from 'react';

import {  Tab, Tabs } from '@material-ui/core';
// import * as Actions from "./store/actions";
import reducer from "./store/reducers";
// import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import FileOverviewPanel from "app/main/file-manager/panel/FileOverviewPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"
// import {MAX_RAW_FILE_VIEW_SIZE} from "../../FileManagerAppConfig"

function BlackListViewer(props) {
    // const dispatch = useDispatch();
    // const data = useSelector(({ BlacklistViewerApp }) => BlacklistViewerApp.data);
    const [selectedTab, setSelectedTab] = useState(0);


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
                </Tabs>
            </div>
            {/* {selectedTab === 1 && data && <div className={`${enableFileView?'':'hidden'} p-4 overflow-auto flex-grow`}><pre>{data}</pre></div>} */}
            {selectedTab === 0 && <div className="p-4 overflow-auto flex-grow"><FileOverviewPanel meta={props.meta}/></div>}
            {selectedTab === 1 && <div className="p-4 overflow-auto flex-grow"><MetadataPanel meta={props.meta}/></div>}
            {selectedTab === 2 && <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>}
        </div>
    )
}

export default withReducer("BlacklistViewerApp", reducer)(BlackListViewer);