import { FuseAnimate, FusePageSimple } from '@fuse/index.js';
import { Button, Fab, Icon, Tooltip, Typography, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from '../../file-manager/FileUpload/FileUploadDialog.js';
import FMPopup from './file-manager-dialog/FileManagerDialog.js';
import './JobDefinitionForm.css';
import axios from 'axios';
import { Input } from 'app/main/apps/job-definition/Job-Definition/Input';

import Formsy from 'formsy-react';

function JobDefinitionForm(props) {
	const [ showFMDialog, setShowFMDialog ] = useState(false);
	const [ showDialog, setshowDialog ] = useState(false);
	const [ fileChosen, setFileChosen ] = useState('');
	const [ formElementsArray, setFormElementsArray ] = useState({});

	const parentGrid = {
		borderTop: '2px solid black',
		borderBottom: '2px solid black'
	};

	const childGrid = {
		borderRight: '1px solid black',
		paddingLeft: '20px'
	};

	useEffect(() => {
		var userToken = localStorage.getItem('id_token');
		var path = window.location.pathname;
		var pathEnd = path.replace('/apps/job-definition/', '');

		axios({
			method: 'get',
			url: `https://sciduct.bii.virginia.edu/jobsvc/job_definition/${pathEnd}`,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '* ',
				Authorization: userToken
			}
		}).then(
			(res) => {
				if (res.data) {
					console.log(res.data);
					var createFromData = JSON.parse(res.data.input_schema).properties;
					var inputFileData = res.data.input_files;
					var x = JSON.parse(res.data.input_schema).required;

					creatForm(createFromData, inputFileData);
				}
			},
			(error) => {}
		);
	}, []);

	const creatForm = (createFromData, inputFileData) => {
		var count = 0;
		for (let [ index, obj ] of inputFileData.entries()) {
			obj['id'] = index;
			obj['formLabel'] = obj.name;
			obj['value'] = '';
			//  let keyName = obj.name
			// createFromData[keyName] = obj
		}

		for (let key in createFromData) {
			count++;
			//console.log(`obj.${key} = ${createFromData[prop]}`);
			createFromData[key]['value'] = 'Abhishek';
			createFromData[key]['id'] = count + 100;
			createFromData[key]['formLabel'] = key;
		}

		for (let obj of inputFileData) {
			let keyName = obj.name;
			createFromData[keyName] = obj;
		}

		const sortable = Object.entries(createFromData)
			.sort(([ , a ], [ , b ]) => a - b)
			.reduce((r, [ k, v ]) => ({ ...r, [k]: v }), {});

		setFormElementsArray({ ...createFromData });
		console.log(formElementsArray);
	};

	// function creatForm(fromData) {
	//     for (const prop in fromData) {
	//         console.log(`obj.${prop} = ${fromData[prop]}`);
	//       }

	//   }

	function onFormSubmit() {
		console.log(formElementsArray)
	}

	const selectButtonStyle = {
		backgroundColor: '#61dafb',
		fontSize: 'inherit',
		margin: '5px',
		padding: '6px',
		color: 'black'
	};

	const buttonStyle = {
		backgroundColor: 'lightgrey',
		margin: '5px',
		padding: '6px',
		color: 'black'
	};

	function showFileManagerDialog() {
		setShowFMDialog(true);
	}

	function handleFMClose() {
		setShowFMDialog(false);
		//  childRef.current.getAlert()
	}

	const onFormCancel = () => {
		console.log(formElementsArray);
		// localStorage.removeItem('selectedJobDefinition')
	};

	console.log(formElementsArray)

	return (
		<div style={{ paddingLeft: '10px' }}>
			<div className="flex" style={{ paddingBottom: '10px' }}>
				<Typography className="h2 mb-1">{props.selectedJob.id}</Typography>
				<Tooltip className="h4 mb-12" title={<h4>{props.selectedJob.description}</h4>} placement="right">
					<div style={{ marginLeft: '3px' }}>
						<Icon fontSize="small">info</Icon>
					</div>
				</Tooltip>
			</div>
			<div>
				{Object.entries(formElementsArray).length !== 0 ? (
					<Formsy className="flex flex-col justify-center">
						<Grid style={parentGrid} container spacing={3}>
							{Object.entries(formElementsArray).map((formElement) => (
								<Grid style={childGrid} item container xs={12} sm={6}>
									<Input
										key={formElement.id}
										formData={formElement}
										key={formElement.id}
										elementType={formElement.type}
										value={formElement.value}
										buttonClicked={showDialog}
										changed={(event) => this.inputChangedHandler(event, formElement.id)}
									/>
								</Grid>
							))}
						</Grid>
						<div style={{ alignSelf: 'flex-end' }}>
							<Button
								// type="submit"
								variant="contained"
								color="primary"
								className="w-30  mt-32 mb-80"
								aria-label="LOG IN"
								onClick={onFormSubmit}
							>
								Submit
							</Button>
							<Link to="/apps/job-definition/" style={{color:'transparent'}}>
								<Button
									variant="contained"
									onClick={onFormCancel}
									color="primary"
									className="w-30 mx-8 mt-32 mb-80"
								>
									Cancel
								</Button>
							</Link>
						</div>
					</Formsy>
				) : null}
			</div>
		</div>
	);
}

export default JobDefinitionForm;
