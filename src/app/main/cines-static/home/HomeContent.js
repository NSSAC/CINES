import React from 'react';
import {Typography} from '@material-ui/core';
import {FusePageSimple} from '@fuse';
import {FuseAnimate} from '@fuse';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';

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
    const graphicStyle ={
        width: "60%",
        maxWidth: "600px",
        float: "right"   
    }

    const classes = useStyles(props);
    return (
        <FusePageSimple
           
            content={
                <div>
                    <div
                        className={clsx(classes.header, "relative overflow-hidden flex flex-col flex-shrink-0 items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-200")}>

                        <FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
                            <Typography color="inherit" className="text-24 sm:text-40 font-light">
                            Welcome to Net.Science
                            </Typography>
                        </FuseAnimate>

                        

                        {/* <Icon className={classes.headerIcon}>school</Icon> */}
                        <img className={classes.headerIcon} alt="Net.Science logo" src="assets/images/logos/netscience_icon.svg" />
                    </div>
                    <div className="p-16 max-w-full">

                    <Typography className="my-16" component="div">
                            <p className="mb-16">
                            Net.Science is a cyberinfrastructure for network science and engineering. It is community driven resource, bringing together producers 
                            (contributors of software, data, and learning materials) and users.
                            </p>
                            <p className="mb-16">
                            Our goal is to attract individuals and groups from industry, applied R&D and government
    laboratories, educators, college and university students (including undergraduates) across academic disciplines, and high school students.
                            </p>
                            <img style={graphicStyle} alt="net.sciece schematic" src="assets/images/home/homePageGraphics.svg" />
                            <p className="mb-16">
                                The Net.Science backend services provide for file storage and execution of computational tasks.  The computational tasks are made up of serial and parallel computations backed by well-known libraries
                                like SNAP and NetworkX to perform structural analyses on networks.  In addition to these tasks, Net.Science will have a wide variety of tasks for computations including:
                                    <ul className="m-16 ml-28 list-disc">
                                        <li>General-purpose network computations</li>
                                        <li>Data mining</li>
                                        <li>Domain specific analyses</li>
                                        <li>Knowledge graphs for complex logical queries</li>
                                        <li>Reliability polynomials for network resilience</li>
                                        <li>Anomaly detection</li>
                                        
                                    </ul>
                            </p>
                            <p className="mb-16">
                                The backend services are available to the Net.Science WebApp as well as external applications including user scripts.
                            </p>
                            <p>The Net.Science WebApp will allow for the discovery of data sets, networks and tasks of interest to users.  Using these, the user interface (UI) will allow users to submit tasks to perform 
                                analyses on this discovered data as well as their own uploaded data or data shared by other users.  The interface will provide interfaces for manipulation of users' input and output files and for the
                                submission and management of the users' jobs.
                            </p>
                        </Typography>
                    
                    </div>
                </div>
            }
        />
    );
}

export default HomeContent;
