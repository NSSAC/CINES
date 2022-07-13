import { Typography } from '@material-ui/core';
import { lowerCase } from 'lodash-es';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import MetadataInfoDialog from './MetadataDialog';
import * as Actions from './store/actions';

function JobData() {
    const dispatch = useDispatch()
    var selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
    var path = window.location.pathname;
    var pathEnd = path.replace("/apps/my-jobs/", "");
    const [showDialog, setshowDialog] = useState(false);
    const [standardOut, setStandardOut] = useState("");
    const [headerTitle, setHeaderTitle] = useState("");
    const history = useHistory();
    var x = null

    const navigateStyle = {
        color: "#1565C0",
        wordBreak: 'break-all',
        cursor: "pointer",
    };

    const hereButton = {
        fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
        fontSize: '1.4rem',
        fontWeight: '400',
        color: '#1565C0'
      }

      var navigateLabels = ['csonnet_data_analysis','csonnet_simulation','input_file']
      var clickHere = ['rules','initial_states_method','text_sections','plot_types','dynamicProps','submodelArrayData']

    const openoutputDialog = () => {
        setshowDialog(true);
        setStandardOut(selectedItem.stdout);
        setHeaderTitle("Output");
    };
    const openErrorDialog = () => {
        setshowDialog(true);
        setStandardOut(selectedItem.stderr);
        setHeaderTitle("Error");
    };

    const openDialog = (data) => {
        setshowDialog(true);
        setStandardOut(data[1]);
        setHeaderTitle(data[0]);
    }

    function navigateFile(selectedItem) {
        history.push("/files" + selectedItem);
    }

    function inputPar(data) {
        if ((data[0].includes('inputFile') || data[0].toLowerCase().includes('graph') || navigateLabels.indexOf(data[0]) !== -1) && !data[0].toLowerCase().includes('type')) {
            x = (<span style={navigateStyle} onClick={() => navigateFile(data[1])}>{data[1]}</span>
            )
        } else if (clickHere.indexOf(data[0]) !== -1) {
            x = (<span onClick={() => openDialog(data)}>
                {/* eslint-disable-next-line */}
                <a style={{ color: '#1565C0' }} className="cursor-pointer">Click here</a>
            </span>
            )
        } else {
            x = (<span style={{ lineBreak: 'anywhere' }}>{JSON.stringify(data[1])}</span>
            )
        }
    }

    const handleClose = () => {
        setshowDialog(false);
    };

    useEffect(() => {
        dispatch(Actions.setSelectedItem(pathEnd));
          // eslint-disable-next-line
    }, [])

    if (selectedItem.id === pathEnd) {
        return (
            <div style={{ margin: '30px 10px 10px 10px' }}>

                <MetadataInfoDialog
                    opendialog={showDialog}
                    closedialog={handleClose}
                    standardout={standardOut}
                    headertitle={headerTitle}
                ></MetadataInfoDialog>

                <div className='m-10'>
                    <Typography variant="h5">Output</Typography>
                    <Typography><span style={{ fontWeight: '700' }}>Output file</span>: {selectedItem.output_container ? <span style={navigateStyle} onClick={() => navigateFile(selectedItem.output_container + '/' + selectedItem.output_name)}>{selectedItem.output_container + '/' + selectedItem.output_name}</span> : 'none'}</Typography>
                    <Typography><span style={{ fontWeight: '700' }}>Output data</span>: {selectedItem.output ? <span>{String(selectedItem.output.output)}</span> : 'none'}</Typography>
                    {selectedItem.stdout && <Typography><span style={{ fontWeight: '700' }}>Std out</span>: {<span onClick={() => openoutputDialog()}>
                    <button style={hereButton} className="cursor-pointer">Click here</button>
                    </span>}</Typography>}
                    {selectedItem.stderr && <Typography><span style={{ fontWeight: '700' }}>Std error</span>: {<span onClick={() => openErrorDialog()}>
                    <button style={hereButton} className="cursor-pointer">Click here</button>
                    </span>}</Typography>}
                </div>

                <div className='m-10'>
                    <Typography variant="h5">Information</Typography>
                    <Typography><span style={{ fontWeight: '700' }}>Job definition</span>: {selectedItem.job_definition}</Typography>
                    <Typography><span style={{ fontWeight: '700' }}>Status</span>: {selectedItem.state}</Typography>
                    <Typography><span style={{ fontWeight: '700' }}>Creation date</span>: {selectedItem.creation_date.replace(/T|Z/g, '  ').split(".")[0]}</Typography>
                    {selectedItem.creation_date && <Typography><span style={{ fontWeight: '700' }}>Modified date</span>: {selectedItem.update_date.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                    {selectedItem.completed_date && <Typography><span style={{ fontWeight: '700' }}>Completed date</span>: {selectedItem.completed_date.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                    {selectedItem.cancelled_date && <Typography><span style={{ fontWeight: '700' }}>Cancelled date</span>: {selectedItem.cancelled_date.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                    {selectedItem.created_by && <Typography><span style={{ fontWeight: '700' }}>Created by</span>: {selectedItem.created_by.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                    {selectedItem.exit_code && <Typography><span style={{ fontWeight: '700' }}>Exit code</span>: {selectedItem.exit_code.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                    {selectedItem.failure_type && <Typography><span style={{ fontWeight: '700' }}>Failure type</span>: {selectedItem.failure_type.replace(/T|Z/g, '  ').split(".")[0]}</Typography>}
                </div>

                {selectedItem.input_files && selectedItem.input_files.length > 0 && <div className='m-10'>
                    <Typography variant="h5">Input files</Typography>
                    {selectedItem.input_files.map((data, index) => {
                        return (
                            <div>
                                {data.name && <Typography><span style={{ fontWeight: '700' }}>File</span>: {data.name}</Typography>}
                                {data.id && <Typography><span style={{ fontWeight: '700' }}>Id</span>: {data.id}</Typography>}
                                {data.type && <Typography><span style={{ fontWeight: '700' }}>Type</span>: {data.type}</Typography>}
                            </div>
                        )
                    })}
                </div>}

                {<div className='m-10'>
                    <Typography variant="h5">Input parameters</Typography>
                    {Object.entries(selectedItem.input).filter(data => { if (data[0] !== 'extraObj' && data[0] !== 'dynamic_inputs') return data; return null }).map((data, index) => {
                        inputPar(data)
                        return (
                            <div>
                                <Typography><span style={{ fontWeight: '700' }}>{data[0]}</span>: {x}</Typography>
                            </div>
                        )
                    })}
                </div>}
            </div>
        )
    }
    else
        return null;
}

export default JobData;