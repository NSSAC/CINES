import React from 'react';
import {Icon, Typography} from '@material-ui/core';
import {FusePageSimple, FuseHighlight} from '@fuse';

function ProductionDoc()
{
    return (
        <FusePageSimple
            header={
                <div className="flex flex-1 items-center justify-between p-24">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-16">
                            <Icon className="text-18" color="action">home</Icon>
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
                            Institution: Indiana University, Bloomington, IN
Contacts: Geoffrey Fox, Gregor von Laszewski and Judy Qiu (School of Informatics, Computing and Engineering)
                            </li>
                            <li className="mb-12">
                            Institution: Jackson State University, Jackson, MS
Contact: Natarajan Meghanathan (Department of Electrical & Computer Engineering and
Computer Science)
                            </li>
                            <li className="mb-12">
                            Institution: North Carolina A&T State University, Greensboro, NC
Contact: Albert Esterline (Department of Computer Science)
                            </li>
                           
                            <li className="mb-12">
                            Institution: Stanford University, Stanford, CA
Contacts: Jure Leskovec and Rok Sosic (Department of Computer Science)
                            </li>
                            <li className="mb-12">
                            Institution: University of Virginia, Charlottesville, VA
Contacts: Madhav V. Marathe (Biocomplexity Institute and Initiative and Department of
Computer Science), Christopher J. Kuhlman, Dustin Machi and S. S. Ravi (all from Biocomplexity Institute and Initiative and Department of Computer Science)
                            </li>
                            <li className="mb-12">
                            Institution: Virginia Tech, Blacksburg, VA
Contacts: Catherine Amelink (Learning Systems Innovation and Effectiveness and Department of Engineering Education), Kristy Collins (Fralin Life Sciences Institute), Edward Fox
and Naren Ramakrishnan (both from the Department of Computer Science) and Yasuo
Miyazaki (School of Education)
                            </li>
                            <li className="mb-12">
                            Organization: Los Alamos National Laboratory, Los Alamos, NM
Contact: Aric Hagberg (Computer, Computational and Statistical Sciences Division)
                            </li>
                            <li className="mb-12">
                            Organization: Kitware, Inc., Clifton Park, NY
Contact: Aashish Chaudhary
                            </li>
                            <li className="mb-12">
                            Organization: Network Repository (networkrepository.org)
Contacts: Ryan Rossi and Nesreen Ahmed
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
