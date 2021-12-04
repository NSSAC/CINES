import React from 'react';
import {Icon,Typography,Tooltip,IconButton } from '@material-ui/core';

import { JsonEditor as Editor } from '../../jsoneditor-react/es';
import JSONTree from 'react-json-tree'


function MetadataPanel(props) {
    const canWrite=false
    function onEditClick(){

    }

    function onSaveClick(){}

    function onCancelClick(){}

    function onModeChange(){}
    function handleUsermetaChange(){}

    return (
        <div className="flex-grow w-full flex flex-col h-full">
                    <div><Typography variant="h6">DISCOVERED META</Typography></div>
                        <JSONTree data={props.meta.autometa} hideRoot={true} theme={{
                            tree: {
                                backgroundColor: '#F7F7F7',
                                paddingRight: '10px',
                                marginLeft: '-15px'
                            },
                            label: {
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                
                            }
                        }} 
                        //  labelRenderer={([key]) => <div style={{whiteSpace: 'nowrap'}}>{key}</div>}
                        // valueRenderer={(raw) => <div>{raw}</div>}
                        />
                        <div><Typography variant="h6" style={{ display: "inline-flex" }}>USER META</Typography>
                            {canWrite && props.editContent && props.isContainer && <Tooltip title="Edit" placement="top">
                                <IconButton onClick={onEditClick}>
                                    <Icon>edit</Icon>
                                </IconButton>
                            </Tooltip>}
                            {!props.editContent && <Tooltip title="Save changes" placement="top">
                                <IconButton onClick={onSaveClick}>
                                    <Icon>save</Icon>
                                </IconButton>
                            </Tooltip>}
                            {!props.editContent && <Tooltip title="Cancel" placement="top">
                                <IconButton onClick={onCancelClick}>
                                    <Icon>cancel</Icon>
                                </IconButton>
                            </Tooltip>}
                        </div>
                        {/* <div> */}
                        {props.editContent && <JSONTree data={props.meta.usermeta} hideRoot={true} theme={{
                            tree: {
                                backgroundColor: '#F7F7F7'
                            },
                            label: {
                                color: 'black',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }
                        }} />}
                        {!props.editContent && <Editor htmlElementProps={{style:{width: "fit-content"}}} mode={Editor.modes.tree} 
                            value={props.meta.usermeta} name={props.meta.name} search={true} allowedModes={[Editor.modes.tree, Editor.modes.form]} history={true} 
                            limitDragging={true} enableSort={false} enableTransform={false} onModeChange={onModeChange} onChange={handleUsermetaChange} />}
                        {/* </div> */}
        </div>    
    )

}

export default MetadataPanel;


