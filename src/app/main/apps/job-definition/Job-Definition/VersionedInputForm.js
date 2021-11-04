import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import semver  from 'semver';

import withReducer from 'app/store/withReducer';

import reducer from './store/reducers';

function VersionedInputForm(props) {

    const [VForm, setVForm] = useState(false);
    const [formVersion,setFormVersion] = useState(false)

    const job_definition = props.job_definition;
    useEffect(() => {
        if (formVersion && props.module){
            setVForm(React.lazy(() => import(`./static-forms/${props.module}/${formVersion}/`)))
        }
    },[formVersion,props.module])

    useEffect(() => {
        if (!props.version || props.version==="default"){ return }

        var form_version=false
        if(Object.keys(props.versions).some(function(avail_version){
            if(semver.satisfies(semver.coerce(props.version), avail_version)){
                form_version = props.versions[avail_version]
                return true
            }
            return false;
        })){
            setFormVersion(form_version);
        }else{
            return <Redirect to="/pages/errors/error-400"/>
        }
    },[props.version, props.versions])


    if (job_definition && job_definition.failed){
        return <Redirect to={`${props.location.pathname}?version=default`} />
    }else if (formVersion && VForm && job_definition){
        console.log("VersionInputForm props: ", props)
        return (
            <VForm { ...props } job_definition={job_definition} />  
        )
    }else{
        return <div>Loading form version...</div>
    }

}

export default withReducer('JobDefinitionApp', reducer)(VersionedInputForm);
