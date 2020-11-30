import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress, Hidden, Button, Icon, TableFooter, Tooltip, IconButton, TablePagination, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Actions from './store/actions';
import './FileList.css'
const useStyles = makeStyles({
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
const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

function FileList(props) {


    const dispatch = useDispatch();
    const files1 = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
    const selectedItem = useSelector(({ myJobsApp }) => myJobsApp.selectedjobid);
    var files = Object.values(files1);
    var totalRecords = "";
    var contentRange = "";
    var lastResult = ""
    const [selectedId, setSelectedId] = useState();
    if (files.length !== 0) {
        contentRange = files[2]['content-range']
        totalRecords = files[2]['content-range'].split('/')[1]
        //setSelectedId(files[0].id)
        lastResult = files[2]['content-range'].split('/')[0].split('-')[1]
        files = files[1]
        if (Object.keys(selectedItem).length === 0) {
            dispatch(Actions.setSelectedItem(files[0].id));

        }
    }
    const classes = useStyles();

    const tableClasses = useStyles2();

    const [page, setPage] = React.useState(0);
    const [filterFlag, setFilterFlag] = useState(true);
    const [shortById, setshortById] = useState(false);
    const [shortByjobdef, setshortByjobdef] = useState(false);


    const [shortIdFlag, setShortIdFlag] = useState(false);
    const [shortByjobdefFlag, setShortByjobdefFlag] = useState(false);
    const [shortBystateFlag, setShortBystateFlag] = useState(false);
    const [shortByCreationDdateFlag, setShortByCreationDdateFlag] = useState(true);
    const [shortByCreationDdate, setshortByCreationDdate] = useState(false)
    const [shortBystate, setshortBystate] = useState(false);
    const [shortByCompletedDdate, setshortByCompletedDdate] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [spinnerFlag, setSpinnerFlag] = useState(true);
    const [selectedFlag, setSelectedFlag] = useState(true)
    var type;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, files.length - page * rowsPerPage);
    useEffect(() => {
        setSpinnerFlag(false)
        if (files.length !== 0) {


        }


        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            let currentPage = 0
            setPage(currentPage)
        }
        if (files.length > 0 && selectedFlag) {
            var selectedId = files[0].id
            setSelectedId(selectedId)
        }


    })

    const handleChangePage = (event, newPage) => {
        setSpinnerFlag(true)
        sessionStorage.setItem("resetPage", JSON.stringify(false))

        let currentPage = page + 1
        setPage(currentPage);
        fetchNextSetData()
    };
    const pageCount = (Math.round(files.length / 10) * 10) / 10;
    const handleChangeRowsPerPage = (event) => {

        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleShorting = (shortType, toggleArrow) => {
        let shortOrder = ""
        if (toggleArrow === 'shortByjobdef') {
            setShortIdFlag(false)
            setShortByjobdefFlag(true)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(false)

            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(false)
            setshortByjobdef(!shortByjobdef)
            shortOrder = shortByjobdef

        }
        else if (toggleArrow === 'shortBystate') {
            setShortIdFlag(false)
            setShortByjobdefFlag(false)
            setShortBystateFlag(true)
            setShortByCreationDdateFlag(false)

            setshortByjobdef(false)
            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(!shortBystate)
            shortOrder = shortBystate
        }
        else if (toggleArrow === 'shortByCreationDdate') {
            setShortIdFlag(false)
            setShortByjobdefFlag(false)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(true)

            setshortByjobdef(false)
            setshortById(false)
            setshortBystate(false)
            setshortByCreationDdate(!shortByCreationDdate)
            shortOrder = shortByCreationDdate
        }

        else if (toggleArrow === 'shortById') {
            setShortByjobdefFlag(false)
            setShortBystateFlag(false)
            setShortByCreationDdateFlag(false)
            setShortIdFlag(true)
            setshortByjobdef(false)
            setshortByCreationDdate(false)
            setshortBystate(false)
            setshortById(!shortById)
            shortOrder = shortById
        }
        let start = 1
        setPage(0)
        type = shortType;
        let clearAarry = true;
        dispatch(Actions.getFiles(10, 1, shortOrder, type, clearAarry));
        sessionStorage.setItem("shortOrder", JSON.stringify(shortOrder));
        sessionStorage.setItem("type", JSON.stringify(type));
        sessionStorage.setItem("count", start);

    }

    const fetchNextSetData = () => {
        let clearAarry = false;
        let shortType = JSON.parse(sessionStorage.getItem("type"));
        let shortOrder = JSON.parse(sessionStorage.getItem("shortOrder"));
        let start = parseInt(sessionStorage.getItem("count")) + 10;

        dispatch(Actions.getFiles(10, start, shortOrder, shortType, clearAarry));
        // Store
        sessionStorage.setItem("count", start);
    }

    const fetchPreviousSetData = () => {
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

    if (spinnerFlag === false) {
        return (
            <div>

                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <TableContainer component={Paper}>
                        <Table className={tableClasses.table} aria-label="custom pagination table">

                            <TableHead>
                                <TableRow>

                                    <TableCell> {(shortById) ?

                                        <Tooltip title="Short by id" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('id', 'shortById')}>
                                                <Icon >arrow_upward</Icon>
                                            </IconButton>
                                        </Tooltip>

                                        :
                                        <Tooltip title="Short by id" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('id', 'shortById')}>
                                                <Icon className={shortIdFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }Job Id</TableCell>
                                    <TableCell >{(shortByjobdef) ?
                                        <Tooltip title="Short by job type" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('job_definition', 'shortByjobdef')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Short by job type" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('job_definition', 'shortByjobdef')}> <Icon className={shortByjobdefFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }Job Type</TableCell>
                                    <TableCell className="hidden md:table-cell" >{(shortBystate) ?
                                        <Tooltip title="Short by status" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('state', 'shortBystate')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Short by status" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('state', 'shortBystate')}> <Icon className={shortBystateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    } Status</TableCell>
                                    <TableCell className=" hidden md:table-cell"> {(shortByCreationDdate) ?
                                        <Tooltip title="Short by creation date" placement="bottom">
                                            <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon>arrow_upward</Icon></IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Short by creation date" placement="bottom">
                                            <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon className={shortByCreationDdateFlag ? "" : "sort-arrow"}>arrow_downward</Icon></IconButton>
                                        </Tooltip>
                                    }Creation Date</TableCell>
                                    {/* <TableCell className="hidden sm:table-cell">{(shortByCompletedDdate) ? <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon>arrow_upward</Icon></IconButton> : <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon>arrow_downward</Icon></IconButton>} Completed Date</TableCell> */}
                                </TableRow>
                            </TableHead>
                            {files.length > 0 ?
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : files
                                    ).map((row) => {

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
                                                <TableCell className="hidden md:table-cell" >
                                                    {row.state}
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell" >
                                                    {row.creation_date}
                                                </TableCell>
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

                <div >
                    <Button disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}>Previous</Button><span className={'count-info'}>Items {page * rowsPerPage + 1}-{page * rowsPerPage + rowsPerPage} /{totalRecords}</span> <Button disabled={page * rowsPerPage + rowsPerPage === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}>Next</Button>
                    <span className={'count-info'}>Page - {page + 1}</span>
                </div>
                {/* <div className="">
                    <IconButton disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}> <Icon >chevron_left</Icon></IconButton><span className={'count-info'}>Total records  {page * rowsPerPage + 1}-{page * rowsPerPage + rowsPerPage} of {totalRecords}</span>  <IconButton disabled={page * rowsPerPage + rowsPerPage === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}> <Icon >chevron_right</Icon></IconButton> 
                <span className={'count-info'}>Page - {page + 1}</span>
                    </div> */}

                {/* <Button disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}>Previous</Button><span className={'count-info'}>{contentRange} </span> <Button disabled={lastResult === totalRecords} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}>Next</Button>
                <span className={'count-info'}>Page - {page + 1}</span> */}
            </div>
        );
    }
}

export default FileList;
