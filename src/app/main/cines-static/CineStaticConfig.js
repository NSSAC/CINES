import React from 'react';
// import layout1 from 'app/fuse-layouts/layout1/Layout1Config';
export const CineStaticConfig = {
    routes: [
        {
            path    :'/search',
            component: React.lazy(() => import('./search/SearchContent'))
        },
        {
            path     : '/home',
            component: React.lazy(() => import('./home/HomeContent'))
        },
        {
            path     : '/about',
            component: React.lazy(() => import('./about/AboutContent'))
        },
        {
            path     : '/contact',
            component: React.lazy(() => import('./contact/ContactContent'))
        },
        {
            path     : '/collaborators',
            component: React.lazy(() => import('./collaborators/CollaboratorsContent'))
        },
        {
            path     : '/education-materials',
            component: React.lazy(() => import('./educationMaterials/EducationMaterialsContent'))
        },
        {
            path     : '/courses-shortcourses-workshops',
            component: React.lazy(() => import('./coursesWorkshops/CoursesWorkshopsContent'))
        },
        {
            path     : '/publications',
            component: React.lazy(() => import('./publications/PublicationsContent'))
        },
        {
            path      : '/announcements/websci-12',
            component : React.lazy(() => import('./announcements/WebSci21Content'))
        }
        
    ],
    settings: {
        layout          : {
            style : 'layout2', // layout-1 layout-2 layout-3
            config: {
                mode          : 'fullwidth',
                scroll        : 'content',
                navbar        : {
                    display: true
                },
                toolbar       : {
                    display : true,
                    position: 'below'
                },
                footer        : {
                    display: true,
                    style  : 'static'
                },
                leftSidePanel : {
                    display: true
                },
                rightSidePanel: {
                    display: true
                }
            }
        }
    }
};

