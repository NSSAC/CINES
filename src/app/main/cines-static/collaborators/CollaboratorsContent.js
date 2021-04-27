import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple} from '@fuse';
import { useHistory } from "react-router-dom";

function ProductionDoc()
{

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
                            <Typography color="textSecondary">Collaborators</Typography>
                            {/* <Icon className="text-16" color="action">chevron_right</Icon>
                            <Typography color="textSecondary">Working with Fuse React</Typography> */}
                        </div>
                        <Typography variant="h6">Collaborators</Typography>
                    </div>
                </div>
            }
            content={
                <div className="p-24 max-w-2xl">

                    <Typography className="mb-8" variant="h5">Participating Institutions and Organizations:</Typography>
                    <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">
                            <b>Institution:</b> Indiana University, Bloomington, IN <br></br>
                            <b>Contacts:</b> Geoffrey Fox, Gregor von Laszewski and Judy Qiu (School of Informatics, Computing and Engineering)
                            </li>
                            <li className="mb-12">
                            <b>Institution:</b> Jackson State University, Jackson, MS <br></br>
<b>Contacts:</b> Natarajan Meghanathan (Department of Electrical & Computer Engineering and
Computer Science)
                            </li>
                            <li className="mb-12">
                            <b>Institution:</b> North Carolina A&T State University, Greensboro, NC<br></br>
<b>Contacts:</b> Albert Esterline (Department of Computer Science)
                            </li>
                           
                            <li className="mb-12">
                            <b>Institution:</b> Stanford University, Stanford, CA<br></br>
                            <b>Contacts:</b> Jure Leskovec and Rok Sosic (Department of Computer Science)
                            </li>
                            <li className="mb-12">
                            <b>Institution:</b> University of Virginia, Charlottesville, VA<br></br>
                            <b>Contacts:</b> Madhav V. Marathe (Biocomplexity Institute and Initiative and Department of
Computer Science), Christopher J. Kuhlman, Dustin Machi and S. S. Ravi (all from Biocomplexity Institute and Initiative and Department of Computer Science)
                            </li>
                            <li className="mb-12">
                            <b>Institution:</b> Virginia Tech, Blacksburg, VA<br></br>
                            <b>Contacts:</b> Catherine Amelink (Learning Systems Innovation and Effectiveness and Department of Engineering Education), Kristy Collins (Fralin Life Sciences Institute), Edward Fox
and Naren Ramakrishnan (both from the Department of Computer Science) and Yasuo
Miyazaki (School of Education)
                            </li>
                            <li className="mb-12">
                            <b>Organization:</b> Los Alamos National Laboratory, Los Alamos, NM<br></br>
                            <b>Contacts:</b> Aric Hagberg (Computer, Computational and Statistical Sciences Division)
                            </li>
                            <li className="mb-12">
                            <b>Organization:</b> Kitware, Inc., Clifton Park, NY<br></br>
                            <b>Contacts:</b> Aashish Chaudhary
                            </li>
                            <li className="mb-12">
                            <b>Organization:</b> Network Repository <br></br>
                            <b>Contacts:</b> Ryan Rossi and Nesreen Ahmed
                            </li>
                            
                        </ol>
                    </Typography>    

                    <Typography className="mb-8" variant="h5">Scientific Advisory Board:</Typography>               
                    <Typography className="my-16" component="div">
                        <ol style={{listStyle: 'square'}} className="pl-12">
                            <li className="mb-12">Richard Alo (Florida Agricultural and Mechanical University, Tallahassee, FL)</li>
                            <li className="mb-12">Noshir Contractor (Northwestern University, Evanston, IL)</li>
                            <li className="mb-12">Matthew Jackson (Stanford University, Stanford, CA)</li>
                            <li className="mb-12">Pamela Murray-Tuite (Clemson University, Clemson, SC)</li>
                            <li className="mb-12">Y. Narahari (Indian Institute of Science, Bangalore, India)</li>
                            <li className="mb-12">Arun Phadke (Virginia Tech, Blacksburg, VA)</li>
                            <li className="mb-12">Cliff Shaffer (Virginia Tech, Blacksburg, VA)</li>
                            <li className="mb-12">Zoltan Toroczkai (University of Notre Dame, Notre Dame, IN)</li>
                            <li className="mb-12">Stanley Wasserman (Indiana University, Bloomington, IN)</li>
                        </ol>
                    </Typography> 
                </div>
            }
        />
    );
}

export default ProductionDoc;
