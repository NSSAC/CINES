import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple} from '@fuse';

function DevelopmentDoc()
{
    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                            <Icon className="text-18" color="action">home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Home</Typography>
                            {/* <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Working with Fuse React</Typography> */}
                        </div>
                        <Typography variant="h6">Home</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">
                    <Typography className="mb-8" variant="h5">Vision:</Typography>
                    {/* <div style={{paddingBottom: "15px",fontWeight: '700'}}>
                        <h3>Vision</h3>
                    </div> */}

                    <Typography className="mb-16" component="p">
                    CINES (pronounced “science”) is a self-sustaining cyberinfrastructure that will be a community resource for network science. CINES is an extensible platform for producers and consumers
of network science data, information, and software. Domain scientists can use CINES to obtain
interesting insights to advance their fields
                    </Typography>
                    <Typography className="mb-16" component="p">
                    Major components of CINES include a messaging infrastructure to route job requests and other data/information; infrastructure services for system
monitoring, security, continuous testing, and resource management (for submitting jobs), among
others; common (app) services such as a digital library and visualization; various applications that
will include web apps, individual codes, desktop apps, and software libraries; a workflow engine to
compose common services and apps; a user interface (UI) for interactive use through a browser;
and an API to service third party software requests.
                    </Typography>
                    <Typography className="mb-8" variant="h5">Sponsor: </Typography>
                    <Typography className="mb-16" component="p">
                    National Science Foundation (NSF) – Grant No.: OAC-1916805 (https://www.nsf.gov/
awardsearch/showAward?AWD_ID=1916805&HistoricalAwards=false)
</Typography>


                    {/* <Typography className="my-16" component="div">
                        <ol>
                            <li className="mb-16">
                                The most important one is not to touch the /@fuse directory but sometimes that is going to be inevitable and in those cases, try to keep the
                                modifications minimal.
                            </li>
                            <li className="mb-16">
                                Usually React and Material UI libraries do some breaking changes and force our hands to change things. In those cases, it's always good to
                                check their official Changelogs to see what they did. Usually they provide clear instructions and even helper tools to update your code.
                            </li>
                            <li className="mb-16">
                                Before starting your new project,
                                <a href="http://support.withinpixels.com/github" target="_blank" rel="noreferrer noopener" className="mx-4 font-bold">
                                    join our Github repo
                                </a>
                                , fork it and build your app on top of that fork. This way, in the future, you can easily
                                merge or compare the changes from the main repo onto your fork. This will require merging a lot of changes manually,
                                but it's the best way to keep the Fuse React updated.
                            </li>
                        </ol>
                    </Typography> */}
                </div>
            }
        />
    );
}

export default DevelopmentDoc;
