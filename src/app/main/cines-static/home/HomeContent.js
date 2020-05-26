import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple, FuseHighlight} from '@fuse';
import {FuseAnimate, FuseAnimateGroup} from '@fuse';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    header    : {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color     : theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position     : 'absolute',
        top          : -64,
        left         : 0,
        opacity      : .04,
        fontSize     : 512,
        width        : 512,
        height       : 512,
        pointerEvents: 'none'
    }
}));

function HomeContent(props)
{
    const graphicContainerStyle ={
        display: "flex",
        justifyContent: "center"
    }
    const graphicStyle ={
        width: "60%"   
    }

    const classes = useStyles(props);
    return (
        <FusePageSimple
           
            content={
                <div>
                    <div
                className={clsx(classes.header, "relative overflow-hidden flex flex-col flex-shrink-0 items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-288")}>

                <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                    <Typography color="inherit" className="text-24 sm:text-40 font-light">
                    Welcome to Net.Science
                    </Typography>
                </FuseAnimate>

                

                <Icon className={classes.headerIcon}>school</Icon>
            </div>
                <div className="p-24 max-w-2xl">
                <Typography className="my-16" style={graphicContainerStyle} component="div"> 
                <img style={graphicStyle} src="assets/images/home/homePageGraphics.png" />
                </Typography>
                <Typography className="my-16" component="div">
                        <ol>
                            <li className="mb-16">
                            Net.science is a cyberinfrastructure for network science and engineering.
                            </li>
                            <li className="mb-16">
                            Net.science is a community resource, bringing together producers (contributors of software, (network) data, and learning materials) and consumers (users).
                            </li>
                            <li className="mb-16">
                            Our goal is to attract individuals and groups from industry, applied R&D and government
laboratories, educators, college and university students (including undergraduates) across academic disciplines, and high school students.
                            </li>
                            <li className="mb-16">
                            Net.science will have serial and parallel applications, and uses well-known libraries like SNAP and NetworkX, to perform structural analyses on networks.
                            </li>
                            <li className="mb-16">
                            Net.science will have a wide variety of applications for anomaly detection, reliability polynomials for network resilience, knowledge graphs for complex logical queries, data mining software, and much more, for general-purpose network computations and for domain-specific applications.
                            </li>
                            <li className="mb-16">
                            The net.science web app will permit users to search for data sets, networks, and applications and can use results to submit jobs.
                            </li>
                            <li className="mb-16">
                            Users can submit jobs using a UI (user interface) or, for large numbers of jobs, can write scripts to interact directly with the net.science API.
                            </li>
                            <li className="mb-16">
                            Net.science will have many services for user authentication, security, and permissions;
file management; searching; and job submission and tracking.
                            </li>
                        </ol>
                    </Typography>





                    {/* <Typography className="mb-8" variant="h5">Vision:</Typography>
                    
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
</Typography> */}
                   
                </div>
                </div>
            }
        />
    );
}

export default HomeContent;
