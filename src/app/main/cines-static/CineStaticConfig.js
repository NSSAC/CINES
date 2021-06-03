import React from 'react';

export const CineStaticConfig = {
    routes: [
        {
            path     : '/home',
            component: React.lazy(() => import('./home/HomeContent'))
        },
        {
            path     : '/about',
            component: React.lazy(() => import('./about/AboutContent'))
        },
        {
            path     : '/collaborators',
            component: React.lazy(() => import('./collaborators/CollaboratorsContent'))
        },
        {
            path     : '/publications',
            component: React.lazy(() => import('./publications/PublicationsContent'))
        },
        {
            path      : '/announcements/websci-12',
            component : React.lazy(() => import('./announcements/WebSci21Content'))
        }
        
    ]
};

