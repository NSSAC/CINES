import { Icon, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import clsx from 'clsx';
import React from 'react';

import { FuseHighlight, FusePageSimple } from '@fuse';
import { FuseAnimate, FuseAnimateGroup } from '@fuse';

const useStyles = makeStyles(theme => ({
    header: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
        color: theme.palette.getContrastText(theme.palette.primary.main)
    },
    headerIcon: {
        position: 'absolute',
        top: -64,
        left: 0,
        opacity: .04,
        fontSize: 512,
        width: 512,
        height: 512,
        pointerEvents: 'none'
    }
}));

function WebSci21Content(props) {
    const graphicContainerStyle = {
        display: "flex",
        justifyContent: "center"
    }
    const graphicStyle = {
        width: "60%",
        maxWidth: "600px",
        float: "right"
    }

    const classes = useStyles(props);
    return (
        <FusePageSimple

            content={
                <div>
                    <div style={{'backgroundImage': 'url(assets/images/cines/city_networks.jpg)'}}
                        className={clsx(classes.header, "relative overflow-hidden flex flex-col flex-shrink-0 items-center justify-center text-center p-0 sm:p-24 h-200 sm:h-200 bg-cover")}>
                    </div>
                    <div className="p-16 w-3/4 text-center items-center ml-auto mr-auto">
                        <img  className="w-2/6 ml-auto mr-auto" alt="Net.Science logo" src="assets/images/logos/netscience_tall.png" />
                        <Typography className="my-16" variant="h4" component="h5">
                            Interactive Demonstration and Use of the net.science Cyberinfrastructure for Network Science
                        </Typography>
                        <Typography className="my-16" variant="h5" component="h5">
                            Half-Day Tutorial at the Web Science 2021 Conference
                        </Typography>
                        <Typography className="my-16" variant="h5" component="h5">
                            22 June 2021
                        </Typography>
                        <Typography className="my-16" variant="h5" component="h5">
                            1 pm EDT Eastern Daylight Time (North America) UTC−04
                        </Typography>
                    </div>
                    <div className="p-16 w-4/5 items-center ml-auto mr-auto">
                        <Typography className="my-16" variant="body2" component="div">
                            <Typography className="my-16" variant="h6" component="h6">Tutorial motivation.</Typography>
                            <p>Cyberinfrastructures and gateways are software systems that are accessible by researchers and students for performing wide-ranging computations on data. There are well over 600 gateways, but none is devoted to network science in general. This situation exists despite the fact that much of built infrastructures (e.g., power, water, communications) are networks, and humans form many types of online and face-to-face (social) networks. The myriad computations performed on networks make them a prime candidate for general-purpose computational tools.</p>

                            <Typography className="my-16" variant="h6" component="h6">Who should attend.</Typography>
                            <p>Those generating and analyzing networks. Researchers, students, student-researchers interested in networks and computations on networks. Those working in fields such as engineering, science, social sciences, history, psychology, finance, economics, data science, and mathematics.</p>

                            <Typography className="my-16" variant="h6" component="h6">Participation requirements.</Typography>
                            <ul className="my-16 ml-24 list-decimal">
                                <li>A laptop with a browser (we highly recommend one of Chrome, FireFox, Edge, or Safari).</li>
                                <li>A working knowledge of networks is helpful, but not required.</li>
                            </ul>

                            <Typography className="my-16" variant="h6" component="h6">Summary of activities.</Typography>
                            <ul className="my-16 ml-24 list-decimal">
                                <li>Short overview description of net.science cyberinfrastructure and navigation.</li>
                                <li>Hands-on demonstrations of operations on networks using net.science.</li>
                                <li>Attendees are provided accounts and execute the demonstrations themselves, and explore other features of the system.</li>
                                <li>Q&A (questions and answers) throughout the tutorial.</li>
                                <li>Your feedback: what additional features would be useful to you?</li>
                            </ul>

                            <Typography className="my-16" variant="h6" component="h6">Learning objectives.</Typography>
                            <ul className="my-16 ml-24 list-decimal">
                                <li>Learn how networks arise in different contexts.</li>
                                <li>Learn to use the net.science cyberinfrastructure.</li>
                                <li>Learn how structural properties of networks are helpful in understanding the process that forms a network.</li>
                                <li>Learn how networks are used in various disciplines.</li>
                            </ul>

                            <Typography className="my-16" variant="h6" component="h6">Related web pages.</Typography>
                            <ul className="my-16 ml-24 list-decimal">
                                <li>WebSci 2021 conference home page (<a href="https://websci21.webscience.org/">https://websci21.webscience.org/</a>)</li>
                                <li>WeSci 2021 tutorials page (<a href="https://websci21.webscience.org/tutorials/">https://websci21.webscience.org/tutorials/</a>)</li>
                                <li>Net.science cyberinfrastructure home page (<a href="https://net.science/home">https://net.science/home</a>)</li>
                            </ul>

                            <Typography className="my-16" variant="h6" component="h6">Presenters/Organizers.</Typography>
                            <Typography className="my-8" variant="body2" component="div">
                                <p><span className="font-bold">Dustin Machi</span> is a Senior Software Architect at University of Virginia (UVA), led the design and development of the PATRIC BVBRC genomics tool (<a href="https://www.patricbrc.org/">https://www.patricbrc.org/</a>) that currently has over 10,000 users and has received continuous NIH funding for 20 years.  He is also the architectural lead for the net.science CI.  He has been closely involved with developing workshops and learning materials for PATRIC BVBRC.</p>
                            </Typography>
                            <Typography className="my-8" variant="body2" component="div">
                                <p><span className="font-bold">S. S. Ravi</span> is a Distinguished Teaching Professor Emeritus, University at Albany -- State University of New York, where he taught computer science for 32 years.  He is now a Research Professor at UVA.  He has taught network science courses for over ten years, and has developed learning materials for network science software tools.  He has developed several computational tools for net.science while mentoring students.</p>
                            </Typography>
                            <Typography className="my-8" variant="body2" component="div">
                                <p><span className="font-bold">Golda Barrow</span> is a Program Advisor on several projects at UVA, including this net.science project.  She performs a range of functions, such as leading Internal Review Board (IRB) submissions, specifying web page content, and guiding workshop development.</p>
                            </Typography>
                            <Typography className="my-8" variant="body2" component="div">
                                <p><span className="font-bold">Chris Kuhlman</span> is a Research Associate Professor at UVA.  He has constructed and guided the development of net.science tools and computational tasks used within net.science.  He guides research with MS and PhD students, and has given several tutorials on network science and computation.  The four people mentioned above work together in the Biocomplexity Institute & Initiative (BII) of UVA.</p>
                            </Typography>
                        </Typography>

                    </div>
                </div>
            }
        />
    );
}

export default WebSci21Content;
