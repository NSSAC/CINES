/* eslint-disable */
import React from 'react';

import VersionedInputForm from "../../VersionedInputForm"

function CSonNet_Contagion_Simulation(props){
    const versions = {
        "<1.2.10": "v1",
        ">=1.2.10": "v2",
        ">=1.2.10": "v3"
    }
    return <VersionedInputForm versions={versions} module="CSonNet_Contagion_Simulation" {...props} />
}

export default CSonNet_Contagion_Simulation