import { Checkbox, Icon, TableCell, TableRow, Hidden, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

import '../FileManager.css'

const useStyles = makeStyles({
    typeIcon: {
        '&.folder:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.epihiperOutput:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.pdf:before': {
            content: "'picture_as_pdf'",
            color: 'red'
        },
        '&.epihiper_multicell_analysis:before': {
            content: "'folder'",
            color: '#FFB300'
        },
        '&.png:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.jpg:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.jpeg:before': {
            content: "'image'",
            color: 'blue'
        },
        '&.mp3:before': {
            content: "'library_music'",
            color: 'blue'
        },
        '&.mp4:before': {
            content: "'video_library'",
            color: 'blue'
        },
        '&.csv:before': {
            content: "'table_chart'",
            color: '#4CAF50'
        },
        '&.excel:before': {
            content: "'table_chart'",
            color: '#4CAF50'
        },
        '&:before': {
            content: "'insert_drive_file'",
            color: '#1565C0'
        }
    }
});

function FileRow(props) {
    const classes = useStyles();
    var meta = props.meta;
    var selected = props.selected
    const columns = props.table_columns || []
    const infoIcon = {
        right: '0',
        backgroundColor: '#F7F7F7',
        position: 'sticky', 
        top: '30px',
        width: '35px',
        paddingLeft: '0px',
        paddingRight: '0px',
    }

    return (
        <TableRow
            role="checkbox"
            // aria-checked={meta.id === selectedItemId}
            key={meta.id}
            id={meta.id}
            hover
            // onClick={onClickRow}
            selected={selected || false}
            className={`${props.rowClass||""} cursor-pointer fileRows`}
        >
            {props.enableCheckBoxes && (
                <TableCell className="selectCheckbox" padding="checkbox">
                    <Checkbox size='small'
                        className="selectCheckbox"
                        checked={selected}
                    />
                </TableCell>
            )}

            <TableCell className="max-w-64 w-64 p-0 text-center align-middle">
                <Icon className={clsx(classes.typeIcon, meta.type)} />
            </TableCell>

            {columns.map((column,idx)=>{
                return (
                    <>
                    {!column.infoIconVisibility ? 
                    (<TableCell key={idx} className={column.cellClass}>{column.formatter?column.formatter(meta[column.attr],meta):meta[column.attr]}</TableCell>) : 
                     <Hidden mdUp>
                     <TableCell style={infoIcon} key={idx} className={column.cellClass}>
                        <IconButton
                            onClick={(ev) => {console.log("open sidebar")}}
                            aria-label="open right sidebar"
                        >
                        <Icon>info</Icon>
                        </IconButton>
                     </TableCell>
                 </Hidden>
                } 
                    </>
                )
            
            })}
        </TableRow>
    )

}

export default FileRow;


