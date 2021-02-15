import React, { useState } from 'react';
import {withStyles, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Tabs, Tab } from '@material-ui/core';
import MetadataInfoDialog from 'app/main/apps/my-jobs/MetadataDialog'
import { ListAlt as MetadataIcon } from "@material-ui/icons";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
    table: {
        '& th': {
            padding: '16px 0'
        }
    },

    typeIcon: {
        '&.folder:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.document:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        },
        '&.spreadsheet:before': {
            content: "'insert_chart'",
            color: '#4CAF50'
        }
    }
});

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'theme.palette.common.black,',
        color: 'white',
        maxWidth: 350,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

function DetailSidebarContent(props) {
    const selectedItem = useSelector(({ JobDefinitionApp }) => JobDefinitionApp.selectedjobid);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showDialog, setshowDialog] = useState(false);
    const [standardOut, setStandardOut] = useState("")
    const [headerTitle, setHeaderTitle] = useState("")

    const classes = useStyles();

    const openoutputDialog = () => {
        setshowDialog(true)
        setStandardOut(selectedItem.standard_out)
        setHeaderTitle("Output")

    }
    const openErrorDialog = () => {
        setshowDialog(true)
        setStandardOut(selectedItem.standard_err)
        setHeaderTitle("Error")

    }

    const handleClose = () => {
        setshowDialog(false)
    }

    function handleTabChange(event, value) {
        setSelectedTab(value);
    }
    return (

        <FuseAnimate animation="transition.slideUpIn" delay={200}>

            <div className="file-details p-16 sm:p-24">

                {
                    <div>
                        <MetadataInfoDialog
                            openDialog={showDialog}
                            closeDialog={handleClose}
                            standardOut={standardOut}
                            headerTitle={headerTitle}
                        ></MetadataInfoDialog>
                    </div>
                }


                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="w-full mb-32"
                >


                    <Tab
                        className="min-w-0"
                        icon={<MetadataIcon alt="Metadata" />}
                        title="Metadata"
                    />



                </Tabs>
                {selectedTab === 0 && (
                    <React.Fragment>
                        { <div><Typography variant="h6">INFORMATION</Typography></div>}
                        <table className={clsx(classes.table, "w-full, text-left")}>

                            <tbody>
                                <tr>
                                     <th>
                                        Updated by -
                                   </th>
                                    <td>
                                        {selectedItem.updated_by}
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                       Type -
</th>
                                    <td>
                                        {selectedItem.type}
                                    </td>
                                </tr>
                                {/* <tr>
                                     <th>
                                     Description -
                                   </th>
                                    <td>
                                        {selectedItem.description}
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                    </React.Fragment>
                )}


            </div>

        </FuseAnimate>


    );
}

export default DetailSidebarContent;
