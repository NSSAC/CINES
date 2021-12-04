import React, { useState } from 'react';

import {  Tab, Tabs } from '@material-ui/core';
import FileOverviewPanel from "app/main/file-manager/panel/FileOverviewPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"

function ImageViewer(props) {
    const [selectedTab, setSelectedTab] = useState(0);
    var accept,classes;
    if (props.accept){
        accept=props.accept
    } else if (props.meta.type && props.meta.type==="svg"){
        accept="image/svg%2Bxml"
        classes="h-full w-full"
    }else if (props.meta.type){
        accept=`image/${props.meta.type}`
        classes="max-w-max max-h-full"
    }else{
        accept="application/octet-stream"
    }
    const image_url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.meta.id}?http_authorization=${localStorage.getItem('id_token')}&&http_accept=${encodeURIComponent(accept)}`

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

                </Tabs>
            </div>
            {selectedTab === 1 && <div className="p-4 overflow-hidden h-full "><img className={`${classes} ml-auto mr-auto border border-gray-400 p-0`} alt={props.meta.name} src={image_url} /></div>}
            {selectedTab === 0 && <div className="p-4 overflow-auto flex-grow"><FileOverviewPanel meta={props.meta}/></div>}
            {selectedTab === 2 && <div className="p-4 overflow-auto flex-grow"><MetadataPanel meta={props.meta}/></div>}
            {selectedTab === 3 && <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>}
        </div>
    )
}

export default ImageViewer;