import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress,Hidden, Button, Icon, TableFooter, IconButton, TablePagination, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@material-ui/core';
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
    const [selectedId, setSelectedId] = useState();
    const dispatch = useDispatch();
    const files1 = useSelector(({ myJobsApp }) => myJobsApp.myjobs);
    const selectedItem = useSelector(({myJobsApp}) => myJobsApp.selectedjobid);
    var files = Object.values(files1);
    var contentRange = ""
    if (files.length !== 0) {

        contentRange = files[2]['content-range'].split('/')[1]
        files = files[1]
        if(Object.keys(selectedItem).length === 0 ){
            dispatch(Actions.setSelectedItem(files[0].id));

        }
    }
    const classes = useStyles();

    const tableClasses = useStyles2();

    const [page, setPage] = React.useState(0);
    const [filterFlag, setFilterFlag] = useState(true)
    const [shortById, setshortById] = useState(false)
    const [shortByjobdef, setshortByjobdef] = useState(false)
    
    const [shortBystate, setshortBystate] = useState(false)
    const [shortByCompletedDdate, setshortByCompletedDdate] = useState(false)
    const [shortByCreationDdate, setshortByCreationDdate] = useState(false)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [spinnerFlag ,setSpinnerFlag] = useState(true)
    var type;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, files.length - page * rowsPerPage);
    useEffect(() => {
        setSpinnerFlag(false)
        if(files.length !==0){
        
           
        }
      
        
        if (JSON.parse(sessionStorage.getItem("resetPage"))) {
            let currentPage = 0
            setPage(currentPage)
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
            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(false)
            setshortByjobdef(!shortByjobdef)
            shortOrder = shortByjobdef

        }
        else if (toggleArrow === 'shortBystate') {
            setshortByjobdef(false)
            setshortByCreationDdate(false)
            setshortById(false)
            setshortBystate(!shortBystate)
            shortOrder = shortBystate
        }
        else if (toggleArrow === 'shortByCreationDdate') {

            setshortByjobdef(false)
            setshortById(false)
            setshortBystate(false)
            setshortByCreationDdate(!shortByCreationDdate)
            shortOrder = shortByCreationDdate
        }

        else if (toggleArrow === 'shortById') {
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

    function onRowClick(selectedId)  {
        setSelectedId(selectedId)
        selectedId =selectedId;
        dispatch(Actions.setSelectedItem(selectedId));
       
    }

    if(spinnerFlag ===true)
    return( 
        <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
        <LinearProgress className="w-xs" color="secondary"/>
      </div>
    );

    if(spinnerFlag === false){
        return (
            <div>
    
                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <TableContainer component={Paper}>
                        <Table className={tableClasses.table} aria-label="custom pagination table">
    
                            <TableHead>
                                <TableRow>
    
                                    <TableCell className="hidden sm:table-cell"> {(shortById) ? <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('id', 'shortById')}> <Icon>arrow_upward</Icon></IconButton> : <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('id', 'shortById')}> <Icon>arrow_downward</Icon></IconButton>}Job Id</TableCell>
                                    <TableCell className="hidden sm:table-cell">{(shortByjobdef) ? <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('job_definition', 'shortByjobdef')}> <Icon>arrow_upward</Icon></IconButton> : <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('job_definition', 'shortByjobdef')}> <Icon>arrow_downward</Icon></IconButton>}Job Type</TableCell>
                                    <TableCell className="hidden sm:table-cell">{(shortBystate) ? <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('state', 'shortBystate')}> <Icon>arrow_upward</Icon></IconButton> : <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('state', 'shortBystate')}> <Icon>arrow_downward</Icon></IconButton>} Status</TableCell>
                                    <TableCell className="text-center hidden sm:table-cell"> {(shortByCreationDdate) ? <IconButton aria-label="arrow_upward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon>arrow_upward</Icon></IconButton> : <IconButton aria-label="arrow_downward" onClick={() => toggleShorting('creation_date', 'shortByCreationDdate')}> <Icon>arrow_downward</Icon></IconButton>}Creation Date</TableCell>
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
                                                </TableCell>
                                                <TableCell>
                                                    {row.job_definition}
                                                </TableCell>
                                                <TableCell  >
                                                    {row.state}
                                                </TableCell>
    
                                                <TableCell >
                                                    {row.creation_date}
                                                </TableCell>
    
                                            </TableRow>
                                        ))
    
                                    }
    
                                    )}
                        
                                </TableBody> : null
                            }
    
                            <TableFooter>
                             
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </FuseAnimate>

                <Button disabled={page * rowsPerPage + 1 === 1} className={'next-button'} color="primary" variant="contained" onClick={fetchPreviousSetData}>Previous</Button><span className={'count-info'}>Total records  {page * rowsPerPage + 1}-{page * rowsPerPage + rowsPerPage} of {contentRange}</span> <Button disabled={page * rowsPerPage + rowsPerPage === contentRange} color="primary" className={'next-button'} variant="contained" onClick={handleChangePage}>Next</Button>
                <span className={'count-info'}>Page - {page + 1}</span>
            </div>
        );
    }
}

export default FileList;
