import '../App.css';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import data from '../mockData/mockLecturerClassesTable.json';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

type Props = {
	apiPath:string
}

function LecturedCourses({apiPath}:Props) {
	//<DropDown onChange={onDropDownChange} dropDownData={dropDownValue}></DropDown>

	const [tableData, setTableData] = useState(data.classes);
	const {id} = useParams();
	
	
	useEffect(() => {
		var url = apiPath + "/term/teacher/list/bycourse/" + id;
		fetch(url).then(res => res.json()).then(recData => {
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
								<TableCell>Nazov terminu</TableCell>
								<TableCell>Pocet studentov</TableCell>
								<TableCell>Max pocet studentov</TableCell>
								<TableCell>Detaily</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tableData.map((td:any) => (
								<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell sx={{ borderBottom: '0'}}>{td.classname}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.students}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.maxstudents}</TableCell>
									<td><Link to={'/lecturedCourseDetail/' + td.id}>detail</Link></td>
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
