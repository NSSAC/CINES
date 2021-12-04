import React, { useState } from 'react';
import { Tab,Tabs } from '@material-ui/core';
import { InsertDriveFile as FileIcon, ListAlt as MetadataIcon, History as ProvenanceIcon, Share as ShareIcon } from "@material-ui/icons";
import FileInformationPanel from "../panel/FileInformationPanel";
import MetadataPanel from "../panel/MetadataPanel";
import ProvenancePanel from "../panel/ProvenancePanel";
import PermissionsPanel from "../panel/PermissionsPanel";

function FileDetailPanel(props) {
    const [selectedTab,setSelectedTab] = useState(0)

    function handleTabChange(evt,val){
        setSelectedTab(val)
    }

    if (!props.meta){
        return null
    }

    return (
        <div className="flex-grow w-full flex flex-col h-full overflow-none">
            <div className="flex-none">
                {/* <div className={`${clsx(classes.header)} text-center text-lg font-semibold pt-8 pb-8`}>
                    <Typography>{props.meta.name}</Typography>
                </div> */}
                
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="w-full mb-8"
                >
                    <Tab
                        icon={<FileIcon alt="File Info" />}
                        className="min-w-0"
                        title="File Information"

                    />
                    <Tab
                        className="min-w-0"
                        icon={<MetadataIcon alt="Metadata" />}
                        title="Metadata"
                    />
                    <Tab
                        className="min-w-0"
                        icon={<ProvenanceIcon alt="File Provenance" />}
                        title="File Provenance"

                    />
                    <Tab
                        className="min-w-0"
                        icon={<ShareIcon alt="Sharing Permissions" />}
                        title="Sharing Permissions"
                    />
                </Tabs>
            </div>

            <div className=" flex-col flex-1 flex h-full  overflow-auto p-2">
                {selectedTab === 0 && (
                    <FileInformationPanel {...props} />
                )}
                {selectedTab === 1 && (
                    <MetadataPanel {...props} />
                )}          
                {selectedTab === 2 && (
                    <ProvenancePanel {...props} />
                )}
                {selectedTab === 3 && (
                    <PermissionsPanel {...props} />
                )}
            </div>

        </div>    
    )

}

export default FileDetailPanel;


