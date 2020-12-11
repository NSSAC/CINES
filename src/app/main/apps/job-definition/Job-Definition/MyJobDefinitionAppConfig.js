import React from 'react';

export const MyJobDefinitionAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/job-definition/*',
            component: React.lazy(() => import('./MyJobDefinitionApp'))
        }
    ]
};
