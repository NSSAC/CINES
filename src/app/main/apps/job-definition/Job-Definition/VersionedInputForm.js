import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import semver  from 'semver';

import withReducer from 'app/store/withReducer';

import reducer from './store/reducers';

function VersionedInputForm(props) {
    const history = useHistory()
    
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
        history.replace(`${props.location.pathname}?version=default`)
    }else if (formVersion && VForm && job_definition){
        let clearDynamicProps = false
        if(!window.formVersion){
            window.formVersion = formVersion
        }
        if(window.formVersion !== formVersion){
            if(props.localResubmit && props.localResubmit.input){
                props.localResubmit.input['dynamicProps'] = undefined
                props.localResubmit.input['dynamic_inputs'] = undefined
                props.localResubmit.input['rules'] = undefined
                // props.localResubmit.input['states'] = undefined
                if(props.localResubmit.input['submodelArrayData']){
                    props.localResubmit.input['submodelArrayData'] = undefined
                }
                clearDynamicProps = true
            }
            window.formVersion = formVersion
        }
        return (
            <VForm { ...props } job_definition={job_definition} formVersion={formVersion}/>  
        )
    }else{
        return <div>Loading form version...</div>
    }

}

export default withReducer('JobDefinitionApp', reducer)(VersionedInputForm);
