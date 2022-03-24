/* eslint-disable */
import { Icon, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from "react-router-dom";
import { FusePageSimple } from '@fuse';

function ProjectStructureDoc() {

    const history = useHistory();

    function navigateHome() {
        history.push('/home/')
    }

    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                            <Icon className="text-18 cursor-pointer" color="action" onClick={navigateHome}>home</Icon>
                            <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Publications</Typography>
                        </div>
                        <Typography variant="h6">Publications</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">

                    <Typography className="mb-8 mt-4" variant="h5"><b>Publications Acknowledging Support from CINES NSF Grant OAC-1916805</b></Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12 mb-40">
                            <li className="mb-12">
                                C. J. Kuhlman, G. Korkmaz, S. S. Ravi and F. Vega-Redondo, “An Agent-Based Model of Common Knowledge and Collective Action Dynamics on Social Networks,” Winter Simulation Conference (WSC), 2020, pp. 218–229.
                            </li>
                            <li className="mb-12">
                                R. Kim, J. Gangolly, S. S. Ravi and D. J. Rosenkrantz, “Formal Analysis of Segregation of
                                Duties (SoD) in Accounting: A Computational Approach,”  Abacus (A Wiley
                                Journal of Accounting, Finance and Business Studies), Vol. 56, No. 2, 2020, pp. 165–212.
                            </li>
                            <li className="mb-12">
                                A. Adiga, S. Krauss, O. Maksimov and S. S. Ravi, “Boolean Games: Inferring Agents Goals
                                Using Taxation Queries,”   Proc. 2020 International Joint Conference on Artificial
                                Intelligence (IJCAI-2020), pp. 1585–1591.
                            </li>
                            <li className="mb-12">
                                A. Adiga, C. J. Kuhlman, M. V. Marathe, S. S. Ravi, D. J. Rosenkrantz, R. E. Stearns and
                                A. Vullikanti1, “Bounds and Complexity Results for Learning Coalition-Based Interaction
                                Functions in Networked Social Systems,”   Proc. 34th AAAI Conference on
                                Artificial Intelligence (AAAI-2020), pp. 3138–3145.
                            </li>
                            <li className="mb-12">
                                P. Sambaturu,  A. Gupta,  I. Davidson, S. S. Ravi, A. Vullikanti and A. Warren, “Efficient
                                Algorithms for Generating Provably Near-Optimal Cluster Descriptors for Explainability,”
                                Proc. 34th AAAI Conference on Artificial Intelligence (AAAI-2020), pp. 1636–1643.
                            </li>
                            <li className="mb-12">
                                D. J. Rosenkrantz,  M. V. Marathe,  S. S. Ravi and R. E. Stearns, “Symmetry Properties of
                                Nested Canalyzing Functions,”  Discrete Mathematics and Theoretical Computer Science, Vol.
                                21, No. 4, 2019, 17 pages.
                            </li>

                            <li className="mb-12">
                                Keith Bisset, Jose Cadena, Maleq Khan, Chris J. Kuhlman, Agent-Based Computational Epidemiological Modeling,” Journal of the Indian Institute of Science (IISc), Springer,  Vol. 101, Issue 3, 2021, pp. 303–327.
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h5"><b>Publications Related to the Net.Science Cyberinfrastructure</b></Typography>
                    <Typography className="mb-8" variant="h6">I. Works on cyberinfrastructure:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                Nesreen K. Ahmed, Richard A. Alo, Catherine T. Amelink, Young Yun Baek, Aashish Chaudhary, Kristy Collins, Albert C. Esterline, Edward A. Fox, Geoffrey C. Fox, Aric Hagberg, Ron Kenyon, Chris J. Kuhlman, Jure Leskovec, Dustin Machi, Madhav V. Marathe, Natarajan Meghanathan, Yasuo Miyazaki, Judy Qiu, Naren Ramakrishnan, S. S. Ravi, Ryan A. Rossi, Rok Sosic, Gregor von Laszewski, “net.science: A Cyberinfrastructure for Sustained Innovation in Network Science and Engineering,” Gateways Conference, 2020, 4 pages.
                            </li>

                            <li className="mb-12">
                                Lucas Machi, Henry L. Carscadden, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “Automated Generation of Stand-Alone Source Codes for Software Libraries,” 30th International Conference on Software Engineering and Data Engineering (SEDE), 2021, pp. 80–89.
                            </li>

                            <li className="mb-12">
                                Henry L. Carscadden, Lucas Machi, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “GraphTrans: A Software System for Network Conversions for Simulation, Structural Analysis, and Graph Operations,” Winter Simulation Conference (WSC), 2021, 12 pages.
                            </li>

                            <li className="mb-12">
                                Henry L. Carscadden, Lucas Machi, Aparna Kishore, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “ExecutionManager: A Software System to Control Execution of Third-Party Software That Performs Network Computations,” Winter Simulation Conference (WSC), 2021, 12 pages.
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h6">II. Works on software tasks within net.science:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                Aparna Kishore, Lucas Machi, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “A Framework for Simulating Multiple Contagions Over Multiple Networks,” The 10th International Conference on Complex Networks and their Applications (Complex Networks), 2021, pp. 241–252.
                            </li>
                            <li className="mb-12">    
                                Joshua D. Priest, Aparna Kishore, Lucas Machi, Chris J. Kuhlman, Dustin Machi, and S. S. Ravi, “CSonNet: An Agent-Based Modeling Software System for Discrete Time Simulation,” Winter Simulation Conference (WSC), 2021,  12 pages. Nominated for best paper award.
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h6">III. Works on applications:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
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

                            <li className="mb-12">
                                Joshua D. Priest, Madhav V. Marathe, S. S. Ravi, Daniel J. Rosenkrantz and Richard E. Stearns, “Evolution of Similar Configurations in Graph Dynamical Systems”, The 9th International Conference on Complex Networks and their Applications (ComplexNetworks), 2020, pp. 544–555.
                            </li>

                            <li className="mb-12">
                                Rosemary Kim, Jagdish Gangolly, S. S. Ravi and Daniel J. Rosenkrantz, “Formal Analysis of Segregation of Duties (SoD) in Accounting: A Computational Approach”, Abacus (A WileyJournal of Accounting, Finance and Business Studies), Vol. 56, No. 2, June 2020, pp. 165–212.
                            </li>

                            <li className="mb-12">
                                Abhijin Adiga, Chris J. Kuhlman, Madhav V. Marathe, S. S. Ravi, Daniel J. Rosenkrantz, Richard E. Stearns and Anil K. Vullikanti, “Bounds and Complexity Results for Learning Coalition-Based Interaction Functions in Networked Social Systems,” Proc. 32nd AAAI Conference on Artificial Intelligence (AAAI-2020), New York, NY, Feb. 2020, pp. 3138–3145.
                            </li>

                            <li className="mb-12">
                                Henry L. Carscadden, Chris J. Kuhlman, Madhav V. Marathe, S. S. Ravi, and Daniel J. Rosenkrantz, “Blocking the Propagation of Two Simultaneous Contagions over Networks,” The 9th International Conference on Complex Networks and their Applications (Complex Networks), 2020, pp. 455–468.
                            </li>

                            <li className="mb-12">
                                Chris J. Kuhlman, Gizem Korkmaz, S. S. Ravi, and Fernando Vega-Redondo, “Effect of Interaction Mechanisms on Facebook Dynamics Using a Common Knowledge Model,” The 9th International Conference on Complex Networks and their Applications (Complex Networks), 2020, pp. 395–407.
                            </li>

                            <li className="mb-12">
                            Chris J. Kuhlman, Achla Marathe, Anil Vullikanti, Nafisa Halim, and Pallab Mozumder, “Natural Disaster Evacuation Modeling: The Dichotomy of Fear of Crime and Social Influence,” Social Network Analysis and Mining (SNAM),  Vol. 12, No. 1, 2022, pp. 1–18.
                            </li>

                            <li className="mb-12">
                                Chris J. Kuhlman, Gizem Korkmaz, S. S. Ravi, and Fernando Vega-Redondo, “Theoretical and Computational Characterizations of Interaction Mechanisms on Facebook Dynamics Using a Common Knowledge Model” Social Network Analysis and Mining (SNAM),  Vol . 11, No. 1, 2021, pp. 1–19.
                            </li>

                            <li className="mb-12">
                                Matthew Hancock, Nafisa Halim, Chris J. Kuhlman, Achla Marathe, Pallab Mozumder, S. S. Ravi, and Anil Vullikanti, “Data-Driven Modeling of Evacuation Decision-Making in Extreme Weather Events,” The 10th International Conference on Complex Networks and their Applications (Complex Networks), 2021, pp. 681–692.
                            </li>

                            <li className="mb-12">
                                Matthew Hancock, Nafisa Halim, Chris J. Kuhlman, Achla Marathe, Pallab Mozumder, S. S. Ravi, and Anil Vullikanti, “Effect of Peer Influence and Looting Concerns on Evacuation Behavior During Natural Disasters,” The 10th International Conference on Complex Networks and their Applications (Complex Networks), 2021, pp. 377–389.
                            </li>
                        </ol>
                    </Typography>

                    <Typography className="mb-8" variant="h6">IV. Software and Analyses to Support net.science Computational Codes:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{ listStyle: 'square' }} className="pl-12">
                            <li className="mb-12">
                                Jiayu Li, Fugang Wang, Takuya Araki, Judy Qiu, “Generalized Sparse Matrix-Matrix Multiplication for Vector Engines and Graph Applications,” presented at the MCHPC’19: Workshop on Memory Centric High Performance Computing of SC'19 conference, Denver, Colorado.
                            </li>

                            <li className="mb-12">
                                Langshi Chen, Jiayu Li, Cenk Sahinalp, Madhav Marathe, Anil Vullikanti, Andrey Nikolaev, Egor Smirnov, Ruslan Israfilov, and Judy Qiu, “SubGraph2Vec: Highly-Vectorized Tree-like Subgraph Counting,” presented at the 2019 IEEE International Conference on Big Data, Los Angeles, CA, pp. 483–492.
                            </li>

                            <li className="mb-12">
                                K. Xu, W. Hu, J. Leskovec, S. Jegelka,"How Powerful Are Graph Neural Networks?," ICLR, 2019, 17 pages.
                            </li>

                            <li className="mb-12">
                                MASA: Motif-Aware State Assignment in Noisy Time Series Data. S. Jain, D. Hallac, R. Sosic, J. Leskovec, KDD Workshop on Mining and Learning from Time Series, KDD, 2019.
                            </li>

                            <li className="mb-12">
                                C. Widanage, W. Liu, J. Li, H. Chen, X. Wang, H. Tang, J. Fox, HySec-Flow: Privacy-Preserving Genomic Computing with SGX-based Big-Data Analytics Framework, in the Proceedings of IEEE 14th International Conference on Cloud Computing (CLOUD), September 5-11, 2021, pp. 733–743.
                            </li>

                            <li className="mb-12">
                                B. Peng, J. Li, S. Akkas, T. Araki, O. Yoshiyuki, J. Qiu, “Rank Position Forecasting in Car Racing”, in the Proceedings of 35th IEEE International Parallel & Distributed Processing Symposium (IPDPS21), May 17‐21, 2021, pp. 724–733.
                            </li>
                        </ol>
                    </Typography>
                </div>
            }
        />
    );
}

export default ProjectStructureDoc;