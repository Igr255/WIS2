import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import '../App.css';
import data from '../mockData/mockRegistrationtableData.json';
import registrationData from '../mockData/mocTermRegData.json';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

type Props = {
	apiPath:string
}

function SubjectDetailsPage({apiPath}:Props) {
	const [tableData, setTableData] = useState(data);
	const [regData, setRegData] = useState(registrationData);
	
	const {id} = useParams();
	const {subName} = useParams();

	function loadTerms() {
		const url = apiPath + "/course/detail/terms/" + id;
		fetch(url).then(res => res.json()).then(recData => {
			console.log(recData);
			setTableData(recData);
		  });
	}

	function loadTermRegistration() {
		const url = apiPath + "/term/list/bycourse/notregistered/" + id;
		fetch(url).then(res => res.json()).then(recData => {
			console.log(recData);
			setRegData(recData);
		  });
	}

	useEffect(() => {
		loadTerms();
		loadTermRegistration();
	}, []);

	const onButtonClick = (event:any, tableData:any) => {
		fetch(apiPath + "/term/registerstudent", {
			method:"POST",
			cache: "no-cache",
			headers:{
				"Content-Type":"application/json",
			},
			body:JSON.stringify(tableData)
			}
		).then((response) => {
			if (!response.ok) {
				alert("Incorrect data");		
			}
		}).then((recData) => {
			loadTerms();
			loadTermRegistration();
		});
	}

	return (
		<div>
			<PageHeader apiPath={apiPath} homePage='/home' useLogout={true}></PageHeader>
				<div id="mainContentSubjectDetailsPage">
					
					<div>
						<div className="semesterTitle">
							Detaily predmetu {subName}
						</div>
						<Table id="registrationTable" sx={{ boxShadow: 2}}>
							<TableHead>
								<TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell>Nazov</TableCell>
									<TableCell>Datum hodnotenia</TableCell>
									<TableCell>Hodnotiaci</TableCell>
									<TableCell>Body</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{tableData.map((td:any) => (
								<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell>{td.course}</TableCell>
									<TableCell>{td.date}</TableCell>
									<TableCell>{td.lecturer}</TableCell>
									<TableCell>{td.points}</TableCell>
								</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<div>
						<div className="semesterTitle">
							Registracie terminov predmetu {subName}
						</div>
						<Table id="registrationTable" sx={{ boxShadow: 2}}>
							<colgroup>
								<col style={{width:'40%'}}/>
								<col style={{width:'40%'}}/>
								<col style={{width:'20%'}}/>
							</colgroup>
							<TableHead>
								<TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
								<TableCell>Nazov terminu</TableCell>
								<TableCell>Kapacita</TableCell>
								<TableCell>Maximalna kapacita</TableCell>
								<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{regData.map((td:any) => (
								<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell>{td.name}</TableCell>
									<TableCell>{td.capacity}</TableCell>
									<TableCell>{td.maxCapacity}</TableCell>
									<TableCell><Button onClick={(event:any) => onButtonClick(event, td)}>Registrovat</Button></TableCell>
								</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			<PageFooter></PageFooter>
		</div>
	);
}

export default SubjectDetailsPage;
