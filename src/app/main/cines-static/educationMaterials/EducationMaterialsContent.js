import React from 'react';

import { Icon, Typography } from '@material-ui/core';
import { FusePageSimple } from '@fuse';

import { useHistory } from "react-router-dom";

function EducationProjectStructDoc() {

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
                            <Typography color="textSecondary">Education Materials</Typography>
                        </div>
                        <Typography variant="h6">Education Materials</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">
                    <Typography className="mb-8" variant="h5"><b>Links to Educational Materials on Network Science</b></Typography>
                    <Typography className="mb-8" variant="h6">I. Lecture Notes and Other Material Based on Courses:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                    R´eka Albert, Pennsylvania State University, State College, PA. Lecture notes for the course
    Elements of Network Science and Applications can be downloaded from <a target="_blank" rel="noopener noreferrer" href="https://www.ralbert.me/teaching.html">https://www.ralbert.me/teaching.html</a>.
                            </li>
                            
                            <li className="mb-12">
                                    Amir Arjolu, Massachusetts Institute of Technology, Cambridge, MA. Lecture notes and
    other materials for the course Introduction to Network Models are available at: <a target="_blank" rel="noopener noreferrer" href="https://ocw.mit.edu/courses/civil-and-environmental-engineering/1-022-introduction-to-network-models-fall-2018/">https://ocw.mit.edu/courses/civil-and-environmental-engineering/1-022-introduction-to-network-models-fall-2018/</a>.
                            </li>

                            <li className="mb-12">
                                    Albert-L´aszl´o Barab´asi, Northeastern University, Boston, MA. Online book entitled Network
    Science is available at  <a target="_blank" rel="noopener noreferrer" href="http://networksciencebook.com">http://networksciencebook.com</a>.
                            </li>

                            <li className="mb-12">
                                    Aaron Clauset, University of Colorado, Boulder, CO. Materials used for the course Network Analysis and Modeling, can be accessed from <a target="_blank" rel="noopener noreferrer" href="http://tuvalu.santafe.edu/~aaronc/courses/5352/#Schedule">http://tuvalu.santafe.edu/~aaronc/courses/5352/#Schedule</a>
                            </li>

                            <li className="mb-12">
                                    David Easley and Jon Kleinberg, Cornell University, Ithaca, NY. An online version of the
    book Networks, Crowds and Markets: Reasoning About a Connected World, Cambridge University Press, 2010, can be downloaded from <a target="_blank" rel="noopener noreferrer" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf">https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf</a>.
                            </li>

                            <li className="mb-12">
                                    Tina Eliassi-Rad, North Eastern University, Boston, MA. Lecture Notes and other material
                                    for the course Introduction to Network Science: Theory, Algorithms, and Applications are
    available from: <a target="_blank" rel="noopener noreferrer" href="http://eliassi.org/netsci11.html">http://eliassi.org/netsci11.html.</a>
                            </li>

                            <li className="mb-12">
                                    David Kempe, University of Southern California, Los Angeles, CA. Lecture notes for the
    course Structure and Dynamics of Information in Networks are available from <a target="_blank" rel="noopener noreferrer" href="http://david-kempe.com/teaching/structure-dynamics.pdf">http://david-kempe.com/teaching/structure-dynamics.pdf.</a>
                            </li>

                            <li className="mb-12">
                                    Natarajan Meghanathan, Jackson State University, Jackson, MS. Materials for the Fall 2019
    offering of the course Network Science can be accessed from <a target="_blank" rel="noopener noreferrer" href="http://www.jsums.edu/nmeghanathan/
    csc641-fall2019/">http://www.jsums.edu/nmeghanathan/
    csc641-fall2019/</a>
                            </li>

                            <li className="mb-12">
                                    S. S. Ravi, University at Albany – State University of New York (UAlbany), Albany, NY.
    Course materials for the class Network Science taught during Fall 2015 can be accessed from <a target="_blank" rel="noopener noreferrer" href="https://www.albany.edu/~ravi/csi660_index.html">https://www.albany.edu/~ravi/csi660_index.html</a>
                            </li>

                            <li className="mb-12">
                                    Stanford University, Stanford, CA. Materials for the course Social and Information Network Analysis taught during Autumn 2015 can be accessed from <a target="_blank" rel="noopener noreferrer" href="http://snap.stanford.edu/class/cs224w-2015/handouts.html">http://snap.stanford.edu/class/cs224w-2015/handouts.html.</a>
                            </li>

                            <li className="mb-12">
                                    Boleslaw Szymanski, Rensselaer Polytechnic Institute (RPI), Troy, NY. Materials for the
                                    Fall 2018 offering of the course Frontiers of Network Science can be accessed from
    <a target="_blank" rel="noopener noreferrer" href="http://cs.rpi.edu/~szymansk/fns.18/"> http://cs.rpi.edu/~szymansk/fns.18/.</a>
                            </li>

                            <li className="mb-12">
                                    Leonid Zhukov and Ilya Makarov, National Research University, Higher School of Economics,
                                    Moscow, Russia. Materials for the Winter-Spring 2017 offering of the course Network Science
    can be accessed from <a target="_blank" rel="noopener noreferrer" href="http://www.leonidzhukov.net/hse/2017/networkscience/#textbooks">http://www.leonidzhukov.net/hse/2017/networkscience/#textbooks.</a>
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h6">II. Links to Video Lectures:</Typography>
                    <ol style={{ listStyle: 'square' }} className="pl-12">
                        <li className="mb-12">Video Lecture on Network Science by Renaud Labiotte (Oxford University, UK): <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=L6CqqlILBCI">https://www.youtube.com/watch?v=L6CqqlILBCI.</a>
                        </li>
                        <li className="mb-12">Video Lecture on Introduction to Network Science by Leonid Zhukov (National Research University Higher School of Economics, Russia): <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=UHnmPu8Zevg">https://www.youtube.com/watch?v=UHnmPu8Zevg.</a></li>
                        <li className="mb-12">A number of videos on various aspects of Network Science are available from the Yale Institute
for Network Science: <a target="_blank" rel="noopener noreferrer" href="https://yins.yale.edu/lecture-videos">https://yins.yale.edu/lecture-videos.</a></li>
                        <li className="mb-12">Several video lectures by Damon Centola on various aspects of Network Science are available from: <a target="_blank" rel="noopener noreferrer" href="https://www.coursera.org/lecture/networkdynamics/2-2-introduction-to-networkscience-VOUwR">https://www.coursera.org/lecture/networkdynamics/2-2-introduction-to-networkscience-VOUwR.</a></li>
                    </ol>
                    
                    <Typography className="mb-8" variant="h6">III. Links to Tutorials on Network Science and Related Topics:</Typography>
                    <ol style={{ listStyle: 'square' }} className="pl-12">
                        <li className="mb-12">Several tutorials by Katya Ognyanova (Rutgers University, New Brunswick, NJ) are available
at: <a target="_blank" rel="noopener noreferrer" href="https://kateto.net/tutorials/">https://kateto.net/tutorials/.</a></li>

                        <li className="mb-12">A video tutorial entitled “Network Analysis Made Simple” by Eric Ma (DataCamp) is available at: <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=ED4NZ-4EWRw">https://www.youtube.com/watch?v=ED4NZ-4EWRw</a>.</li>

                    </ol>

                    <Typography className="mb-8" variant="h6">IV. Links to Online Courses on Network Science and Related Topics:</Typography>
                    <ol style={{ listStyle: 'square' }} className="pl-12 mb-40">
                        <li className="mb-12">A list of courses on Network Science and related topics offered by Coursera is available at:
<a target="_blank" rel="noopener noreferrer" href="https://www.coursera.org/courses?query=network%20analysis"> https://www.coursera.org/courses?query=network%20analysis.</a></li>
                        <li className="mb-12">Information regarding a course on Introduction to Network Analysis in Python offered by
DataCamp is available at:  <a target="_blank" rel="noopener noreferrer" href="https://www.datacamp.com/courses/network-analysis-in-pythonpart-1"> https://www.datacamp.com/courses/network-analysis-in-pythonpart-1.</a></li>
                        <li className="mb-12">Information regarding a course on Social Network Analysis offered by EdX is available at:
<a target="_blank" rel="noopener noreferrer" href="https://www.edx.org/course/social-network-analysis-sna"> https://www.edx.org/course/social-network-analysis-sna.</a></li>
                    </ol>
                </div>
            }
        />
    )
}

export default EducationProjectStructDoc;