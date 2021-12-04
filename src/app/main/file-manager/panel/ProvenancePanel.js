import React from 'react';
import {Typography } from '@material-ui/core';

import JSONTree from 'react-json-tree'


function ProvenancePanel(props) {
    return (
        <div className="flex-grow w-full flex flex-col h-full">
                <div><Typography variant="h6">PROVENANCE</Typography></div>
                {props.meta.provenance ? <JSONTree data={props.meta.provenance} hideRoot={true} theme={{
                    tree: {
                        backgroundColor: '#F7F7F7'
                    },
                    label: {
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    },
                }} /> : null}
        </div>    
    )
}

export default ProvenancePanel;


