import '../App.css';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import data from '../mockData/mockLecturerClassesTable.json';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
	apiPath:string
}

function LecturedCourses({apiPath}:Props) {
	const [tableData, setTableData] = useState(data.classes);
	
	useEffect(() => {
		fetch(apiPath + '/course/list/taught').then(res => res.json()).then(recData => {
			setTableData(recData);
		});
	}, []);

	useEffect(() => {console.log("change", tableData)}, [tableData]);
	
	return (
		<div>
			<PageHeader apiPath={apiPath}  homePage='/home' useLogout={true}></PageHeader>
				<div id="lecturedCoursesMainContent">
				<form>
					<Table sx={{ boxShadow: 2}}	>
						<colgroup>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
						</colgroup>
						<TableHead>
							<TableRow>
								<TableCell>Skratka predmetu</TableCell>
								<TableCell>Nazov predmetu</TableCell>
								<TableCell>Garant</TableCell>
								<TableCell>Vyucovane kurzy</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tableData.map((td:any) => (
								<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell sx={{ borderBottom: '0'}}>{td.shortcut}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.fullname}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.garant}</TableCell>
									<td><Link to={'/lecturedCourseLectures/' + td.id}>detail</Link></td>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</form>

				</div>
			<PageFooter></PageFooter>
		</div>
	);
}

export default LecturedCourses;
