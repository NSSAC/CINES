import {  LinearProgress, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
// Import css
import filesize from 'filesize';
import moment from 'moment';
import React, { useState } from 'react';


import FileListHeader from "./FileListHeader";
import FileRow from "./FileRow";

import '../Confirm-alert.css';
import '../FileManager.css'

function SimpleFileList(props) {
    const files = props.files
    const selected = props.selected;
    const [sort, setSort] = useState([{attr: "update_date", "dir": "desc"}])
    const [totalFileCount,setTotalFileCount] = useState(0)
    const [loadingFlag , setLoadingFlag] = useState(false)
    const [firstFile, setFirstFile] = useState();

    const selectableTypes=props.selectableTypes || "*"
    const _files = files

    if (_files && _files.length>0 && sort && sort.length>0){
        var attr = sort[0].attr
        var dir = (sort[0].dir==="asc")?[1,-1]:[-1,1]
        _files.sort((a,b)=>{
            if (a[attr]>b[attr]) return dir[0]
            if (a[attr]<b[attr]) return dir[1]
            return 0
        })
    }

    const table_columns = [
        {
            'label': "Name", 
            "attr": "name",
            "sortable": true,
            "headerClass": "",
            "cellClass": "",
            "formatter": (val,obj)=>{
                if ((selectableTypes.indexOf(obj.type)>=0) && (obj.type !== "folder")){
                    return <span className="">{val}</span>
                }else if (obj.isContainer){
                    return <span className="cursor-pointer text-primary" style={{"color": "rgb(97, 218, 251)"}} onClick={(evt)=>{
                        evt.preventDefault(); 
                        if (evt.detail === 1) {
                            var newPath = `${props.folder === "/" ? "" : props.folder}/${val}`;
                            if (props.navigateToFolder) {
                                props.navigateToFolder(newPath);
                            }  
                            if (obj.type === "folder") {
                                setLoadingFlag(true);
                            } else {
                                setLoadingFlag(false);
                            }
                        }   
                    }}>
                        {val}
                    </span>
                } else {
                    return <span className="">{val}</span>
                }
            }
        },
        {
            'label': "Type", 
            "attr": "type",        
            "sortable": true,
            "headerClass": "hidden sm:table-cell",
            "cellClass": "hidden sm:table-cell wordBreak"
        },
        {
            'label': "Size", 
            "attr": "size",
            "sortable": true,
            "headerClass": "hidden sm:table-cell",
            "cellClass": "hidden sm:table-cell wordBreak",
            "formatter": (val,obj)=>{
                if (!val && val!==0){
                    return "-"
                }else{
                    return filesize(val)
                }
            }
        },
        {
            'label': "Last Update", 
            "attr": "update_date",
            "sortable": true,
            "headerClass": "hidden md:table-cell",
            "cellClass": "hidden md:table-cell wordBreak",
            "formatter": (val,obj)=>{
                return moment.utc(val).local().fromNow()
            }
        }
    ]

    React.useEffect(()=>{
        setFirstFile(_files[0])
    },[_files])

    React.useEffect(()=>{
        setLoadingFlag(true);
    },[props.folder])

    React.useEffect(()=>{
        setLoadingFlag(false);
    },[firstFile])

    React.useEffect(()=>{
        if (files){
            setTotalFileCount(files.length)
        }else{
            setTotalFileCount(0)
        }
        // setSelected({})
    },[files])

    function findRow(node){
        if (node.tagName==="TR"){
            return node
        }
        if (!node.parentNode){
            return false
        }
        const parent = node.parentNode
        if (parent.tagName==="TR"){
            return parent
        }
        
        return findRow(parent)
    }

    function getSelectedMeta(id){
        var obj;
        props.files.some((f)=>{
            if (f.id===id){
                obj=f
                return true
            }
            return false
        })
        return obj
    }
    function toggleSelected(id,clear){
        var sel={}
    
        if (!clear){
            sel = { ...selected }
        }else{
            sel[id]=selected[id]
        }

        if (typeof sel[id] === "undefined"){
            sel[id] = true
        }else{
            sel[id]=!sel[id]
        }

        if (sel[id] && selectableTypes!=="*"){
            const meta = getSelectedMeta(id)
            if (selectableTypes.indexOf(meta.type)<0){
                return;
            }
        }

        // setSelected(sel)
        if (props.onSelect){
            props.onSelect(sel)
        }
    }

    function toggleAll(){
        var selectedIds = Object.keys(selected).filter((id) => {return selected[id]})

        if (selectedIds.length>0){
            // setSelected({})
            if (props.onSelect){
                props.onSelect({})
            }
        }else{
            var s={}
            files.forEach((f)=>{
                s[f.id]=true
            })
            // setSelected(s);
            if (props.onSelect){
                props.onSelect(s)
            }
        }

    }

    function onClickRow(evt){
        var clear = (!props.multiple || (!evt.metaKey && !evt.ctrlKey && (evt.target.getAttribute('type')!=="checkbox")))
        var row  = findRow(evt.target)
        if (row && row.id){
            toggleSelected(row.id,clear)
        }        
    }

    function navigateToFolder(path){
        setTimeout(() => {
            if (props.navigateToFolder){
                props.navigateToFolder(path)
            }
        }, 200);
    }

    const linear_progress_loading = (
      <div className="flex flex-1 flex-col items-center justify-center mt-40 mb-40">
        <Typography className="text-20 mt-16" color="textPrimary">Loading</Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );
        
    const selectedIds = Object.keys(selected).filter((id) => {return selected[id]})
    if(loadingFlag) {
        return linear_progress_loading
    }

    if (_files && _files.length>=0){
        return (
                <Table stickyHeader className="rounded border border-black">
                    <FileListHeader 
                        checked={selectedIds.length===totalFileCount} 
                        indeterminate={selectedIds.length>0 && selectedIds.length<totalFileCount} 
                        table_columns={table_columns} 
                        sort={sort}
                        onSort={setSort}
                        toggleAll={toggleAll}
                    />
                    {(_files.length>0)&&(
                        <TableBody onClick={onClickRow} >
                            {_files && _files.map((f)=><FileRow rowClass={props.rowClass||""} key={f.id} table_columns={table_columns} onNavigate={navigateToFolder} selected={selected[f.id]||false} meta={f} />)}
                        </TableBody>
                    )}
                    {(_files.length===0)&&(
                        <TableBody onClick={onClickRow} >
                            <TableRow className={props.rowClass||""}><TableCell colSpan={20} className="text-center text-lg font-semibold">
                                <span>No files / folders found</span>
                            </TableCell></TableRow>
                        </TableBody>
                    )}
                </Table>                        
        )

    }else if (_files && _files.length===0){
       return ( <div className="flex flex-1 flex-col items-center justify-center mt-40">
        <   Typography className="text-20 mt-16" color="textPrimary">Folder is empty</Typography>

        </div> )                                                        

    }else{
        return linear_progress_loading
    }
}

export default SimpleFileList


