import { Icon, IconButton,Button, Tooltip, Typography } from '@material-ui/core';
import React, {useState} from 'react';
import EditFileProperty from '../dialogs/EditFileProperty'
import panel_config from './MetadataPanelConfig'
import {confirmAlert} from "react-confirm-alert"
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import withReducer from "app/store/withReducer";
import * as Perms from '../permissions';

function matchField(prop,field_config){
    var match;

    if (field_config.some((fd)=>{
        // console.log(`Checking ${prop} against ${fd.match}`)
        var matches = prop.match(fd.match)
        if (matches){
            match={
                "field_config": fd,
                "matches": matches
            }
            return true
        }
        return false
    })){
        return match
    }else{
        return false
    }
}

function groupProperties(file,field_config=[],group_config=[]){
    var group_data={'default': []}
    const metadata_types=["autometa","usermeta"]
    // console.log("Metadata Types: ", metadata_types)
    metadata_types.forEach((metadata_type)=>{
        // console.log("metadata type: ", metadata_type)
        const obj = file[metadata_type] || {};
        // console.log("Obj: ", obj)
        Object.keys(obj).forEach((prop)=>{
            const matched = matchField(prop,field_config)
            if (matched){
                var grp = (matched && matched.field_config && matched.field_config.group)?matched.field_config.group:'default'
                if (!group_data[grp]){
                    group_data[grp] = []
                }
                var label;
                if (matched.field_config.label){
                    if (typeof matched.field_config.label == 'function'){
                        label = matched.field_config.label(prop,matched)
                    }else{
                        label = matched.field_config.label
                    }
                }else if (matched.matches[1]){
                    label = matched.matches[1]
                }else{
                    label = prop
                }
                group_data[grp].push({field: prop, label: label, type: metadata_type, match: {...matched}})
            }else{
                group_data['default'].push({field: prop,label: prop,type: metadata_type, match: {}})
            }
        })
    })


    group_config.forEach((grp)=>{
        const group_name = grp.group
        const members = group_data[group_name] 
        if (!members){return}
        if (grp.field_order){
            var undefinedMembers = members.filter((member)=>{
                if (grp.field_order.indexOf(member.field)>=0){
                    return false
                }else{
                    return true
                }
            }).map((umem)=>{
                return umem.field
            })    
            grp.field_order = (grp.field_order||[]).concat(undefinedMembers)
        }else{
            grp.field_order = members.map((m)=>m.field)
        }

        var sorted_members = []

        grp.field_order.forEach((field)=>{
            members.some((member)=>{
                if (member.field===field){
                    sorted_members.push(member)
                    return true
                }
                return false
            })
        })
        group_data[group_name] = sorted_members;
    })
    // console.log("group_data: ", group_data)
    return group_data
}

function MetadataPanel(props) {
    const dispatch = useDispatch()
    const user = useSelector(({auth}) => auth.user)

    const [editProperty,setEditProperty] = useState()
    const [propertyValue,setPropertyValue] = useState()
    const [showPropEditorDialog,setShowPropEditorDialog] = useState(false)
    const group_config = props.group_config || panel_config.group_config
    const field_config = props.field_config || panel_config.field_config 
    const groups = groupProperties(props.meta,field_config,group_config)
    const undefinedGroups = Object.keys(groups).filter((group_name)=>{
        if (group_config.some((grp)=>{return grp.group===group_name})){
            return false
        }
        return true
    }).map((group_name)=>{
        return {group: group_name}
    })

    function showAddPropDialog(property,value){
        if (property){
            setEditProperty(property)
        }else{
            setEditProperty()
        }

        if (value){
            setPropertyValue(value)
        }else{
            setPropertyValue()
        }

        setShowPropEditorDialog(true)
    }

    function removeUsermetaProperty(prop){
        confirmAlert({
            title: "Are you sure?",
            message: `Remove '${prop}' from ${props.meta.name}`,
            buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    dispatch(Actions.removeUsermetaProp(props.meta,prop))
                  }
                },
                {
                  label: 'Cancel'
                }
              ]
        })
    }


    const group_list = group_config.concat(undefinedGroups)
    const canWrite = Perms.canWriteFile(props.meta,user)

    return (
        <div className="flex-grow w-full flex flex-col h-full">
            {canWrite && <div><Button className="m-auto" variant="contained" color="primary" onClick={()=>{showAddPropDialog()}}>Add Property</Button></div>}
            <table>
                <tbody>{group_list.map((grp)=>{
                        const group_name = grp.group
                        const members = groups[group_name]
                        if (!members || members.length<1){
                            return null
                        }
                        const label = (typeof grp.label !== "undefined")?grp.label:group_name
                        return (
                                <React.Fragment key={group_name}><tr className={`p-8 ${label?'border-b border-gray-400 ':''} font-bold uppercase`}><td colSpan={3} className="pt-16 pl-4"><span>{(typeof grp.label !== "undefined")?grp.label:group_name}</span></td></tr>
                                {members && members.filter((member)=>{
                                    return typeof props.meta[member.type][member.field] !== 'undefined'
                                }).map((member, idx)=>{
                                    const label = member.label
                                    const val = (member && member.match && member.match.field_config && member.match.field_config.formatter)?member.match.field_config.formatter(props.meta[member.type][member.field]):props.meta[member.type][member.field]
                                    return (
                                        <React.Fragment key={idx}>
                                             {(member.type==="autometa") && <tr title={member.field} key={`${group_name}-${idx}a`}><td className="font-semibold capitalize"><span>{label}</span></td><td><span colSpan={2}>{val}</span></td></tr>}        
                                             {(member.type==="usermeta") && (
                                                <tr title={member.field} key={`${group_name}-${idx}a`}>
                                                    <td className="font-semibold capitalize"><span>{label}</span></td>
                                                    <td><span>{val}</span></td>
                                                    <td className="w-min-content cursor-pointer">
                                                        {canWrite && (<React.Fragment><Icon onClick={()=>{showAddPropDialog(member.field, props.meta[member.type][member.field])}}>edit</Icon><Icon onClick={()=>{removeUsermetaProperty(member.field)}}>highlight_off</Icon></React.Fragment>)}
                                                    </td>
                                                </tr>
                                             )}
                                        </React.Fragment>
                                    )
                                })}
                            </React.Fragment>
                        )})}</tbody>
            </table>
            {showPropEditorDialog && <EditFileProperty file={{...props.meta}} property={editProperty} value={propertyValue} handleClose={()=>{setShowPropEditorDialog(false); setEditProperty(); setPropertyValue();}} />}
        </div>    
    )
}

export default withReducer("fileManagerApp", reducer)(MetadataPanel);


