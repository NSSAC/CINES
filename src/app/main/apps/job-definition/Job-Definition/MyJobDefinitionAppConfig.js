import React from 'react';

export const MyJobDefinitionAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: ['user'],
    routes  : [
        {
            path     : '/apps/job-definition/*',
            component: React.lazy(() => import('./MyJobDefinitionApp'))
        }
    ]
};
