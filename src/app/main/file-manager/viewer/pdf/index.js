import React, { useState } from 'react';

import {  Tab, Tabs } from '@material-ui/core';
import FileOverviewPanel from "app/main/file-manager/panel/FileOverviewPanel"
import ProvenancePanel from "app/main/file-manager/panel/ProvenancePanel"
// import PermissionsPanel from "app/main/file-manager/panel/PermissionsPanel"
import MetadataPanel from "app/main/file-manager/panel/MetadataPanel"

function PDFViewer(props) {
    const [selectedTab, setSelectedTab] = useState(0);

    var accept="application/pdf"
    const url = `${process.env.REACT_APP_SCIDUCT_FILE_SERVICE}/file/${props.meta.id}?http_authorization=${localStorage.getItem('id_token')}&&http_accept=${encodeURIComponent(accept)}`

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

            {selectedTab === 1 && (
                <div className="p-4 overflow-hidden h-full ">
                    <iframe title='extentionType' width="100%" height="100%" src={url}>  </iframe>
                </div>
            )}
            {selectedTab === 0 && <div className="p-4 overflow-auto flex-grow"><FileOverviewPanel meta={props.meta}/></div>}
            {selectedTab === 2 && <div className="p-4 overflow-auto flex-grow"><MetadataPanel meta={props.meta}/></div>}
            {selectedTab === 3 && <div className="p-4 overflow-auto flex-grow"><ProvenancePanel meta={props.meta}/></div>}
        </div>
    )
}

export default PDFViewer;