/* eslint-disable */
import React from 'react';

import VersionedInputForm from "../../VersionedInputForm"

function CSonNet_Generate_Blocking_Nodes(props){
    const versions = {
        ">=0.0.0": "v1"
    }
    console.log("CGS Main props: ", props)
    return <VersionedInputForm versions={versions} module="CSonNet_Generate_Blocking_Nodes" {...props} />
}

export default CSonNet_Generate_Blocking_Nodes