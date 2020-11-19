import React from 'react';

export const MyJobsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/my-jobs/*',
            component: React.lazy(() => import('./MyJobsApp'))
        }
    ]
};
