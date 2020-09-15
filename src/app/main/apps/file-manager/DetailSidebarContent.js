import React, {useState, useEffect} from 'react';
import {Hidden, Typography,Tabs,Tab, Icon, IconButton} from '@material-ui/core';
import { Edit, InsertDriveFile as FileIcon, ListAlt as MetadataIcon, History as ProvenanceIcon, Share as ShareIcon, Computer  } from "@material-ui/icons";
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useSelector, useDispatch} from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import filesize from 'filesize';
import * as Actions from './store/actions';
import JSONTree from 'react-json-tree'
import Tooltip from "@material-ui/core/Tooltip";
import instance from  'app/services/sciductService/sciductService.js'
import { JsonEditor as Editor } from './jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { isEqual } from 'lodash';
import { ToastsStore, ToastsContainer, ToastsContainerPosition } from 'react-toasts';

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
    }});

function DetailSidebarContent(props)
{   
    const dispatch = useDispatch()
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [editUserMeta, setEditUserMeta] = useState(false);
    const [UsermetaSuccess, setUsermetaSuccess] = useState(false);
    const [UsermetaError, setUsermetaError] = useState(false);
    const files = useSelector(({fileManagerApp}) => fileManagerApp.files);
    const selectedItem = useSelector(({fileManagerApp}) => files[fileManagerApp.selectedItemId]);
    var token=localStorage.getItem('id_token')
    var path = window.location.pathname.replace("/apps/files", "")
    var editItem=localStorage.getItem('editItem')
    var canWrite = false;
    var modifiedUsermeta = "";

    useEffect(() => {
        if(document.getElementsByClassName("jsoneditor-mode-form").length >0){
            document.getElementsByClassName("jsoneditor")[0].scrollIntoView()
        }
       })

    const tableStyle={
        overflow: 'hidden',
        maxWidth: '220px',
        textOverflow: 'ellipsis',
        display:'block',
        whiteSpace: 'nowrap'
    }

    if(editItem && selectedItem){
        if(editItem !== selectedItem.id)
           props.setEditContent(true)
    }
      
    if ( selectedItem )
    {
        modifiedUsermeta = selectedItem.usermeta;
    }
    
    if ( !selectedItem )
    {
        return null;
    }
        
    function OnModeChange() {
        if(document.getElementsByClassName("jsoneditor-mode-tree").length >0){
            document.getElementsByClassName("jsoneditor")[0].scrollIntoView()}

        if(document.getElementsByClassName("jsoneditor-mode-form").length >0){
            document.getElementsByClassName("jsoneditor")[0].scrollIntoView()
        }
    }

    function handleTabChange(event, value)
    {
        setSelectedTab(value);
    }

    function handleUsermetaChange(value){
        modifiedUsermeta = value
        console.log(modifiedUsermeta)
      }

    function OnEditClick(){
        localStorage.setItem("editItem", selectedItem.id)
        props.setEditContent(false)
    }

    function OnSaveClick(){
        diffInMeta(selectedItem.usermeta, modifiedUsermeta)
        props.setEditContent(true)
    }

    function OnCancelClick(){
        props.setEditContent(true)
    }

    const diffInMeta =(obj1, obj2) => {
        var changedObj = {};
        var newObj = {};
        var removedKeys = [];
        
        if (Object.is(obj1, obj2)) {
            changedObj = undefined;
            newObj = undefined;
            removedKeys = []
        }
    
        else{
            let ChangedKeys = (Object.keys(obj2)).filter(x => (Object.keys(obj1)).includes(x));
            ChangedKeys.forEach(x =>{if(!isEqual(obj2[x], obj1[x])){
                                        changedObj[x] = obj2[x]
                                    }})
        
            let newKeys = (Object.keys(obj2).filter(x => !(Object.keys(obj1).includes(x))))
            newKeys.forEach(x => newObj[x] = obj2[x])
        
            removedKeys = (Object.keys(obj1).filter(x => !(Object.keys(obj2).includes(x))))
        }
        console.log(changedObj)
            console.log(newObj)
            console.log(removedKeys)
    
        StoreData(changedObj, newObj, removedKeys)
    }

    const StoreData = (changedObj, newObj, removedKeys) =>{
        var data = []
    
        if(changedObj !== undefined && changedObj !== {}){
        Object.keys(changedObj).forEach(x=>{
            var obj = {}
            obj['op'] = "replace"
            obj['path']= `/usermeta/${x}`
            obj['value']= changedObj[x]
    
            data.push(obj)
        })}
    
        if(newObj !== undefined && newObj !== {}){
        Object.keys(newObj).filter(x=>x !== "").forEach(x=>{
            var obj = {}
            obj['op'] = "add"
            obj['path']= `/usermeta/${x}`
            obj['value']= newObj[x]
    
            data.push(obj)
        })}
    
        if(removedKeys.length > 0){
        removedKeys.forEach(key=>{
            var obj = {}
            obj['op'] = "remove"
            obj['path']= `/usermeta/${key}`
            data.push(obj)
        })}
        console.log(data)
        usermetaApi(data)
     }
    
     const usermetaApi = (data) => {
        var axios = require('axios');
    
        if(data.length > 0){
        var config = {
            method: 'patch',
            url: `https://sciduct.bii.virginia.edu/filesvc/file${path}` + `${selectedItem.name}` ,
            headers: { 
              'Content-Type': 'application/json-patch+json', 
              'Authorization': token 
             },
            data : data
          };
    
          axios(config)
          .then((response)=> {
            dispatch(Actions.getFiles(path, 'GET_FILES'));
            setUsermetaSuccess(true)
            setTimeout(() => {
                setUsermetaSuccess(false)
            }, 3500);
          })
          .catch(function (error) {
            setUsermetaError(true)
            setTimeout(() => {
                setUsermetaError(false)
            }, 3500);
          });
        }
     }

    if(token !==null){
        for(var team in instance.getTokenData().teams){
            for(var writeRights in selectedItem.writeACL){
                if(team === writeRights){
                       canWrite = true
                       break;
                }
            }
        }
        if(instance.getTokenData().sub === selectedItem.owner_id){
            canWrite = true
         }      
    }

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={200}>

            <div className="file-details p-16 sm:p-24">

                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    className="w-full mb-32"
                >
                    <Tab
                        icon={<FileIcon alt="File Info"/>}
                        className="min-w-0"
                        title="File Information"

                    />
                    <Tab
                        className="min-w-0"
                        icon={<MetadataIcon alt="Metadata"/>}
                        title="Metadata"
                    />
                    <Tab
                        className="min-w-0"
                        icon={<ProvenanceIcon alt="File Provenance"/>}
                        title="File Provenance"

                    />
                    <Tab
                        className="min-w-0"
                        icon={<ShareIcon alt="Sharing Permissions"/>}
                        title="Sharing Permissions"
                    />
                </Tabs>

                {selectedTab === 0 && (
                    <React.Fragment>
                        <div><Typography variant="h6">INFORMATION</Typography></div>
                        <table className={clsx(classes.table, "w-full, text-left")}>

                            <tbody>
                                <tr className="state">
                                    <th>State</th>
                                    <td title={selectedItem.state}>{selectedItem.state}</td>
                                </tr>
                                <tr className="type">
                                    <th>Type</th>
                                    <td title={selectedItem.type}>{selectedItem.type}</td>
                                </tr>

                                <tr className="size">
                                    <th>Size</th>
                                    <td title={selectedItem.size}>{(!selectedItem.size && (selectedItem.size !== 0)) ? '-' : filesize(selectedItem.size)}</td>
                                </tr>
                                <tr className="owner">
                                    <th>Owner&nbsp;&nbsp;</th>
                                    <td title={selectedItem.owner_id} >{selectedItem.owner_id}</td>
                                </tr>

                                <tr className="MD5">
                                    <th>MD5</th>
                <td> {<div style={tableStyle} title={selectedItem.hash}>{selectedItem.hash}</div>}</td>
                                </tr>
                            </tbody>
                        </table>
                    </React.Fragment>
                )}

                {selectedTab === 1 && (
                    <React.Fragment>
                        <div><Typography variant="h6">DISCOVERED META</Typography></div>
                        <JSONTree data={selectedItem.autometa} hideRoot={true} theme={{
                                                                        tree: {
                                                                          backgroundColor: '#F7F7F7'
                                                                         },
                                                                        label : {
                                                                            color: 'black',
                                                                            fontSize:'14px',
                                                                            fontWeight: 'bold'
                                                                        },
                                                                     }}/>
                        <div><Typography variant="h6" style={{display:"inline-flex"}}>USER META</Typography> 
                          {canWrite && <Tooltip title="Edit" placement="top">
                            <IconButton onClick={OnEditClick}>
                              <Icon>edit</Icon>   
                            </IconButton>
                          </Tooltip>}
                          {!props.editContent && <Tooltip title="Save changes" placement="top">
                            <IconButton onClick={OnSaveClick}>
                              <Icon>save</Icon>   
                            </IconButton>
                          </Tooltip>}
                          {!props.editContent && <Tooltip title="Cancel" placement="top">
                            <IconButton onClick={OnCancelClick}>
                              <Icon>cancel</Icon>   
                            </IconButton>
                          </Tooltip>}
                        </div>
                        <div>{props.editContent && <JSONTree data={selectedItem.usermeta} hideRoot={true} theme={{
                                                                        tree: {
                                                                          backgroundColor: '#F7F7F7'
                                                                         },
                                                                        label : {
                                                                            color: 'black',
                                                                            fontSize:'14px',
                                                                            fontWeight: 'bold'
                                                                        }
                          }}/>}
                          {!props.editContent && <Editor mode={Editor.modes.form} value={selectedItem.usermeta} name={"root"} search={true} allowedModes={[Editor.modes.form, Editor.modes.tree]} history={true} limitDragging={true} enableSort={false} enableTransform={false} onModeChange={OnModeChange} onChange={handleUsermetaChange}/>}
                        </div>
                    </React.Fragment>
                )}

                {UsermetaSuccess && 
                   <div> {ToastsStore.success(`'${selectedItem.name}'` + " Usermeta modified successfully")}
                        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
                }

                {UsermetaError && 
                   <div> {ToastsStore.error("An error occurred. Please try again.")}
                        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/></div>
                }

                {selectedTab === 2 && (
                    <React.Fragment>
                        <div><Typography variant="h6">PROVENANCE</Typography></div>
                        <JSONTree data={selectedItem.provenance} hideRoot={true} theme={{
                                                                        tree: {
                                                                          backgroundColor: '#F7F7F7'
                                                                         },
                                                                        label : {
                                                                            color: 'black',
                                                                            fontSize:'14px',
                                                                            fontWeight: 'bold'
                                                                        },
                                                                     }}/>
                    </React.Fragment>
                )}

                {selectedTab === 3 && (
                    <React.Fragment>
                        <table className={clsx(classes.table, "w-full, text-left")}>
                            <tbody>
                                <tr className="owner">
                                    <th>Owner</th>
                                    <td title={selectedItem.owner_id}>{selectedItem.owner_id}</td>
                                </tr>
                                <tr className="readacl">
                                    <th>Read ACL</th>
                                    <td title={selectedItem.readACL.join(", ")}>{selectedItem.readACL.join(", ")}</td>
                                </tr>
                                <tr className="writeacl">
                                    <th>Write ACL</th>
                                    <td title={selectedItem.writeACL.join(", ")}>{selectedItem.writeACL.join(", ")}</td>
                                </tr>
                                <tr className="writeacl">
                                    <th>Compute ACL</th>
                                    <td title={selectedItem.computeACL.join(", ")}>{selectedItem.computeACL.join(", ")}</td>
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
