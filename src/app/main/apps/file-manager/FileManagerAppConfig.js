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
            path     : '/apps/files/*',
            component: withRouter(React.lazy(() => import('./FileManagerApp')))
        }
    ]
};
