import '../App.css';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import { useEffect, useState, Fragment } from 'react';
import data from '../mockData/mockInputTableData.json'
import { useParams } from 'react-router-dom';
import { Button, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';

type Props = {
	apiPath:string
}

function LecturedCourses({apiPath}:Props) {
	const [tableData, setTableData] = useState(data.marks);
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPages, setMaxPages] = useState(1);

	const [pointsId, setPointsId] = useState(null);
	const [editFormData, setEditFormData] = useState({
		name:"",
		surname:"",
		points:"",
		maxpoints:""
	});

	const {id} = useParams();

	useEffect(() => {console.log("data update:", tableData)}, [tableData])
	useEffect(() => {console.log("edit:", pointsId)}, [pointsId])

	function loadData(currentPage:number) {
		var url = apiPath + "/term/teacher/detail/" + id + "/" + currentPage;
		fetch(url).then(res => res.json()).then(recData => {
			console.log("data", recData);
			if (recData.marks !== undefined) {
				setTableData(recData.marks);
			}
			setCurrentPage(recData.currentPage);
			setMaxPages(recData.totalPages)
		});
	}

	useEffect(() => {
		loadData(1);
	}, []);

	const onPageChange = (event:any, value:any) => {
		loadData(value)
	}

	const onEdit = (event:any, tableData:any) => {
		event.preventDefault();
		setPointsId(tableData.mark_id);
		console.log(tableData.mark_id);

		const formValues = {
			name: tableData.name,
			surname: tableData.surname,
			points: tableData.points,
			maxpoints: tableData.maxpoints
		}
		console.log("formValues:", formValues);
		setEditFormData(formValues);
	}

	const handleEditFormChange = (event:any) => {
		event.preventDefault();

		const fieldName = event.target.getAttribute("name");
		const fieldValue = event.target.value;

		if (!isNaN(fieldValue)) {
			console.log("formValue:", fieldValue);

			const newFormData = {...editFormData}
			newFormData[fieldName as keyof typeof editFormData] = fieldValue;

			setEditFormData(newFormData);
		}
	}

	const handleEditFormSubmit = (event:any) => {
		event.preventDefault();

		console.log("submit");

		const editPoints = {
			mark_id: pointsId as any,
			name: editFormData.name,
			surname: editFormData.surname,
			points: editFormData.points,
			maxpoints: editFormData.maxpoints
		};

		const dataToSend = {
			mark_id: pointsId as any,
			points: editFormData.points,
		};

		const newData = [...tableData];
		const index = tableData.findIndex((td:any) => td.mark_id === pointsId);
		newData[index] = editPoints;
		setTableData(newData);

		console.log(editPoints)
		
		var url = apiPath + "/term/teacher/detail/" + id + "/" + currentPage;
		
		console.log("send data");
		fetch(apiPath + "/term/teacher/edit", {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content-type":"application/json",
			},
			body:JSON.stringify(dataToSend)
			}
		).then((response) => {
			if (!response.ok) {
				alert("Incorrect data");		
			}
		}).then((recData) => {
			console.log(recData);
			fetch(url).then(res => res.json()).then(data => {
				setTableData(data.marks);
				setCurrentPage(data.currentPage);
				setMaxPages(data.totalPages);
			});
		});

		setPointsId(null);
	};

	return (
		<div>
			<PageHeader apiPath={apiPath}  homePage='/home' useLogout={true}></PageHeader>
				<div id="lecturedCoursesMainContent">
				<form onSubmit={handleEditFormSubmit}>
					<Table id="inputTable" sx={{ boxShadow: 2}}>
						<TableHead>
						<TableRow>
							<TableCell>Meno studenta</TableCell>
							<TableCell>Priezvisko studenta</TableCell>
							<TableCell>Hodnotenie studenta</TableCell>
							<TableCell>Max pocet bodov</TableCell>
							<TableCell></TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
							{tableData.map((td:any) => (
								<Fragment>
									{pointsId === td.mark_id ? 
										<TableRow key={td.mark_id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell sx={{ borderBottom: '0'}}>
												{td.name}
											</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>
												{td.surname}
											</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>
												<input type="text" required placeholder="zadaj body" value={editFormData.points} name="points" onChange={handleEditFormChange}></input>
											</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>
												{td.maxpoints}
											</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>
												<Button type="submit" onClick={(event) => handleEditFormSubmit(event)}>Ulozit</Button>
											</TableCell>
										</TableRow>
									: 
										<TableRow key={td.mark_id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell>{td.name}</TableCell>
											<TableCell>{td.surname}</TableCell>
											<TableCell>{td.points}</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>
												{td.maxpoints}
											</TableCell>
											<TableCell>
												<Button value={"Editovat"} onClick={(event) => onEdit(event, td)}>Editovat</Button>
											</TableCell>
										</TableRow>
								}	
								</Fragment>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
							<TableCell colSpan={5}>
								<Pagination count={maxPages?? 1} defaultPage={currentPage?? 1} onChange={(event, value) => onPageChange(event, value)}></Pagination>
							</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
					</form>
				</div>
			<PageFooter></PageFooter>
		</div>
	);
}

export default LecturedCourses;
