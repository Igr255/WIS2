import '../App.css';
import { nanoid } from "nanoid";
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import { Button, Pagination, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, TextField } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import data from '../mockData/mockAdminUsertableData.json'
import roomData from '../mockData/mockAdminPageRoomsData.json'
import requestData from '../mockData/mockAdminPageRequestData.json'

type Props = {
	apiPath:string
}

function AdminPage({apiPath}:Props) {
	const [pageNumber, setPageNumber] = useState(1);
	const [maxPagesNumber, setMaxPagesNumber] = useState(1);

	const [pageRoomNumber, setRoomPageNumber] = useState(1);
	const [maxRoomPagesNumber, setRoomMaxPagesNumber] = useState(1);

	
	// PEOPLE TABLE DATA
	const [tableData, setTableData] = useState(data.users);
	const [addNewFlag, setAddNewFlag] = useState(true);

	const [editId, setEditId] = useState<string | null>(null);
	const [editFormData, setEditFormData] = useState({
		login: "",
		name: "",
		surname: "",
		password: "",
		email: "",
	});
	// PEOPLE TABLE DATA

	// ROOMS TABLE DATA	
	const [roomTableData, setRoomTableData] = useState(roomData.rooms);
	const [addNewRoomFlag, setAddNewRoomFlag] = useState(true);

	const [editRoomId, setEditRoomId] = useState<string | null>(null);
	const [editRoomFormData, setEditRoomFormData] = useState({
		name: "",
		building: ""
	});
	// ROOMS TABLE DATA

	// REQ TABLE DATA
	const [requestTableData, setRequestTableData] = useState(requestData);
	// REQ TABLE DATA

	useEffect(() => {console.log("render")}, []);

	useEffect(() => {console.log("addNewRoom:", addNewRoomFlag)}, [addNewRoomFlag	])

	// USER DATA FETCH
	function fetchData(number:number) {
		const url = apiPath + "/user/list/admin/all/" + number;
		fetch(url).then(res => res.json()).then(data => {
			if (data.users !== undefined) {
				setTableData(data.users);
				console.log(data.users);
				
				setPageNumber(data.currentPage);
				setMaxPagesNumber(data.totalPages);
			}
		});
	}
	// USER DATA FETCH

	// ROOM DATA FETCH
	function fetchRoomData(number:number) {
		const url = apiPath + "/classroom/list/" + number;
		fetch(url).then(res => res.json()).then(data => {
			if (data.rooms !== undefined) {
				setRoomTableData(data.rooms);
				console.log("ROOMS:", data.rooms);
				
				setRoomPageNumber(data.currentPage);
				setRoomMaxPagesNumber(data.totalPages);
			}
		});
	}
	// ROOM DATA FETCH

	// COURSE DATA FETCH
	function fetchCourseData() {
		const url = apiPath + "/course/list/notapproved";
		fetch(url).then(res => res.json()).then(data => {
			if (data !== undefined) {
				setRequestTableData(data);
			}
		});
	}
	// COURSE DATA FETCH


	useEffect(() => {
		fetchData(1);
	}, [])

	
	useEffect(() => {
		fetchRoomData(1);
	}, [])

	useEffect(() => {
		fetchCourseData();
	}, [])


	// PAGINATION USERS
	const usersPaginationChange = (event:any, value:any) => {
		fetchData(value);
	};
	// PAGINATION USERS

	// PAGINATION ROOMS
	const roomsPaginationChange = (event:any, value:any) => {
		fetchRoomData(value);
	}
	// PAGINATION ROOMS

	// ROOMS TABLE LOGIC
	const onRoomEditButton = (event:any, roomTableData:any) => {
		event.preventDefault();
		if (addNewRoomFlag) {
			console.log(roomTableData.id)
			setEditRoomId(roomTableData.id);
			
			const rowValue = {
				name:roomTableData.name,
				building:roomTableData.building
			}

			setEditRoomFormData(rowValue);
		}
	}

	const onAddRoomButton = (event:any) => {
		event.preventDefault();
		setAddNewRoomFlag(false);
		
		if (addNewRoomFlag) {

			const newRow = {
				id: nanoid(),
				name: "",
				building: ""
			}

			const formData = {
				name: "",
				building: ""
			}

			const newData:any = [...roomTableData, newRow];

			console.log(newRow);
			console.log(newData);
			setEditRoomFormData(formData);
			setRoomTableData(newData);
			setEditRoomId(newRow.id);
		}
	}

	const onRoomDeleteButton = (event:any, tableRowData:any) => {
		event.preventDefault();
		
		if (addNewRoomFlag) {
			const dataToSend = {
				id: tableRowData.id
			}

			const roomTableDataCopy = [...roomTableData];
			const index = roomTableData.findIndex((td:any) => td.id === tableRowData.id);
			roomTableDataCopy.splice(index, 1);
			setRoomTableData(roomTableDataCopy);

			fetch(apiPath + "/classroom/delete", {
				method:"DELETE",
				cache: "no-cache",
				headers:{
					"content-type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then((response) => {
				if (!response.ok) {
					console.log("Incorrect data");		
				}
			}).then((recData) => {
				console.log(recData);
			
				const url = apiPath + "/classroom/list/" + pageNumber;
				fetch(url).then(res => res.json()).then(data => {
					if (data.rooms != undefined) {
						setRoomTableData(data.rooms);
						console.log(data.rooms);
					}
				});
				console.log(recData);
			});

			setRoomTableData(roomTableDataCopy);
		}
	}

	const onRoomSaveButton = (event:any) => {
		event.preventDefault();

		const dataToSend = {
			id: editRoomId as any,
			name: editRoomFormData.name,
			building: editRoomFormData.building
		}

		const tableDataCopy:any = [...roomTableData];
		const index = roomTableData.findIndex((td:any) => td.id === editRoomId);
		tableDataCopy[index] = dataToSend;
		setRoomTableData(tableDataCopy);


		var url = apiPath + "/classroom/create";
		if (addNewRoomFlag) {
			url = apiPath + "/classroom/edit";
		}

		fetch(url, {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content-type":"application/json",
			},
			body:JSON.stringify(dataToSend)
			}
		).then((response) => {
			if (!response.ok) {
				console.log("Incorrect data");		
			}
		}).then((recData) => {
			const url = apiPath + "/classroom/list/" + pageNumber;
			fetch(url).then(res => res.json()).then(data => {
				if (data.rooms !== undefined) {
					console.log(data.rooms);
					setRoomTableData(data.rooms);
					setRoomMaxPagesNumber(data.totalPages);
					setRoomPageNumber(data.currentPage);
				}
				
			});
			console.log(recData);
		});
		
		setAddNewRoomFlag(true);
		setEditRoomId(null);
	}

	const handleRoomEditFormChange = (event:any) => {
		event.preventDefault();
		
		const fieldName = event.target.getAttribute("name");
		const fieldValue = event.target.value;
		console.log(fieldValue);

		const newRoomFormData = { ...editRoomFormData };
		newRoomFormData[fieldName as keyof typeof editRoomFormData] = fieldValue;
		
		setEditRoomFormData(newRoomFormData);
	}
	// ROOMS TABLE LOGIC

	// PEOPLE TABLE LOGIC
	const onEditButton = (event:any, tableData:any) => {
		event.preventDefault();
		if (addNewFlag) {
			setEditId(tableData.id);
			
			const rowValue = {
				login:tableData.login,
				name:tableData.name,
				surname:tableData.surname,
				password:"",
				email:tableData.email
			}

			setEditFormData(rowValue);
		}
	}

	const onAddButton = (event:any) => {
		event.preventDefault();
		setAddNewFlag(false);
		
		if (addNewFlag) {

			const newRow = {
				id: nanoid(),
				login: "",
				name: "",
				surname: "",
				password: "",
				email: "",
			}

			const formData = {
				login: "",
				name: "",
				surname: "",
				password: "",
				email: "",
			}

			const newData:any = [...tableData, newRow];

			console.log(newRow);
			console.log(newData);
			setEditFormData(formData);
			setTableData(newData);
			setEditId(newRow.id);
		}
	}

	const onDeleteButton = (event:any, tableRowData:any) => {
		event.preventDefault();
		
		if (addNewFlag) {
			const dataToSend = {
				id: tableRowData.id
			}

			const tableDataCopy:any = [...tableData];
			const index = tableData.findIndex((td:any) => td.id === tableRowData.id);
			tableDataCopy.splice(index, 1);
			setTableData(tableDataCopy);

			fetch(apiPath + "/user/remove", {
				method:"DELETE",
				cache: "no-cache",
				headers:{
					"content-type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then((response) => {
					if (!response.ok) {
						console.log("Incorrect data");		
					}
			}).then((recData) => {
				console.log(recData);
			
				const url = apiPath + "/user/list/admin/all/" + pageNumber;
				fetch(url).then(res => res.json()).then(data => {
					if (data.users != undefined) {
						setTableData(data.users);
						console.log(data.users);
					}
				});
			});
		}
	}

	const onSaveButton = (event:any) => {
		event.preventDefault();

		const dataToSend = {
			id: editId as any,
			login: editFormData.login,
			name: editFormData.name,
			surname: editFormData.surname,
			password: editFormData.password,
			email: editFormData.email
		}
		
		const tableDataCopy:any = [...tableData];
		const index = tableData.findIndex((td:any) => td.id === editId);
		tableDataCopy[index] = dataToSend;
		setTableData(tableDataCopy);


		console.log(dataToSend);

		setAddNewFlag(false);

		var url = apiPath +  "/user/register";
		if (addNewFlag) {
			url = apiPath + "/user/edit/admin";
		}

		fetch(url, {
			method:"POST",
			cache: "no-cache",
			headers:{
				"content-type":"application/json",
			},
			body:JSON.stringify(dataToSend)
			}
		).then((response) => {
			if (!response.ok) {
				console.log("Incorrect data");		
			}
		}).then((recData) => {
			console.log(recData);
			const url = apiPath + "/user/list/admin/all/" + pageNumber;
			fetch(url).then(res => res.json()).then(data => {
				if (data.users !== undefined) {
					setTableData(data.users);
					setMaxPagesNumber(data.totalPages);
					setPageNumber(data.currentPage);
					console.log(data.users);
				}
			});
			console.log(recData);
		});
		setAddNewFlag(true);
		setEditId(null);
	}

	const handleEditFormChange = (event:any) => {
		event.preventDefault();

		const fieldName = event.target.getAttribute("name");
		const fieldValue = event.target.value;

		const newFormData = { ...editFormData };
		newFormData[fieldName as keyof typeof editFormData] = fieldValue;
		
		setEditFormData(newFormData);
	}
	// PEOPLE TABLE LOGIC

	// REQUEST TABLE LOGIC
	const onAcceptClicked = (event:any, tableData:any) => {
		const dataToSend = {
			id:tableData.id
		}

		const tableDataCopy:any = [...requestTableData];
		const index = requestTableData.findIndex((td:any) => td.id === tableData.id);
		tableDataCopy.splice(index, 1);
		setRequestTableData(tableDataCopy);

		fetch(apiPath + "/course/approve", {
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
			fetchCourseData();
		});
	}

	const onDeclineClicked = (event:any, tableData:any) => {
		const dataToSend = {
			id:tableData.id
		}
		
		const tableDataCopy = [...requestTableData];
		const index = requestTableData.findIndex((td:any) => td.id === tableData.id);
		tableDataCopy.splice(index, 1);
		setRequestTableData(tableDataCopy);

		fetch(apiPath + "/course/delete", {
			method:"DELETE",
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
			fetchCourseData();
		});
	}
	// REQUEST TABLE LOGIC



	return (
	<div>	
		<PageHeader apiPath={apiPath} homePage='/home' useLogout={true}></PageHeader>
		<div id="adminPageMainContent">
			<div>
				<h1>Prehlad uzivatelov</h1>
				<form>
					<Table sx={{ boxShadow: 2}}	>
						<colgroup>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
							<col style={{width:'20%'}}/>
						</colgroup>
						<TableHead>
							<TableRow>
								<TableCell>Login</TableCell>
								<TableCell>Meno</TableCell>
								<TableCell>Priezvisko</TableCell>
								<TableCell>Heslo</TableCell>
								<TableCell>E-mail</TableCell>
								<TableCell onClick={onAddButton} style={{display:'flex', justifyContent:'center'}}><Button ><i style={{fontSize:20}} className='fa fa-plus-square'></i></Button></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tableData.map((td:any) => (
								<Fragment>
									{
									editId !== td.id ?
										<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell sx={{ borderBottom: '0'}}>{td.login}</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>{td.name}</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>{td.surname}</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>••••</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>{td.email}</TableCell>
											<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
												<Button onClick={(event) => onEditButton(event, td)}><i className='far fa-edit'></i></Button>
												<Button onClick={(event) => onDeleteButton(event, td)}><i className='fas fa-eraser'></i></Button>
											</TableCell>
										</TableRow>
									: 
										<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell>
												<TextField value={editFormData.login} required name='login' size="small" placeholder='' id="standard-basic" label="Login" variant="standard" onChange={handleEditFormChange}/>
											</TableCell>
											<TableCell>
												<TextField value={editFormData.name} required name='name' size="small" id="standard-basic" label="Meno" variant="standard" onChange={handleEditFormChange}/>
											</TableCell>
											<TableCell>
												<TextField value={editFormData.surname} required name='surname' size="small" id="standard-basic" label="Priezvisko" variant="standard" onChange={handleEditFormChange}/>
											</TableCell>
											<TableCell>
												<TextField type="password" value={editFormData.password} required name='password' size="small" id="standard-basic" label="Heslo" variant="standard" onChange={handleEditFormChange}/>
											</TableCell>
											<TableCell>
												<TextField value={editFormData.email} required name='email' size="small" id="standard-basic" label="E-mail" variant="standard" onChange={handleEditFormChange}/>
											</TableCell>
											<TableCell  sx={{ borderBottom: '0'}} style={{textAlign: 'center'}}>
												<Button onClick={onSaveButton}>Ulozit</Button>
											</TableCell>
										</TableRow>
									}
								</Fragment>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={6}>
									<Pagination count={maxPagesNumber?? 1} defaultPage={pageNumber?? 1} onChange={(event, value) => usersPaginationChange(event, value)}></Pagination>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</form>
			</div>

			<div>
				<h1>Sprava miestnosti</h1>
				<form>
					<Table sx={{ boxShadow: 2}}>
						<colgroup>
							<col style={{width:'40%'}}/>
							<col style={{width:'40%'}}/>
							<col style={{width:'20%'}}/>
						</colgroup>
						<TableHead>
							<TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
								<TableCell>Miestnost</TableCell>
								<TableCell>Budova</TableCell>
								<TableCell onClick={onAddRoomButton} style={{display:'flex', justifyContent:'center'}}><Button ><i style={{fontSize:20}} className='fa fa-plus-square'></i></Button></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{roomTableData.map((td:any) => (
								<Fragment>
									{
									editRoomId !== td.id ?
										<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell sx={{ borderBottom: '0'}}>{td.name}</TableCell>
											<TableCell sx={{ borderBottom: '0'}}>{td.building}</TableCell>
											<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
												<Button onClick={(event) => onRoomEditButton(event, td)}><i className='far fa-edit'></i></Button>
												<Button onClick={(event) => onRoomDeleteButton(event, td)}><i className='fas fa-eraser'></i></Button>
											</TableCell>
										</TableRow>
									: 
										<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
											<TableCell>
												<TextField value={editRoomFormData.name} required name='name' size="small" placeholder='' id="standard-basic" label="Nazov" variant="standard" onChange={handleRoomEditFormChange}/>
											</TableCell>
											<TableCell>
												<TextField value={editRoomFormData.building} required name='building' size="small" id="standard-basic" label="Budova" variant="standard" onChange={handleRoomEditFormChange}/>
											</TableCell>
											<TableCell  sx={{ borderBottom: '0'}} style={{textAlign: 'center'}}>
												<Button onClick={onRoomSaveButton}>Ulozit</Button>
											</TableCell>
										</TableRow>
									}
								</Fragment>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>
									<Pagination count={maxRoomPagesNumber?? 1} defaultPage={pageRoomNumber?? 1} onChange={(event, value) => roomsPaginationChange(event, value)}></Pagination>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</form>
			</div>
			
			<div>
				<h1>Ziadosti o kurz	</h1>
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
								<TableCell>Login</TableCell>
								<TableCell>Meno</TableCell>
								<TableCell>Priezvisko</TableCell>
								<TableCell>Skr. predmetu</TableCell>
								<TableCell>Predmet</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{requestTableData.map((td:any) => (
								<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
									<TableCell sx={{ borderBottom: '0'}}>{td.userLogin}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.userName}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.userSurname}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.courseShortcut}</TableCell>
									<TableCell sx={{ borderBottom: '0'}}>{td.courseName}</TableCell>
									<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
										<Button onClick={(event) => onAcceptClicked(event, td)}><i className="fa-solid fa-thumbs-up"></i></Button>
										<Button onClick={(event) => onDeclineClicked(event, td)}><i className="fa-solid fa-thumbs-down"></i></Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</form>
			</div>
		</div>
		<PageFooter></PageFooter>
	</div>
	);
}

export default AdminPage;
