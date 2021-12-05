// import { Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import React from 'react';

import panel_config from './MetadataPanelConfig'

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
    const autometa = file.autometa
    var group_data={'default': []}
    Object.keys(autometa).forEach((prop)=>{
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
            group_data[grp].push({field: prop, label: label, match: {...matched}})
        }else{
            group_data['default'].push({field: prop,label: prop, match: {}})
        }
    })

    group_config.forEach((grp)=>{
        const group_name = grp.group
        const members = group_data[group_name]
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
    return group_data
}

function MetadataPanel(props) {
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

    const group_list = group_config.concat(undefinedGroups)

    return (
        <div className="flex-grow w-full flex flex-col h-full">
            <table>
                <tbody>{group_list.map((grp)=>{
                        const group_name = grp.group
                        const members = groups[group_name]
                        const label = (typeof grp.label !== "undefined")?grp.label:group_name
                        return (
                                <React.Fragment key={group_name}><tr className={`p-8 ${label?'border-b border-gray-400 ':''} font-bold uppercase`}><td colSpan="2" className="pt-16 pl-4"><span>{(typeof grp.label !== "undefined")?grp.label:group_name}</span></td></tr>
                                {members.filter((member)=>{
                                    return typeof props.meta.autometa[member.field] !== 'undefined'
                                }).map((member, idx)=>{
                                    const label = member.label
                                    const val = (member && member.match && member.match.field_config && member.match.field_config.formatter)?member.match.field_config.formatter(props.meta.autometa[member.field]):props.meta.autometa[member.field]
                                    return <tr title={member.field} key={`${group_name}-${idx}`}><td className="font-semibold capitalize"><span>{label}</span></td><td><span>{val}</span></td></tr>  
                                })}
    
                        </React.Fragment>)})}</tbody>
            </table>
        </div>    
    )
}

export default MetadataPanel;


