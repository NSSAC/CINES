import React from 'react';

import { Icon, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse';

import { useHistory } from "react-router-dom";

function CoursesProjectStructDoc() {

    const history = useHistory();

    function navigateHome() {
        history.push('/home/')
    }

    return(
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                            <Icon className="text-18 cursor-pointer" color="action" onClick={navigateHome}>home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Courses, Short Courses, and Workshops</Typography>
                        </div>
                        <Typography variant="h6">Courses, Short Courses, and Workshops</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">
                    <Typography className="mb-8" variant="h5"><b>Courses and Short Courses Taught Using net.science</b></Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                Albert Esterline, North Carolina A&T, Summer, 2021: Virtual Data Science and Analytics Research Experiences For Undergraduates (REU), funded by the NSA and NSF, offered by the Department of Mathematics and Statistics, the Department of Computer Science, and the NSF ACE Data Science & Analytic Program, Summer 2021. (Professor Esterline and a Professor from the Math Department at NCAT had three students working on epidemics on networks. These students were introduced  to net.science.)
                            </li>

                            <li className="mb-12">
                                Albert Esterline, North Carolina A&T, Fall Semester, 2021: COMP 871 – Advanced Network Science (Graduate course)
                            </li>

                            <li className="mb-12">
                                Natarajan Meghanathan, Jackson State University, Fall Semester, 2021: CSC 641 – Network Science  (Graduate course)
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h5"><b>Workshops and Tutorials Taught on net.science</b></Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                Golda Barrow, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “Interactive Demonstrations and Use of the net.science Cyberinfrastructure for Network Science,” ½ day tutorial at Web Science 2021 Conference,  22 June 2021.
                            </li>

                            <li className="mb-12">
                                Golda Barrow, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, Three network science presentations at the Virginia Tech–hosted Achievable Dream Program for High School Students, week of 12-16 July 2021.
                            </li>

                            <li className="mb-12">
                                Golda Barrow, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “Using the net.science Cyberinfrastructure in Research on Social Contact Networks and Discrete Dynamical Systems,” ½ day tutorial at the ASONAM 2021 Conference, 8 November 2021.
                            </li>

                            <li className="mb-12">
                                Golda Barrow, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “Interactive Demonstrations and Research Use of the net.science Cyberinfrastructure for Network Science,” 2-hour tutorial at the Big Data Conference, 16 December 2021.
                            </li>
                        </ol>
                    </Typography>
                </div>
            }
        />
    )
}

export default CoursesProjectStructDoc;