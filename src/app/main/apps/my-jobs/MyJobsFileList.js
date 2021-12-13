import { Button, Hidden, Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core';
/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import { FuseAnimate } from '@fuse';

import JobData from './JobData';
import * as Actions from './store/actions';

import './FileList.css'
import 'fix-date'

function MyJobsFileList(props) {
    const dispatch = useDispatch();
    const files1 = useSelector(({ myJobsApp }) => myJobsApp.myjobs, shallowEqual);
    var selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
    const [selectedId, setSelectedId] = useState();
    const [dataSpinner, setDataSpinner] = useState(true);
    var onloadSpinner = false;
    var files = Object.values(files1);
    var path = window.location.pathname;
    var totalRecords;


    if (dataSpinner === true) {
        setTimeout(() => {
            setDataSpinner(false)
        }, 3000);
    }

    else if (files.length !== 0) {
        if (files[2]['content-range'] !== undefined) {
            totalRecords = Number(files[2]['content-range'].split('/')[1])
        }
        files = files[1]
        onloadSpinner = true;
        if (selectedId === undefined && files.length > 0 && path.endsWith('my-jobs/') === true && props.changeState === 0) {
            dispatch(Actions.setSelectedItem(files[0].id));
        }

        if (files.length > 0) {
            var i;
            for (i = 0; i < files.length; i++) {
                var t = new Date(files[i].creation_date)
                var date = ('0' + t.getDate()).slice(-2);
                var month = ('0' + (t.getMonth() + 1)).slice(-2);
                var year = t.getFullYear();
                var hours = ('0' + t.getHours()).slice(-2);
                var minutes = ('0' + t.getMinutes()).slice(-2);
                var seconds = ('0' + t.getSeconds()).slice(-2);
                var tempDate = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
                files[i].creation_date = tempDate
            }
        }

    }
    const [page, setPage] = React.useState(0);
    const [sortById, setsortById] = useState(false);
    const [sortByjobdef, setsortByjobdef] = useState(false);
    const [sortByOutputName, setSortByOutputName] = useState(false)
    const [sortIdFlag, setSortIdFlag] = useState(false);
    const [sortByjobdefFlag, setSortByjobdefFlag] = useState(false);
    const [sortByOutputNameFlag,setSortByOutputNameFlag] = useState(false);
    const [sortBystateFlag, setSortBystateFlag] = useState(false);
    const [sortByCreationDdateFlag, setSortByCreationDdateFlag] = useState(true);
    const [sortByCreationDdate, setsortByCreationDdate] = useState(false)
    const [sortBystate, setsortBystate] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [selectedFlag, setSelectedFlag] = useState(true)
    const [sortCount, setSortCount] = useState(false)
    const [showRange, setShowRange] = useState(false)
    var type;
    var rowLength = 10;

    const infoIcon = {
        right: '0',
        backgroundColor: 'whitesmoke',
        position: 'sticky',
        width: '100px'
    }

    useEffect(() => {
        if (files.length > 0 && sortCount === false) {
            if (document.getElementsByClassName("jobRows").length > 0)
                document.getElementsByClassName("jobRows")[0].click()
            if (page === 1) {
                document.getElementsByClassName('jobBody')[0].scrollTop = document.getElementsByClassName('jobBody')[0].scrollHeight;
                document.getElementsByClassName("jobRows")[0].click()
            }
        }
    }, [files1])

    useEffect(() => {
        setSpinnerFlag(false)
        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            let currentPage = 0
            setPage(currentPage)
        }

        if (files.length > 0 && selectedFlag) {
            setSelectedId(files[0].id)
        }

        if (files.length > 0) {
            var i, changeState = false, cancelledState = false;
            var cancelledJob = localStorage.getItem("cancelledJob")
            for (i = 0; i < files.length; i++) {
                if (files[i].state !== 'Completed' && files[i].state !== 'Failed' && files[i].state !== 'Cancelled') {
                    changeState = true;
                }
            }
            if (cancelledJob === null)
                cancelledState = true;
            else {
                for (i = 0; i < files.length; i++) {
                    if (files[i].id === cancelledJob) {
                        cancelledState = true;
                        if (files[i].state === 'Completed' || files[i].state === 'Failed' || files[i].state === 'Cancelled')
                            localStorage.removeItem("cancelledJob")
                        break;
                    }
                }
            }
            const timer_selectedItem = setInterval(() => {
                selectedItem && selectedItem.state !== 'Completed' && selectedItem.state !== 'Failed' && selectedItem.state !== 'Cancelled' && dispatch(Actions.setSelectedItem(selectedId));
            }, 8000);

            const timer_jobList = setInterval(() => {
                if (changeState || !cancelledState) {
                    props.setChangeState(props.changeState + 1);
                    cancelledState && setSortCount(true)
                }
                setTimeout(() => {
                    setSortCount(false);
                }, 2000);
            }, 8000);

            return () => {
                clearInterval(timer_jobList);
                clearInterval(timer_selectedItem);
            }
        }

    })

    useEffect(() => {
        if (document.getElementsByClassName("jobRows").length > 0)
            document.getElementsByClassName("jobRows")[0].click()
    }, [page])

    const handleChangePage = (event, newPage) => {
        setSpinnerFlag(true)
        sessionStorage.setItem("resetPage", JSON.stringify(false))

        let currentPage = page + 1
        setPage(currentPage);
        fetchNextSetData()
    };

    const toggleSorting = (sortType, toggleArrow) => {
        let sortOrder = ""
        if (toggleArrow === 'sortByjobdef') {
            setSortIdFlag(false)
            setSortByjobdefFlag(true)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)

            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(false)
            setSortByOutputName(false)
            setsortByjobdef(!sortByjobdef)
            sortOrder = sortByjobdef
        }
        else if (toggleArrow === 'sortByOutputName') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(true)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)

            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(false)
            setSortByOutputName(!sortByOutputName)
            setsortByjobdef(false)
            sortOrder = sortByOutputName
        }
        else if (toggleArrow === 'sortBystate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(true)
            setSortByCreationDdateFlag(false)

            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(!sortBystate)
            sortOrder = sortBystate
        }
        else if (toggleArrow === 'sortByCreationDdate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(true)

            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortById(false)
            setsortBystate(false)
            setsortByCreationDdate(!sortByCreationDdate)
            sortOrder = sortByCreationDdate
        }

        else if (toggleArrow === 'sortById') {
            setSortByjobdefFlag(false)
            setSortByOutputNameFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)
            setSortIdFlag(true)
            setsortByjobdef(false)
            setSortByOutputName(false)
            setsortByCreationDdate(false)
            setsortBystate(false)
            setsortById(!sortById)
            sortOrder = sortById
        }
        let start = 0
        setPage(0)
        type = sortType;
        let clearAarry = true;
        dispatch(Actions.getFiles(10, 0, sortOrder, type, clearAarry));
        sessionStorage.setItem("sortOrder", JSON.stringify(sortOrder));
        sessionStorage.setItem("type", JSON.stringify(type));
        sessionStorage.setItem("count", start);
    }
    const fetchNextSetData = () => {
        setShowRange(false)
        let clearAarry = false;
        let sortType = JSON.parse(sessionStorage.getItem("type"));
        let sortOrder = JSON.parse(sessionStorage.getItem("sortOrder"));
        let start = parseInt(sessionStorage.getItem("count")) + 10;

        dispatch(Actions.getFiles(10, start, sortOrder, sortType, clearAarry));
        // Store
        sessionStorage.setItem("count", start);
        props.setInitialPage(false)
    }

    const fetchPreviousSetData = () => {
        setShowRange(true)
        let currentPage = page - 1
        setPage(currentPage)
        if (currentPage === 0)
            props.setInitialPage(true)
    }
    function onRowClick(selectedId) {
        setSelectedFlag(false)
        setSelectedId(selectedId)
        selectedId = selectedId;
        dispatch(Actions.setSelectedItem(selectedId));
    }

    if (spinnerFlag === true)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        );

    if (spinnerFlag === false && dataSpinner === false && files.length > 0) {
      if(path.endsWith('my-jobs/') === true)
        return (
            <div>
                <FuseAnimate animation="transition.slideUpIn" delay={100}>
                    <TableContainer className='overflowContentJob' component={Paper}>
                        <Table stickyHeader className='webkitSticky' aria-label="a dense table">

                            <TableHead>
                                <TableRow style={{ whiteSpace: 'nowrap' }}>

                                    <TableCell>Job Id {(sortById) ?

                                        <Tooltip title="Sort by job id" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('id', 'sortById')}>
                                                <Icon >arrow_upward</Icon>
                                            </IconButton>
                                        </Tooltip>

                                        :
                                        <Tooltip title="Sort by job id" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('id', 'sortById')}>
                                                <Icon className={sortIdFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>
                                    <TableCell >Job Type{(sortByjobdef) ?
                                        <Tooltip title="Sort by job type" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('job_definition', 'sortByjobdef')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Sort by job type" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('job_definition', 'sortByjobdef')}> <Icon className={sortByjobdefFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>
                                    <TableCell >Output {(sortByOutputName) ?
                                        <Tooltip title="Sort by output name" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('output_name', 'sortByOutputName')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Sort by output name" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('output_name', 'sortByOutputName')}> <Icon className={sortByOutputNameFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>
                                    <TableCell  >Status {(sortBystate) ?
                                        <Tooltip title="Sort by status" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('state', 'sortBystate')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Sort by status" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('state', 'sortBystate')}> <Icon className={sortBystateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>
                                    <TableCell > Creation Date{(sortByCreationDdate) ?
                                        <Tooltip title="Sort by creation date" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleSorting('creation_date', 'sortByCreationDdate')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Sort by creation date" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleSorting('creation_date', 'sortByCreationDdate')}> <Icon className={sortByCreationDdateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }</TableCell>

                                </TableRow>
                            </TableHead>
                            {files.length > 0 ?
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : files
                                    ).map((row, ind, arr) => {
                                        rowLength = arr.length;
                                        return ((
                                            <TableRow key={row.id}
                                                className="cursor-pointer jobRows"
                                                selected={row.id === selectedId}
                                                onClick={() => onRowClick(row.id)}
                                            >
                                                <TableCell>
                                                    {<Link style={{color: "#1565C0"}} to={row.id}>{row.id}</Link>}
                                                </TableCell >
                                                <TableCell className="" >
                                                 {(()=>{
                                                        var parts = row.job_definition.split("@")
                                                        const full_jd = parts[0]
                                                        const version = parts[1]
                                                        var nameparts = full_jd.split("/")
                                                        const jd = nameparts.pop();
                                                        const namespace = nameparts.map(encodeURIComponent).join("/")  
                                                        return (
                                                            <React.Fragment>

                                                                <div className="text-xs">
                                                                    <span>{namespace}</span><span className="ml-4">v{version}</span>
                                                                </div>
                                                                <div className="text-base font-semibold" >
                                                                    {/* {jd.replace(/([^[\p{L}\d]+|(?<=[\p{Ll}\d])(?=\p{Lu})|(?<=\p{Lu})(?=\p{Lu}[\p{Ll}\d])|(?<=[\p{L}\d])(?=\p{Lu}[\p{Ll}\d]))/gu, ' ')} */}
                                                                    {jd.replace(/_/gu,' ')}
                                                                </div>
                                                            </React.Fragment>
                                                            
                                                        )
                                                    })()}
                                                </TableCell>
                                                <TableCell style={{lineBreak:'anywhere'}}>
                                                    {row.output_name || <b>-</b>} 
                                                </TableCell>
                                                <TableCell  >
                                                    {row.state}
                                                </TableCell>

                                                <TableCell  >
                                                    {row.creation_date.replace(/T|Z/g, '  ').split(".")[0]}
                                                </TableCell>
                                                {/* <TableCell  >
                                                    {row.update_date}
                                                </TableCell> */}
                                                <Hidden lgUp>
                                                    <TableCell style={infoIcon}>
                                                        <IconButton
                                                            onClick={(ev) => props.pageLayout.current.toggleRightSidebar()}
                                                            aria-label="open right sidebar"
                                                        >
                                                            <Icon>info</Icon>
                                                        </IconButton>
                                                    </TableCell>
                                                </Hidden>
                                            </TableRow>
                                        ))

                                    }

                                    )}

                                </TableBody> : <LinearProgress className="w-xs" color="secondary" />
                            }

                            <TableFooter>

                            </TableFooter>
                        </Table>
                    </TableContainer>
                </FuseAnimate>
                {files.length > 0 ?
                    <div >
                        <Button disabled={page * rowsPerPage + 1 === 1}
                            className={'next-button'} color="primary"
                            variant="contained" onClick={fetchPreviousSetData}>Previous</Button>
                        <span className={'count-info'}>Items  {page * rowsPerPage + 1}-{page * rowsPerPage + rowLength} /{totalRecords}</span>
                        <Button
                            disabled={page * rowsPerPage + rowLength === totalRecords}
                            color="primary" className={'next-button'} variant="contained"
                            onClick={handleChangePage}>Next</Button>
                        <span className={'count-info'}>Page - {page + 1}</span>
                    </div> : null
                }

            </div>
        );

        else{
            return <JobData></JobData>;
        }
    }

    else if (files.length === 0 && onloadSpinner) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Typography className="text-20 mt-16" color="textPrimary">No records exists.</Typography>
            </div>
        )
    }
    else if (Object.values(files1).length === 0)
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        )

    else
        return (
            <div className="flex flex-1 flex-col items-center justify-center mt-40">
                <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
                <LinearProgress className="w-xs" color="secondary" />
            </div>
        )
}



export default MyJobsFileList;
