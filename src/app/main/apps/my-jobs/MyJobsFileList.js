/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress, Hidden, Button, Icon, TableFooter, Tooltip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import './FileList.css'

function MyJobsFileList(props) {
    const dispatch = useDispatch();
    const files1 = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
    const selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
    const [selectedId, setSelectedId] = useState();
    const [dataSpinner, setDataSpinner] = useState(true);
    var onloadSpinner = false;
    var files = Object.values(files1);
    var totalRecords;


    if(dataSpinner === true){
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
        if (selectedId === undefined &&   files.length >0) {
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
    const [sortIdFlag, setSortIdFlag] = useState(false);
    const [sortByjobdefFlag, setSortByjobdefFlag] = useState(false);
    const [sortBystateFlag, setSortBystateFlag] = useState(false);
    const [sortByCreationDdateFlag, setSortByCreationDdateFlag] = useState(true);
    const [sortByCreationDdate, setsortByCreationDdate] = useState(false)
    const [sortBystate, setsortBystate] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [selectedFlag, setSelectedFlag] = useState(true)
    const [showRange, setShowRange] = useState(false)
    var type;
    var rowLength;

    useEffect(() => {
        setSpinnerFlag(false)
        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            let currentPage = 0
            setPage(currentPage)
        }
        if (files.length > 0 && selectedFlag) {
            var selectedId1 = files[0].id
            setSelectedId(selectedId1)
        }

        if (files.length > 0) {
            var i, changeState = false;
            for (i = 0; i < files.length; i++) {
                if (files[i].state !== 'Completed' && files[i].state !== 'Failed'){
                    changeState = true;
                    localStorage.setItem('queuedId', files[i].id)
                }
                break;
            }
        }

        var queueId = localStorage.getItem('queuedId')
        if(!changeState && files.length !== 0 && selectedId === queueId){
            dispatch(Actions.setSelectedItem(files[0].id));
            localStorage.setItem('queuedId', null)
        }

        const timer = setInterval(() => changeState && props.setChangeState(props.changeState + 1), 8000);
        return () => clearInterval(timer)

    })

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
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)

            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(false)
            setsortByjobdef(!sortByjobdef)
            sortOrder = sortByjobdef
        }
        else if (toggleArrow === 'sortBystate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortBystateFlag(true)
            setSortByCreationDdateFlag(false)

            setsortByjobdef(false)
            setsortByCreationDdate(false)
            setsortById(false)
            setsortBystate(!sortBystate)
            sortOrder = sortBystate
        }
        else if (toggleArrow === 'sortByCreationDdate') {
            setSortIdFlag(false)
            setSortByjobdefFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(true)

            setsortByjobdef(false)
            setsortById(false)
            setsortBystate(false)
            setsortByCreationDdate(!sortByCreationDdate)
            sortOrder = sortByCreationDdate
        }

        else if (toggleArrow === 'sortById') {
            setSortByjobdefFlag(false)
            setSortBystateFlag(false)
            setSortByCreationDdateFlag(false)
            setSortIdFlag(true)
            setsortByjobdef(false)
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
    }

    const fetchPreviousSetData = () => {
        setShowRange(true)
        let currentPage = page - 1
        setPage(currentPage)
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
        return (
            <div>

                <FuseAnimate animation="transition.slideUpIn" delay={100}>
                    <TableContainer component={Paper}>
                        <Table aria-label="a dense table">

                            <TableHead>
                                <TableRow>

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
                                                className="cursor-pointer"
                                                selected={row.id === selectedId}
                                                onClick={() => onRowClick(row.id)}
                                            >
                                                <TableCell>
                                                    {row.id}
                                                </TableCell >
                                                <TableCell >
                                                    {row.job_definition}
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
                                                    <TableCell>
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
