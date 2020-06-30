import React, {useState} from 'react';
import { Typography,Tabs,Tab} from '@material-ui/core';
import { InsertDriveFile as FileIcon, ListAlt as MetadataIcon, History as ProvenanceIcon, Share as ShareIcon, RemoveRedEye   } from "@material-ui/icons";
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useSelector} from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import filesize from 'filesize';

const useStyles = makeStyles({
    table   : {
        '& th': {
            padding: '16px 0'
        }
    },
    typeIcon: {
        '&.folder:before'     : {
            content: "'folder'",
            color  : '#FFB300'
        },
        '&.document:before'   : {
            content: "'insert_drive_file'",
            color  : '#1565C0'
        },
        '&.spreadsheet:before': {
            content: "'insert_chart'",
            color  : '#4CAF50'
        }
    }
});

function DetailSidebarContent(props)
{   
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);
    
    if ( !selectedItem )
    {
        return null;
    }

    function handleTabChange(event, value)
    {
        setSelectedTab(value);
    }

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={200}>

            <div className="file-details p-16 sm:p-24">
{/* 
                <div className="preview h-4 sm:h-256 file-icon flex items-center justify-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                        <Icon className={clsx(classes.typeIcon, selectedItem.type, "text-12")}/>
                    </FuseAnimate>
                </div> */}
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="w-full mb-32"
                >
                    <Tab
                        icon={<FileIcon alt="File Info"/>}
                        className="min-w-0"
                    />
                    <Tab
                        className="min-w-0"
                        icon={<MetadataIcon alt="Metadata"/>}
                    />
                    <Tab
                        className="min-w-0"
                        icon={<ProvenanceIcon alt="File Provenance"/>}
                    />
                    <Tab
                        className="min-w-0"
                        icon={<ShareIcon alt="Sharing Permissions"/>}
                    />
                    <Tab
                        className="min-w-0"
                        icon={<RemoveRedEye alt="Preview"/>}
                    />
                </Tabs>

                {selectedTab === 0 && (
                    <React.Fragment>
                        <div><Typography variant="h6">INFORMATION</Typography></div>
                        <table className={clsx(classes.table, "w-full, text-left")}>

                            <tbody>
                                <tr className="state">
                                    <th>State</th>
                                    <td>{selectedItem.state}</td>
                                </tr>
                                <tr className="type">
                                    <th>Type</th>
                                    <td>{selectedItem.type}</td>
                                </tr>

                                <tr className="size">
                                    <th>Size</th>
                                    <td>{(!selectedItem.size && (selectedItem.size !== 0)) ? '-' : filesize(selectedItem.size)}</td>
                                </tr>
                                <tr className="owner">
                                    <th>Owner&nbsp;&nbsp;</th>
                                    <td>{selectedItem.owner_id}</td>
                                </tr>

                                <tr className="MD5">
                                    <th>MD5</th>
                                    <td>{selectedItem.hash}</td>
                                </tr>
                            </tbody>
                        </table>
                    </React.Fragment>
                )}

                {selectedTab === 1 && (
                    <React.Fragment>
                        <div><Typography variant="h6">DISCOVERED META</Typography></div>
                        <div><pre>{JSON.stringify(selectedItem.autometa,null,2)}</pre></div>
                        <div><Typography variant="h6">USER META</Typography></div>
                        <div><pre>{JSON.stringify(selectedItem.usermeta,null,2)}</pre></div>
                    </React.Fragment>
                )}

                {selectedTab === 2 && (
                    <React.Fragment>
                        <div><Typography variant="h6">PROVENANCE</Typography></div>
                        <div><pre>{JSON.stringify(selectedItem.provenance,null,2)}</pre></div>
                    </React.Fragment>
                )}

                {selectedTab === 3 && (
                    <React.Fragment>
                        <table className={clsx(classes.table, "w-full, text-left")}>
                            <tbody>
                                <tr className="owner">
                                    <th>Owner</th>
                                    <td>{selectedItem.owner_id}</td>
                                </tr>
                                <tr className="readacl">
                                    <th>Read ACL</th>
                                    <td>{selectedItem.readACL.join(", ")}</td>
                                </tr>
                                <tr className="writeacl">
                                    <th>Write ACL</th>
                                    <td>{selectedItem.writeACL.join(", ")}</td>
                                </tr>
                                <tr className="writeacl">
                                    <th>Compute ACL</th>
                                    <td>{selectedItem.computeACL.join(", ")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </React.Fragment>
                )}      

              
            </div>
        </FuseAnimate>
    );
}

export default DetailSidebarContent;
