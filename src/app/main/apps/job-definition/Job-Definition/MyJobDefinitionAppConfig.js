import queryString from "query-string"
import React from 'react';
import { Redirect } from 'react-router-dom';

const generate_static_form_route = (name,options) => {
    options = options || {}
    var path = `/apps/job-definition/:namespace*/${name}`
    var out = {
        "path": path,
        "render": (props)=>{
            var namespace = props.match.params.namespace || "global";

            if (!options.namespaces){
                return <Redirect to="/pages/errors/error-400"/>
            }

            if (options.namespaces.indexOf(namespace)<0){
                return <Redirect to="/pages/errors/error-400"/>
            }
            var params = queryString.parse(props.location.search)

            // var Comp = React.lazy(()=> import(`./static-forms/${name}/`))
            var Comp = React.lazy(()=> import('./JobDefinitionView'))
            var jd = options.job_definition?options.job_definition:name
            return (
                <Comp namespaces={options.namespaces} namespace={namespace} module={name} static_form={true} jobdef={jd} version={params.version||"default"}   {...props.match.params} {...props}/> 
            )
        }
    }

    return out;
}

export const MyJobDefinitionAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: ['user'],
    routes  : [
        generate_static_form_route("CSonNet_Generate_Blocking_Nodes",{
            "namespaces": ["development"]
        }),

        generate_static_form_route("CSonNet_Contagion_Simulation",{
            "namespaces": ["development","net.science"]
        }),

        // {
        //     path: "/apps/jobdefs/",
        //     component: React.lazy(() => import('./JobLauncher'))
        // },
 
        {
            path: "/apps/job-definition/:namespace*/:module",
            // component: React.lazy(() => import('./MyJobDefinitionApp'))
            render: (props) =>{
                var namespace = props.match.params.namespace || "global";
                var module = props.match.params.module
    
                var params = queryString.parse(props.location.search)
                var Comp = React.lazy(()=> import('./JobDefinitionView'))
                // console.log("In Router - Job Definition: ", module, "Namespace: ", namespace, "version: ", params.version)
                return (
                    <Comp namespace={namespace} jobdef={module} version={params.version||"default"} {...props.match.params} {...props} /> 
                )
            }
        },
        {
            path: "/apps/job-definition/",
            component: React.lazy(() => import('./JobDefinitionListView'))
        }
    ]
};
 