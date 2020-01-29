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
                <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            Reka Albert, Elements of Network Science and Applications. Lecture Notes can be downloaded from <a target="_blank" href="https://www.ralbert.me/teaching.html">https://www.ralbert.me/teaching.html</a>.
                            </li>
                            <li className="mb-12">
                            Albert-Lazlo Barabasi, Network Science, online book available at <a target="_blank" href="http://networksciencebook.com">http://networksciencebook.com</a>.
                            </li>
                            <li className="mb-12">
                            David Easley and Jon Kleinberg, Networks, Crowds and Markets: Reasoning About a Connected World, Cambridge University Press, 2010. An online version of this book can be downloaded from <a target="_blank" href="https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf">https://www.cs.cornell.edu/home/kleinber/networks-book/networks-book.pdf</a>.
                            </li>
                           
                            <li className="mb-12">
                            S. S. Ravi, Course materials used to teach a class on Network Science at the University at Albany State University of New York during Fall 2015 can be accessed from <a target="_blank" href="https://www.albany.edu/~ravi/csi660_index.html">https://www.albany.edu/~ravi/csi660_index.html</a>
                            </li>                            
                        </ol>
                    </Typography>
                <Typography className="mb-8" variant="h5">Publications Related to CINES:</Typography>
                <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            S. E. Abdelhamid, R. Alo, S. M. Arifuzzaman, P. Beckman, M. H. Bhuiyan, K. Bisset, E.
A. Fox, G. C. Fox, K. Hall, S. M. S. Hasan, A. Joshi, M. Khan, C. J. Kuhlman, S. Lee,
J. P. Leidig, H. Makkapati, M. V. Marathe, H. S. Mortveit, J. Qiu, S. S. Ravi, Z. Shams,
O. Sirisaengtaksin, R. Subbiah, S. Swarup, N. Trebon, A. Vullikanti and Z. Zhao, \CINET:
A CyberInfrastructure for Network Science", Proc. 8th IEEE International Conference on
eScience (eScience 2012), Chicago, IL. Oct. 2012, pp. 1-8.

                            </li>
                            <li className="mb-12">
                            S. E. Abdelhamid, M. Alam, R. Alo, S. M. Arifuzzaman, P. Beckman, T. Bhattacharjee, M.
H. Bhuiyan, K. Bisset, S. Eubank, A. Esterline, E. A. Fox, G. C. Fox, S. M. S. Hasan, H.
Hayatnagarkar, M. Khan, C. J. Kuhlman, M. V. Marathe, N. Meghanathan, H. S. Mortveit, J.
Qiu, S. S. Ravi, Z. Shams, O. Sirisaengtaksin, S. Swarup, A. Vullikanti and T.Wu, CINET 2.0:
A CyberInfrastructure for Network Science, Proc. 10th IEEE Intl. Conference on eScience
(eScience 2014), Sao Paulo, Brazil, Oct. 2014, pp. 324-331.

                            </li>
                            <li className="mb-12">
                            C. Dumas, D. LaManna, T. M. Harrison, S. S. Ravi, L. Hagen, C. Kot_la and F. Chen,
\E-petitioning as Collective Political Action in We the People", Proc. iConference 2015,
Newport Beach, CA, March 2015 (20 pages).

                            </li>
                           
                            <li className="mb-12">
                            C. Dumas, D. LaManna, T. M. Harrison, S. S. Ravi, L. Hagen, C. Kot_la and F. Chen,
Examining Political Mobilization of Online Communities through E-petitioning Behavior in
We the People", Big Data and Society (an online journal), Vol. 2, No. 2, July,December
2015, pp. 1-20.


                            </li>                            
                        </ol>
                    </Typography>
                   
                </div>
            }
        />
    );
}

export default ProjectStructureDoc;
