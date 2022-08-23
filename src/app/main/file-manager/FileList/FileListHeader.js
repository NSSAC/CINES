import { Checkbox, Icon, IconButton, TableCell, TableHead, TableRow, Tooltip } from '@material-ui/core';
import React from 'react';

function FileListHeader(props) {
    const columns = props.table_columns || []
    const checked = props.checked
    const indeterminate = props.indeterminate
    const sort_map={}
    const sort = props.sort || []
    sort.forEach((s)=>{
        sort_map[s.attr]=s.dir
    })

    function toggleChecked(){
        // setChecked(!checked)
        if (props.toggleAll){
            props.toggleAll()
        }
    }

    function doSort(sort){
        if (props.onSort){
            props.onSort([sort])
        }
    }

    return (
        <TableHead style={{ whiteSpace: 'nowrap'}}>
            <TableRow style={{ backgroundColor: '#F7F7F7 !important'}}>
                {props.enableCheckBoxes && (
                    <TableCell className="selectCheckbox" padding="checkbox">
                        <Checkbox title={`${(checked || indeterminate) ? 'Deselect all' : 'Select all'}`} size='small'
                            onClick={toggleChecked}
                            checked={checked}
                            indeterminate={indeterminate}
                        />
                    </TableCell>
                )}
                <TableCell></TableCell>
                {columns && columns.map((c)=>{
                    return (
                        <TableCell key={c.attr} className={c.headerClass}>
                            {c.infoIconVisibility ? " " : c.label}
                            {(()=>{
                                if (sort_map[c.attr]){
                                    if (sort_map[c.attr]==="asc"){
                                        return (
                                            <Tooltip title={`Sort descending by ${c.label}`} placement="bottom" onClick={()=>doSort({attr: c.attr,dir: "desc"})}>
                                                <IconButton aria-label="arrow_upward">
                                                    <Icon >arrow_upward</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }else if (sort_map[c.attr]==="desc"){
                                        return (
                                            <Tooltip title={`Sort ascending by ${c.label}`} placement="bottom" onClick={()=>doSort({attr: c.attr,dir: "asc"})} >
                                                <IconButton aria-label="arrow_downward">
                                                    <Icon  >arrow_downward</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        )
                                    }
                                }else if(c.infoIconVisibility ){
                                    return (
                                        <></>
                                    )
                                }else {
                                    return (
                                        <Tooltip title={`Sort descending by ${c.label}`} placement="bottom" onClick={()=>doSort({attr: c.attr,dir: "desc"})}>
                                            <IconButton aria-label="arrow_downward">
                                                <Icon style={{opacity:`${props.enableCheckBoxes?'1':'0.3'}`}} className="text-gray-300">arrow_downward</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    )
                                }
                            })()}
                        </TableCell>
                    )
                })}

            {/* <Hidden lgUp>
                <TableCell></TableCell>
            </Hidden> */}
            </TableRow>
        </TableHead>
    )
}

export default FileListHeader


