/* eslint-disable */
import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple} from '@fuse';

function ProjectStructureDoc()
{
    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                            <Icon className="text-18" color="action">home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Publications</Typography>
                            {/* <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Working with Fuse React</Typography> */}
                        </div>
                        <Typography variant="h6">Publications</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">

                <Typography className="mb-8" variant="h5">Links to Educational Materials on Network Science:</Typography>
                <Typography className="mb-8" variant="h6">I. Lecture Notes and Other Material Based on Courses:</Typography>
                <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            R´eka Albert, Pennsylvania State University, State College, PA. Lecture notes for the course
Elements of Network Science and Applications can be downloaded from <a target="_blank" href="https://www.ralbert.me/teaching.html">https://www.ralbert.me/teaching.html</a>.
                            </li>
                            <li className="mb-12">
                            Amir Arjolu, Massachusetts Institute of Technology, Cambridge, MA. Lecture notes and
other materials for the course Introduction to Network Models are available at: <a target="_blank" href="https://
ocw.mit.edu/courses/civil-and-environmental-engineering/1-022-introduction-tonetwork-models-fall-2018/">https://
ocw.mit.edu/courses/civil-and-environmental-engineering/1-022-introduction-tonetwork-models-fall-2018/</a>.
                            </li>
                            
                            <li className="mb-12">
                            
                            Albert-L´aszl´o Barab´asi, Northeastern University, Boston, MA. Online book entitled Network
Science is available at  <a target="_blank" href="http://networksciencebook.com">http://networksciencebook.com</a>.
                            </li>
                            <li className="mb-12">
                            Aaron Clauset, University of Colorado, Boulder, CO. Materials used for the course Network Analysis and Modeling, can be accessed from <a target="_blank" href="http://tuvalu.santafe.edu/~aaronc/courses/5352/#Schedule">http://tuvalu.santafe.edu/~aaronc/courses/5352/#Schedule</a>

                            </li>
                            <li className="mb-12">
                            David Easley and Jon Kleinberg, Cornell University, Ithaca, NY. An online version of the
book Networks, Crowds and Markets: Reasoning About a Connected World, Cambridge University Press, 2010, can be downloaded from <a target="_blank" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf">https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf</a>.
                            </li>
                            <li className="mb-12">
                            Tina Eliassi-Rad, North Eastern University, Boston, MA. Lecture Notes and other material
for the course Introduction to Network Science: Theory, Algorithms, and Applications are
available from: <a target="_blank" href="http://eliassi.org/netsci11.html">http://eliassi.org/netsci11.html.</a>
</li>


                            <li className="mb-12">
                            David Kempe, University of Southern California, Los Angeles, CA. Lecture notes for the
course Structure and Dynamics of Information in Networks are available from <a target="_blank" href="http://david-kempe.com/teaching/structure-dynamics.pdf">http://david-kempe.com/teaching/structure-dynamics.pdf.</a>
                             </li>

                             <li className="mb-12">
                             Natarajan Meghanathan, Jackson State University, Jackson, MS. Materials for the Fall 2019
offering of the course Network Science can be accessed from <a target="_blank" href="http://www.jsums.edu/nmeghanathan/
csc641-fall2019/">http://www.jsums.edu/nmeghanathan/
csc641-fall2019/</a>
                            </li> 

                            <li className="mb-12">
                            S. S. Ravi, University at Albany – State University of New York (UAlbany), Albany, NY.
Course materials for the class Network Science taught during Fall 2015 can be accessed from <a target="_blank" href="https://www.albany.edu/~ravi/csi660_index.html">https://www.albany.edu/~ravi/csi660_index.html</a>
                            </li> 
                            <li className="mb-12">
                            Stanford University, Stanford, CA. Materials for the course Social and Information Network Analysis taught during Autumn 2015 can be accessed from <a target="_blank" href="http://snap.stanford.edu/class/cs224w2015/handouts.html">http://snap.stanford.edu/class/cs224w2015/handouts.html.</a>
                            </li> 
                            <li className="mb-12">
                            Boleslaw Szymanski, Rensselaer Polytechnic Institute (RPI), Troy, NY. Materials for the
Fall 2018 offering of the course Frontiers of Network Science can be accessed from
<a target="_blank" href="http://cs.rpi.edu/~szymansk/fns.18/"> http://cs.rpi.edu/~szymansk/fns.18/.</a>
</li>
<li className="mb-12">
Leonid Zhukov and Ilya Makarov, National Research University, Higher School of Economics,
Moscow, Russia. Materials for the Winter-Spring 2017 offering of the course Network Science
can be accessed from <a target="_blank" href="http://cs.rpi.edu/~szymansk/fns.18/">http://www.leonidzhukov.net/hse/2017/networkscience/#textbooks.</a>
</li>

                        </ol>
                    </Typography>


                    <Typography className="mb-8" variant="h6">II. Links to Video Lectures:</Typography>
                    <ol style={{listStyle: 'square'}} className="pl-12">
                    <li className="mb-12">Video Lecture on Network Science by Renaud Labiotte (Oxford University, UK): <a target="_blank" href="https:
//www.youtube.com/watch?v=L6CqqlILBCI">https:
//www.youtube.com/watch?v=L6CqqlILBCI.</a>
</li>
<li className="mb-12">Video Lecture on Introduction to Network Science by Leonid Zhukov (National Research University Higher School of Economics, Russia): <a target="_blank" href="https://www.youtube.com/watch?v=UHnmPu8Zevg">https://www.youtube.com/watch?v=UHnmPu8Zevg.</a></li>
<li className="mb-12">A number of videos on various aspects of Network Science are available from the Yale Institute
for Network Science: <a target="_blank" href="https://yins.yale.edu/lecture-videos">https://yins.yale.edu/lecture-videos.</a></li>
<li className="mb-12">Several video lectures by Damon Centola on various aspects of Network Science are available from: <a target="_blank" href="https://www.coursera.org/lecture/networkdynamics/2-2-introduction-to-networkscience-VOUwR">https://www.coursera.org/lecture/networkdynamics/2-2-introduction-to-networkscience-VOUwR.</a></li>
</ol>
<Typography className="mb-8" variant="h6">III. Links to Tutorials on Network Science and Related Topics:</Typography>
<ol style={{listStyle: 'square'}} className="pl-12">
<li className="mb-12">Several tutorials by Katya Ognyanova (Rutgers University, New Brunswick, NJ) are available
at: <a target="_blank" href="https://kateto.net/tutorials/">https://kateto.net/tutorials/.</a></li>

<li className="mb-12">A video tutorial entitled “Network Analysis Made Simple” by Eric Ma (DataCamp) is available at: <a target="_blank" href="https://www.youtube.com/watch?v=ED4NZ-4EWRw">https://www.youtube.com/watch?v=ED4NZ-4EWRw</a>.</li>

</ol>

<Typography className="mb-8" variant="h6">IV. Links to Online Courses on Network Science and Related Topics:</Typography>
<ol style={{listStyle: 'square'}} className="pl-12">
<li className="mb-12">A list of courses on Network Science and related topics offered by Coursera is available at: 
<a target="_blank" href="https://www.coursera.org/courses?query=network%20analysis"> https://www.coursera.org/courses?query=network%20analysis.</a></li>
<li className="mb-12">Information regarding a course on Introduction to Network Analysis in Python offered by
DataCamp is available at:  <a target="_blank" href="https://www.datacamp.com/courses/network-analysis-in-pythonpart-1"> https://www.datacamp.com/courses/network-analysis-in-pythonpart-1.</a></li>
<li className="mb-12">Information regarding a course on Social Network Analysis offered by EdX is available at: 
<a target="_blank" href="https://www.edx.org/course/social-network-analysis-sna"> https://www.edx.org/course/social-network-analysis-sna.</a></li>
</ol>


                <Typography className="mb-8" variant="h5">Publications Acknowledging Support from CINES NSF Grant OAC-1916805:</Typography>
                <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            G. Korkmaz,  C. J. Kuhlman,  S. S. Ravi and F. Vega-Redondo, “An Agent-Based Model of Common Knowledge and Collective Action Dynamics on Social Networks,” submitted for publication.
                            </li>
                            <li className="mb-12">
                            R. Kim, J. Gangolly, S. S. Ravi and D. J. Rosenkrantz, “Formal Analysis of Segregation of
Duties (SoD) in Accounting: A Computational Approach,”  to appear in Abacus (A Wiley
Journal of Accounting, Finance and Business Studies).
                            </li>
                            <li className="mb-12">
                            A. Adiga, S. Krauss, O. Maksimov and S. S. Ravi, “Boolean Games: Inferring Agents Goals
Using Taxation Queries,”  to appear in Proc. 2020 International Joint Conference on Artificial
Intelligence (IJCAI-2020).
                            </li>
                            <li className="mb-12">
                            A. Adiga, C. J. Kuhlman, M. V. Marathe, S. S. Ravi, D. J. Rosenkrantz, R. E. Stearns and
A. Vullikanti1, “Bounds and Complexity Results for Learning Coalition-Based Interaction
Functions in Networked Social Systems,”  to appear in Proc. 34th AAAI Conference on
Artificial Intelligence (AAAI-2020).
                            </li>
                            <li className="mb-12">
                             P. Sambaturu,  A. Gupta,  I. Davidson, S. S. Ravi, A. Vullikanti and A. Warren, “Efficient
Algorithms for Generating Provably Near-Optimal Cluster Descriptors for Explainability,”
to appear in Proc. 34th AAAI Conference on Artificial Intelligence (AAAI-2020).
                            </li>
                            <li className="mb-12">
                            D. J. Rosenkrantz,  M. V. Marathe,  S. S. Ravi and R. E. Stearns, “Symmetry Properties of
Nested Canalyzing Functions,”  Discrete Mathematics and Theoretical Computer Science, Vol.
21, No. 4, 2019, 17 pages.
                            </li>

                            <li className="mb-12">Jiayu Li, Fugang Wang, Takuya Araki, Judy Qiu, “Generalized Sparse Matrix-Matrix Multiplication for Vector Engines and Graph Applications,” presented at the MCHPC’19: Workshop on Memory Centric High Performance Computing of SC'19 conference, Denver, Colorado.</li>

                            <li className="mb-12">Langshi Chen, Jiayu Li, Cenk Sahinalp, Madhav Marathe, Anil Vullikanti, Andrey Nikolaev, Egor Smirnov, Ruslan Israfilov, and Judy Qiu, “SubGraph2Vec: Highly-Vectorized Tree-like Subgraph Counting,” presented at the 2019 IEEE International Conference on Big Data, Los Angeles, CA</li>

                            <li className="mb-12"> K. Xu, W. Hu, J. Leskovec, S. Jegelka,"How Powerful Are Graph Neural Networks?," ICLR, 2019.</li>

                            <li className="mb-12">MASA: Motif-Aware State Assignment in Noisy Time Series Data. S. Jain, D. Hallac, R. Sosic, J. Leskovec, KDD Workshop on Mining and Learning from Time Series, KDD, 2019</li>
                            
                        </ol>
                </Typography>
                
               
               
                <Typography className="mb-8" variant="h5">Publications Related to CINES:</Typography>
                <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            S. E. Abdelhamid, R. Alo, S. M. Arifuzzaman, P. Beckman, M. H. Bhuiyan, K. Bisset, E.
A. Fox, G. C. Fox, K. Hall, S. M. S. Hasan, A. Joshi, M. Khan, C. J. Kuhlman, S. Lee,
J. P. Leidig, H. Makkapati, M. V. Marathe, H. S. Mortveit, J. Qiu, S. S. Ravi, Z. Shams,
O. Sirisaengtaksin, R. Subbiah, S. Swarup, N. Trebon, A. Vullikanti and Z. Zhao, “CINET:
A CyberInfrastructure for Network Science”, Proc. 8th IEEE International Conference on
eScience (eScience 2012), Chicago, IL. Oct. 2012, pp. 1–8.

                            </li>
                            <li className="mb-12">
                            S. E. Abdelhamid, M. Alam, R. Alo, S. M. Arifuzzaman, P. Beckman, T. Bhattacharjee, M.
H. Bhuiyan, K. Bisset, S. Eubank, A. Esterline, E. A. Fox, G. C. Fox, S. M. S. Hasan, H.
Hayatnagarkar, M. Khan, C. J. Kuhlman, M. V. Marathe, N. Meghanathan, H. S. Mortveit, J.
Qiu, S. S. Ravi, Z. Shams, O. Sirisaengtaksin, S. Swarup, A. Vullikanti and T. Wu, CINET 2.0:
A CyberInfrastructure for Network Science, Proc. 10th IEEE Intl. Conference on eScience
(eScience 2014), Sao Paulo, Brazil, Oct. 2014, pp. 324–331.

                            </li>
                            <li className="mb-12">
                            C. Dumas, D. LaManna, T. M. Harrison, S. S. Ravi, L. Hagen, C. Kotfila and F. Chen,
“E-petitioning as Collective Political Action in We the People”, Proc. iConference 2015,
Newport Beach, CA, March 2015 (20 pages).

                            </li>
                           
                            <li className="mb-12">
                            C. Dumas, D. LaManna, T. M. Harrison, S. S. Ravi, L. Hagen, C. Kotfila and F. Chen,
“Examining Political Mobilization of Online Communities through E-petitioning Behavior in
We the People”, Big Data and Society (an online journal), Vol. 2, No. 2, July–December
2015, pp. 1–20.



                            </li>                            
                        </ol>
                    </Typography>
                   
                </div>
            }
        />
    );
}

export default ProjectStructureDoc;
