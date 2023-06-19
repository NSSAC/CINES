import React from 'react';
import { withRouter } from 'react-router-dom';

export const FileManagerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/files/:path*',
            component: withRouter(React.lazy(() => import('./FileManagerApp')))
        }
    ]
};

export const file_viewers_map = {
    "text": React.lazy(() => import('./viewer/text/')),
    "csv": React.lazy(() => import('./viewer/csv/')),
    "csonnet_simulation": React.lazy(() => import('./viewer/csv/')),
    "csonnet_data_analysis": React.lazy(() => import('./viewer/text/')),
    "csonnet_blocking_nodes": React.lazy(() => import('./viewer/text/')),
    "csonnet_initial_states": React.lazy(() => import('./viewer/text/')),
    "dynamical_systems_functions": React.lazy(() => import('./viewer/text/')),
    "dynamical_systems_problems": React.lazy(() => import('./viewer/text/')),
    "dynamical_systems_solutions": React.lazy(() => import('./viewer/text/')),
    "dynamical_systems_initial_config": React.lazy(() => import('./viewer/text/')),
    "json":  React.lazy(() => import('./viewer/json/')),
    // "geographical_region":  React.lazy(() => import('./viewer/json/')),
    "epihiperDiseaseModel":  React.lazy(() => import('./viewer/json/')),
    "epihiperInitialization":  React.lazy(() => import('./viewer/json/')),
    "vegalite+json": React.lazy(() => import('./viewer/vegaliteJSON/')),
    "epihiperIntervention":  React.lazy(() => import('./viewer/json/')),
    "epihiperSimulationSummary": React.lazy(() => import('./viewer/csv/')),
    "epihiperSimulation": React.lazy(() => import('./viewer/csv/')),
    // "epihiperTraits":  React.lazy(() => import('./viewer/json/')),
    "PUNGraph": React.lazy(() => import('./viewer/network/')),
    "PNGraph": React.lazy(() => import('./viewer/network/')),
    "PNEANet": React.lazy(() => import('./viewer/network/')),
    "png": React.lazy(() => import('./viewer/image/')),
    "jpg": React.lazy(() => import('./viewer/image/')),
    "gif": React.lazy(() => import('./viewer/image/')),
    "svg": React.lazy(() => import('./viewer/image/')),
    "pdf": React.lazy(() => import('./viewer/pdf/')),
    "snap_property_list_of_nodes": React.lazy(() => import('./viewer/text/')),
    "snap_property_node_count": React.lazy(() => import('./viewer/text/')),
    "snap_nodeId_float": React.lazy(() => import('./viewer/text/')),
    "snap_TCnComV": React.lazy(() => import('./viewer/text/')),
    "snap_TRnd": React.lazy(() => import('./viewer/text/')),
    "snap_undirected_graph": React.lazy(() => import('./viewer/text/')),
    "snap_TIntPrV": React.lazy(() => import('./viewer/distribution/')),
    "snap_TIntFltH": React.lazy(() => import('./viewer/text/')),
    "snap_TIntPrFltH": React.lazy(() => import('./viewer/text/')),
    "snap_TIntV": React.lazy(() => import('./viewer/text/')),
    "snap_TFltV": React.lazy(() => import('./viewer/text/')),
    "snap_TIntSet": React.lazy(() => import('./viewer/text/')),
    "snap_TIntFltKdV": React.lazy(() => import('./viewer/text/')),
    "snap_TIntFltKd": React.lazy(() => import('./viewer/text/')),
    "snap_TFltPrV": React.lazy(() => import('./viewer/text/')),
    "snap_TIntH": React.lazy(() => import('./viewer/text/')),
    "snap_TFltVFltV": React.lazy(() => import('./viewer/text/')),
    "snap_TFltVTFltV": React.lazy(() => import('./viewer/text/')),
    "snap_TIntTrV": React.lazy(() => import('./viewer/text/')),
    "snap_list_primitive_dataType": React.lazy(() => import('./viewer/text/')),
    "list_primitive_dataType": React.lazy(() => import('./viewer/text/')),
    "snap_TIntStrH": React.lazy(() => import('./viewer/text/')),
    "snap_TGVizLayout": React.lazy(() => import('./viewer/text/')),
    "snap_TIntV_Subgraph": React.lazy(() => import('./viewer/text/')),
    "csonnet_simulation_container": React.lazy(() => import('./viewer/csonnet_simulation_container/')),
    "blacklisted": React.lazy(() => import('./viewer/blacklisted'))
}

export const blacklisted_FileType = ["xlsx","excel"]

export const MAX_RAW_FILE_VIEW_SIZE = 10000000

const FILEUPLOAD_CONFIG = {
    fileTypeToBeRemoved:['folder','symlink'],
    fileTypes:["PUNGraph","PNGraph","PNEANet", "csv","tsv","json","text","dynamical_systems_initial_config","dynamical_systems_problems","dynamical_systems_functions"].sort()
}

export default  FILEUPLOAD_CONFIG;


