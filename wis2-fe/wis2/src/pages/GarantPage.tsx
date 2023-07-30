import { nanoid } from "nanoid";
import { Fragment, useEffect, useState } from 'react';
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField, Select, MenuItem, InputLabel, TableFooter, Pagination} from '@mui/material';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import CannotLoadError from '../components/CannotLoadError';
import LoadingSign from '../components/LoadingSign';
import { Popup, onPopupEvent } from '../components/Popup';


type Props = {
	apiPath:string
}

function GarantPage({apiPath}:Props) {
/*--------------------------------------------HOOK DEFINITIONS-----------------------------------------------------*/
	/*=======================================COMMON PAGE HOOKS==================================================*/
	const [pageNumber, setPageNumber] = useState(1);
	const [maxPagesNumber, setMaxPagesNumber] = useState(1);
	const [buttonTermPopup, setButtonTermPopup] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editCourseId, setEditCourseId] = useState<string | null>(null);
	/*=====================================COMMON PAGE HOOKS END================================================*/

	/*==================================COURSES TABLE DATA DEFINITION===========================================*/
	const [coursesTableData, setCoursesTableData] = useState(
		[
			{
				id: "",
				shortcut: "",
				name: "",
				description: "",
				credits: 0,
				studentLimit: 0,
				isApproved: false
			}
		]
	);
	const [addNewCourseFlag, setAddNewCourseFlag] = useState(false);
	const [editCourseFormData, setEditCourseFormData] = useState(
		{
			shortcut: "",
			name: "",
			credits: 0,
			description: "",
			studentLimit: 9999,
			isApproved: false
		}
	);
	/*=================================COURSES TABLE DATA DEFINITION END========================================*/

	/*===============================COURSE LECTURERS TABLE DATA DEFINITION=====================================*/
	const [courseLecturersTableData, setCourseLecturersTableData] = useState(
		[
			{
				id: "",
				login: "",
				name: "",
				surname: ""
			}
		]
	);
	const [addNewCourseLecturerFlag, setAddNewCourseLecturerFlag] = useState(false);
	const [addCourseLecturerFormData, setAddCourseLecturerFormData] = useState(
		{
			id: "",
			login: ""
		}
	);
	/*=============================COURSE LECTURERS TABLE DATA DEFINITION END===================================*/

	/*=============================COURSE REGISTRATIONS TABLE DATA DEFINITION===================================*/
	const [courseRegistrationsTableData, setCourseRegistrationsTableData] = useState(
		[
			{
				id: "",
				login: "",
				name: "",
				surname: ""
			}
		]
	);
	/*=============================COURSE REGISTRATIONS TABLE DATA DEFINITION===================================*/

	/*=================================COURSE TERMS TABLE DATA DEFINITION=======================================*/
	const [courseTermsTableData, setCourseTermsTableData] = useState(
		[
			{
				id: "",
				classname: "",
				description: "",
				startDate: new Date().toISOString(),
				endDate: new Date().toISOString(),
				registrationStartDate: new Date().toISOString(),
				registrationEndDate: new Date().toISOString(),
				maxMark: 0,
				studentLimit: 9999,
				students: 0,
				isRegistrationEnabled: true,
				isOptional: true
			}
		]
	);
	const [addNewCourseTermFlag, setAddNewCourseTermFlag] = useState(false);
	const [editCourseTermId, setEditCourseTermId] = useState<string | null>(null);
	const [editCourseTermFormData, setEditCourseTermFormData] = useState(
		{
			classname: "",
			description: "",
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
			registrationStartDate: new Date().toISOString(),
			registrationEndDate: new Date().toISOString(),
			maxMark: 0,
			studentLimit: 9999,
			students: 0,
			isRegistrationEnabled: false,
			isOptional: false
		}
	);
	/*================================COURSE TERMS TABLE DATA DEFINITION END====================================*/

	/*==================================OTHER USERS TABLE DATA DEFINITION=======================================*/
	const [otherUsersTableData, setOtherUsersTableData] = useState(
		[
			{
				id: "",
				login: "",
				name: "",
				surname: ""
			}
		]
	);
	/*=================================OTHER USERS TABLE DATA DEFINITION END====================================*/
/*--------------------------------------------HOOK DEFINITIONS END---------------------------------------------------*/

/*----------------------------------------------FETCH DEFINITIONS----------------------------------------------------*/
	/*=========================================COURSES DATA FETCH===============================================*/
	const [coursesFetchInProgressFlag, setCoursesFetchInProgressFlag] = useState(false);

	function fetchCoursesData() {
		setCoursesFetchInProgressFlag(true);
		const url = apiPath + "/course/list/garanted";
		fetch(url).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			return res.json();
		}).then(data => {
			setCoursesTableData(data);
			setCoursesFetchInProgressFlag(false);
		});
	}
	/*=======================================COURSES DATA FETCH END=============================================*/

	/*=====================================COURSE LECTURERS DATA FETCH==========================================*/
	const [courseLecturersFetchInProgressFlag, setCourseLecturersFetchInProgressFlag] = useState(false);

	function fetchCourseLecturersData(courseid: string) {
		setCourseLecturersFetchInProgressFlag(true);
		const url = apiPath + "/course/list/lecturers/" + courseid;
		fetch(url).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			return res.json();
		}).then(data => {
			setCourseLecturersTableData(data);
			setCourseLecturersFetchInProgressFlag(false);
		});
	}
	/*===================================COURSE LECTURERS DATA FETCH END=========================================*/

	/*===================================COURSE REGISTRATIONS DATA FETCH=========================================*/
	const [courseRegistrationsFetchInProgressFlag, setCourseRegistrationsFetchInProgressFlag] = useState(false);

	function fetchCourseRegistrationsData(courseid: string,  number:number) {
		setCourseRegistrationsFetchInProgressFlag(true);
		const url = apiPath + "/course/list/unapproverregistrations/" + courseid + "/" + number;
		fetch(url).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			return res.json();
		}).then(data => {
			if (data != null && data.registrations !== undefined) {
				setCourseRegistrationsTableData(data.registrations);
				
				setPageNumber(data.currentPage);
				setMaxPagesNumber(data.totalPages);
			}
			setCourseRegistrationsFetchInProgressFlag(false);
		});
	}

	const usersPaginationChange = (event:any, value:any) => {
		if(editCourseId != null) {
			fetchCourseRegistrationsData(editCourseId, value);
		}
	};
	/*=================================COURSE REGISTRATIONS DATA FETCH END=======================================*/

	/*========================================COURSE TERMS DATA FETCH============================================*/
	const [courseTermsFetchInProgressFlag, setCourseTermsFetchInProgressFlag] = useState(false);

	function fetchCourseTermsData(courseid: string) {
		setCourseTermsFetchInProgressFlag(true);
		const url = apiPath + "/term/teacher/list/bycourse/" + courseid;
		fetch(url).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			return res.json();
		}).then(data => {
			setCourseTermsTableData(data);
			setCourseTermsFetchInProgressFlag(false);
		});
	}
	/*=====================================COURSE TERMS DATA FETCH END===========================================*/

	/*========================================OTHER USERS DATA FETCH=============================================*/
	const [otherUsersFetchInProgressFlag, setOtherUsersFetchInProgressFlag] = useState(false);

	function fetchOtherUsersData() {
		setOtherUsersFetchInProgressFlag(true);
		const url = apiPath + "/user/list/all";
		fetch(url).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			return res.json();
		}).then(data => {
			setOtherUsersTableData(data);
			setOtherUsersFetchInProgressFlag(false);
		});
	}
	/*======================================OTHER USERS DATA FETCH END===========================================*/
/*--------------------------------------------FETCH DEFINITIONS END--------------------------------------------------*/

/*-----------------------------------------ON BUTTON ACTION DEFINITIONS----------------------------------------------*/
	/*=======================================COURSES ON BUTTON ACTIONS==========================================*/
	const onCourseAddButton = (event:any) => {
		event.preventDefault();
		setAddNewCourseFlag(true);
		setEditMode(true);
		
		const newRow = {
			id: nanoid(),
			shortcut: "",
			name: "",
			credits: 0,
			description: "",
			studentLimit: 9999,
			isApproved: false
		}

		const formData = {
			shortcut: "",
			name: "",
			credits: 0,
			description: "",
			studentLimit: 9999,
			isApproved: false
		}

		const newData = [...coursesTableData, newRow];

		console.log(newRow);
		console.log(newData);
		setCourseTermsTableData([]);
		setCourseLecturersTableData([]);
		setCourseRegistrationsTableData([]);
		setEditCourseFormData(formData);
		setCoursesTableData(newData);
		setEditCourseId(newRow.id);
	}

	const onCourseEditButton = (event:any, courseTableData:any) => {
		event.preventDefault();
		setEditMode(true);
		if (!addNewCourseFlag) {
			setEditCourseId(courseTableData.id);
			
			const rowValue = {
				shortcut: courseTableData.shortcut,
				name: courseTableData.name,
				credits: courseTableData.credits,
				description: courseTableData.description,
				studentLimit: courseTableData.studentLimit,
				isApproved: courseTableData.isApproved
			}
			//fetch terms
			fetchCourseTermsData(courseTableData.id);
			fetchCourseLecturersData(courseTableData.id);
			fetchCourseRegistrationsData(courseTableData.id, pageNumber);
			setEditCourseFormData(rowValue);
		}
	}

	const onCourseSaveButton = (event:any) => {
		event.preventDefault();

		const dataToPrepare = {
			id: editCourseId as any,
			shortcut: editCourseFormData.shortcut,
			name: editCourseFormData.name,
			credits: editCourseFormData.credits,
			description: editCourseFormData.description,
			studentLimit: editCourseFormData.studentLimit,
			isApproved: false
		}

		const tableDataCopy = [...coursesTableData];
		const index = coursesTableData.findIndex((td:any) => td.id === editCourseId);

		if (editCourseId != "" && dataToPrepare.shortcut != "" && dataToPrepare.name != "") {

			if(!addNewCourseFlag) // if edited
			{
				const dataToSend = {
					id: editCourseId as any,
					description: editCourseFormData.description?? ""
				}
				
				fetch(apiPath + "/course/setdescription", {
					method:"POST",
					cache: "no-cache",
					headers:{
						"Content-Type":"application/json",
					},
					body:JSON.stringify(dataToSend)
					}
				).then(res => {
					if(res.status != 200)
					{
						return null;
					}
					tableDataCopy[index] = dataToPrepare;
					setCoursesTableData(tableDataCopy);
					return res.json();
				}).then(recData => {
					console.log(recData);
				});
			}
			else // if new was created
			{
				const dataToSend = {
					shortcut: editCourseFormData.shortcut,
					name: editCourseFormData.name,
					credits: editCourseFormData.credits,
					description: editCourseFormData.description,
					studentLimit: editCourseFormData.studentLimit,
				}
				fetch(apiPath + "/course/create", {
					method:"POST",
					cache: "no-cache",
					headers:{
						"Content-Type":"application/json",
					},
					body:JSON.stringify(dataToSend)
					}
				).then(res => {
					if(res.status != 200)
					{
						return null;
					}
					tableDataCopy[index] = dataToPrepare;
					setCoursesTableData(tableDataCopy);
					return res.json();
				}).then(recData => {
					console.log(recData);
				});
			}
		} else {
			if (addNewCourseFlag) {
				tableDataCopy.splice(index, 1);
			}
		}

		fetchCoursesData();
		setAddNewCourseFlag(false);
		setEditCourseId(null);
		setEditMode(false);
	}

	const onCourseCloseButton = (event:any) => {
		if(addNewCourseFlag) {
			const tableDataCopy = [...coursesTableData];
			const index = coursesTableData.findIndex((td:any) => td.id === editCourseId);

			tableDataCopy.splice(index, 1);
			setCoursesTableData(tableDataCopy);
			setAddNewCourseFlag(false);
		}
		setEditCourseId(null);
		setEditMode(false);
	}

	const onCourseDeleteButton = (event:any, tableRowData:any) => {
		event.preventDefault();
		
		if (!addNewCourseFlag) {
			const dataToSend = {
				id: tableRowData.id
			}

			const tableDataCopy = [...coursesTableData];
			const index = coursesTableData.findIndex((td:any) => td.id === tableRowData.id);

			fetch(apiPath + "/course/delete", {
				method:"DELETE",
				cache: "no-cache",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then(res => {
				if(res.status != 200)
				{
					return null;
				}
				tableDataCopy.splice(index, 1);
				setCoursesTableData(tableDataCopy);
				return res.json();
			}).then(recData => {
				console.log(recData);
			});
		}
	}

	const handleCourseFormChange = (event:any, fieldName:string) => {
		event.preventDefault();

		const fieldValue = event.target.value;

		const newFormData = { ...editCourseFormData, [fieldName]: fieldValue };
		
		setEditCourseFormData(newFormData);
	}
	/*=====================================COURSES ON BUTTON ACTIONS END========================================*/

	/*===================================COURSE LECTURERS ON BUTTON ACTIONS=====================================*/
	const onCourseLecturerAddButton = (event:any) => {
		event.preventDefault();

		const formData = {
			id: "",
			login: ""
		}

		fetchOtherUsersData();
		setAddNewCourseLecturerFlag(true);
		setAddCourseLecturerFormData(formData);
	}

	const onCourseLecturerSaveButton = (event:any) => {
		event.preventDefault();

		const data = courseLecturersTableData.filter(
			(data) => 
				data.id === addCourseLecturerFormData.id
			);
		

		if (data.length == 0 && addCourseLecturerFormData.id != "") {

			const tableDataCopy = [...courseLecturersTableData];
			const index = courseLecturersTableData.length;

			const newLecturer = otherUsersTableData.filter(
				(data) => 
					data.id === addCourseLecturerFormData.id
				)[0];

			const dataPrepare = {
				id: addCourseLecturerFormData.id,
				login: addCourseLecturerFormData.login,
				name: newLecturer.name,
				surname: newLecturer.surname
			};

			const dataToSend = {
				id: addCourseLecturerFormData.id,
				courseid: editCourseId
			}

			fetch(apiPath + "/course/addlecturer", {
				method:"POST",
				cache: "no-cache",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then(res => {
				if(res.status != 200)
				{
					return null;
				}
				tableDataCopy[index] =  dataPrepare;
				setCourseLecturersTableData(tableDataCopy);
				return res.json();
			}).then(recData => {
				console.log(recData);
			});
		}

		setAddNewCourseLecturerFlag(false);
		setAddCourseLecturerFormData({
			id: "",
			login: ""
		});
	}

	const onCourseLecturerDeleteButton = (event:any, tableRowData:any) => {
		event.preventDefault();
		
		if (!addNewCourseLecturerFlag) {
			const tableDataCopy = [...courseLecturersTableData];
			const index = courseLecturersTableData.findIndex((td:any) => td.id === tableRowData.id);

			const dataToSend = {
				id: tableRowData.id,
				courseid: editCourseId
			}

			fetch(apiPath + "/course/deletelecturer", {
				method:"POST",
				cache: "no-cache",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then(res => {
				if(res.status != 200)
				{
					return null;
				}
				tableDataCopy.splice(index, 1);
				setCourseLecturersTableData(tableDataCopy);
				return res.json();
			}).then(recData => {
				console.log(recData);
			});
		}
	}

	const handleCourseLecturerFormChange = (event:any) => {
		event.preventDefault();

		const userid = event.target.value;
		const userlogin = otherUsersTableData.filter(
			(data) => 
				data.id === userid
			)[0].login;

		const newFormData = {
			id: userid,
			login: userlogin
		}
		
		setAddCourseLecturerFormData(newFormData);
	}
	/*================================COURSE LECTURERS ON BUTTON ACTIONS END====================================*/

	/*================================COURSE REGISTRATIONS ON BUTTON ACTIONS====================================*/
	const onCourseRegistrationAcceptClicked = (event:any, tableData:any) => {
		const dataToSend = {
			id:tableData.id
		}
	
		const tableDataCopy = [...courseRegistrationsTableData];
		const index = courseRegistrationsTableData.findIndex((td:any) => td.id === tableData.id);
	
		fetch(apiPath + "/courseregistration/approve", {
			method:"POST",
			cache: "no-cache",
			headers:{
				"Content-Type":"application/json",
			},
			body:JSON.stringify(dataToSend)
			}
		).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			tableDataCopy.splice(index, 1);
			setCourseRegistrationsTableData(tableDataCopy);
			return res.json();
		}).then(recData => {
			console.log(recData);
		});
	}
	
	const onCourseRegistrationDeclineClicked = (event:any, tableData:any) => {
		const dataToSend = {
			id:tableData.id
		}
	
		const tableDataCopy = [...courseRegistrationsTableData];
		const index = courseRegistrationsTableData.findIndex((td:any) => td.id === tableData.id);
	
		fetch(apiPath + "/courseregistration/deny", {
			method:"POST",
			cache: "no-cache",
			headers:{
				"Content-Type":"application/json",
			},
			body:JSON.stringify(dataToSend)
			}
		).then(res => {
			if(res.status != 200)
			{
				return null;
			}
			tableDataCopy.splice(index, 1);
			setCourseRegistrationsTableData(tableDataCopy);
			return res.json();
		}).then(recData => {
			console.log(recData);
		});
	}
	/*==============================COURSE REGISTRATIONS ON BUTTON ACTIONS END==================================*/

	/*====================================COURSE TERMS ON BUTTON ACTIONS========================================*/
	const onCourseTermEditButton = (event:any, termTableData:any) => {
		event.preventDefault();
		if (!addNewCourseTermFlag) {
			console.log(termTableData.id)
			setEditCourseTermId(termTableData.id);
			
			const rowValue = {
				classname: termTableData.classname,
				description: termTableData.description,
				startDate: termTableData.startDate,
				endDate: termTableData.endDate,
				registrationStartDate: termTableData.registrationStartDate,
				registrationEndDate: termTableData.registrationEndDate,
				maxMark: termTableData.maxMark,
				studentLimit: termTableData.studentLimit,
				students: termTableData.students,
				isRegistrationEnabled: termTableData.isRegistrationEnabled,
				isOptional: termTableData.isOptional
			}

			setEditCourseTermFormData(rowValue);
		}
	}

	const onCourseTermAddButton = (event:any) => {
		event.preventDefault();
		setAddNewCourseTermFlag(true);
			
		const newRow = {
			id: nanoid(),
			classname: "",
			description: "",
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
			registrationStartDate: new Date().toISOString(),
			registrationEndDate: new Date().toISOString(),
			maxMark: 0,
			studentLimit: 9999,
			students: 0,
			isRegistrationEnabled: false,
			isOptional: false
		}

		const formData = {
			classname: "",
			description: "",
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
			registrationStartDate: new Date().toISOString(),
			registrationEndDate: new Date().toISOString(),
			maxMark: 0,
			studentLimit: 9999,
			students: 0,
			isRegistrationEnabled: false,
			isOptional: false
		}

		const newData = [...courseTermsTableData, newRow];

		console.log(newRow);
		console.log(newData);
		setEditCourseTermFormData(formData);
		setCourseTermsTableData(newData);
		setEditCourseTermId(newRow.id);
	}

	const onCourseTermSaveButton = (event:any) => {
		event.preventDefault();

		const dataToPrepare = {
			id: editCourseTermId as any,
			classname: editCourseTermFormData.classname as any,
			description: editCourseTermFormData.description,
			startDate: editCourseTermFormData.startDate,
			endDate: editCourseTermFormData.endDate,
			registrationStartDate: editCourseTermFormData.registrationStartDate,
			registrationEndDate: editCourseTermFormData.registrationEndDate,
			maxMark: editCourseTermFormData.maxMark,
			studentLimit: editCourseTermFormData.studentLimit,
			students: editCourseTermFormData.students,
			isRegistrationEnabled: editCourseTermFormData.isRegistrationEnabled,
			isOptional: editCourseTermFormData.isOptional,
		}

		const tableDataCopy = [...courseTermsTableData];
		const index = courseTermsTableData.findIndex((td:any) => td.id === editCourseTermId);

		if (editCourseTermId != "" && dataToPrepare.classname != "") {
			console.log(editCourseTermFormData);

			if (addNewCourseTermFlag) // if created
			{
				const dataToSend = {
					id: editCourseTermId as any,
					courseid: editCourseId,
					classname: editCourseTermFormData.classname as any,
					description: editCourseTermFormData.description,
					startDate: editCourseTermFormData.startDate,
					endDate: editCourseTermFormData.endDate,
					registrationStartDate: editCourseTermFormData.registrationStartDate,
					registrationEndDate: editCourseTermFormData.registrationEndDate,
					maxMark: editCourseTermFormData.maxMark,
					studentLimit: editCourseTermFormData.studentLimit,
					isRegistrationEnabled: editCourseTermFormData.isRegistrationEnabled,
					isOptional: editCourseTermFormData.isOptional,
				}

				fetch(apiPath + "/term/create", {
					method:"POST",
					cache: "no-cache",
					headers:{
						"Content-Type":"application/json",
					},
					body:JSON.stringify(dataToSend)
					}
				).then(res => {
					if(res.status != 200)
					{
						tableDataCopy.splice(index, 1);
						setCourseTermsTableData(tableDataCopy);
						return null;
					}
					tableDataCopy[index] =  dataToPrepare;
					setCourseTermsTableData(tableDataCopy);
					return res.json();
				}).then(recData => {
					console.log(recData);
				});
			}
			else
			{
				const dataToSend = {
					id: editCourseTermId as any,
					classname: editCourseTermFormData.classname as any,
					description: editCourseTermFormData.description?? "",
					startDate: editCourseTermFormData.startDate,
					endDate: editCourseTermFormData.endDate,
					registrationStartDate: editCourseTermFormData.registrationStartDate,
					registrationEndDate: editCourseTermFormData.registrationEndDate,
					maxMark: editCourseTermFormData.maxMark,
					studentLimit: editCourseTermFormData.studentLimit,
					isRegistrationEnabled: editCourseTermFormData.isRegistrationEnabled,
					isOptional: editCourseTermFormData.isOptional,
				}

				console.log(dataToSend);

				fetch(apiPath + "/term/edit", {
					method:"POST",
					cache: "no-cache",
					headers:{
						"Content-Type":"application/json",
					},
					body:JSON.stringify(dataToSend)
					}
				).then(res => {
					if(res.status != 200)
					{
						return null;
					}
					tableDataCopy[index] =  dataToPrepare;
					setCourseTermsTableData(tableDataCopy);
					return res.json();
				}).then(recData => {
					console.log(recData);
				});
			}

			tableDataCopy[index] = dataToPrepare;
		} else {
			if (addNewCourseTermFlag) {
				tableDataCopy.splice(index, 1);
			}
		}
		if(editCourseId != null) {
			fetchCourseTermsData(editCourseId);
		}
		setAddNewCourseTermFlag(false);
		setEditCourseTermId(null);
	}

	const onCourseTermCloseButton = (event:any) => {
		if(addNewCourseTermFlag) {
			const tableDataCopy = [...courseTermsTableData];
			const index = courseTermsTableData.findIndex((td:any) => td.id === editCourseTermId);

			tableDataCopy.splice(index, 1);
			setCourseTermsTableData(tableDataCopy);
			setAddNewCourseTermFlag(false);
		}
		setEditCourseTermId(null);
	}

	const onCourseTermDeleteButton = (event:any, tableRowData:any) => {
		event.preventDefault();
		
		if (!addNewCourseTermFlag) {
			const dataToSend = {
				id: tableRowData.id
			}

			const tableDataCopy = [...courseTermsTableData];
			const index = courseTermsTableData.findIndex((td:any) => td.id === tableRowData.id);

			fetch(apiPath + "/term/delete", {
				method:"DELETE",
				cache: "no-cache",
				headers:{
					"Content-Type":"application/json",
				},
				body:JSON.stringify(dataToSend)
				}
			).then(res => {
				if(res.status != 200)
				{
					return null;
				}
				tableDataCopy.splice(index, 1);
				setCourseTermsTableData(tableDataCopy);
				return res.json();
			}).then(recData => {
				console.log(recData);
			});
		}
	}

	const handleCourseTermFormChange = (event:any, fieldName:string) => {
		event.preventDefault();
		const fieldValue = event.target.value;
		if (fieldName.includes("Date"))
		{
			const newTermFormData = { ...editCourseTermFormData, [fieldName]: new Date(fieldValue) };
			setEditCourseTermFormData(newTermFormData);
		}
		else 
		{
			const newTermFormData = { ...editCourseTermFormData, [fieldName]: fieldValue };
			setEditCourseTermFormData(newTermFormData);
		}
		
	}

	const handleCourseTermCheckboxFormChange = (event:any, fieldName:string) => {
		event.preventDefault();

		const fieldValue = event.target.checked;
		const newTermFormData = { ...editCourseTermFormData, [fieldName]: fieldValue };
		
		setEditCourseTermFormData(newTermFormData);
	}
	/*==================================COURSE TERMS ON BUTTON ACTIONS END=======================================*/
/*---------------------------------------ON BUTTON ACTION DEFINITIONS END--------------------------------------------*/

	/*=========================================COMMON PAGE EFFECTS==============================================*/
	useEffect(() => {
        fetchCoursesData();
    }, [])
	/*=======================================COMMON PAGE EFFECTS END============================================*/

	return (
		<div id="garantPage">	
			<PageHeader apiPath={apiPath} homePage='/home' useLogout={true}></PageHeader>
			{
				editMode?
					<div id="garantCourseEdit">
						<div id="courseEditPageContent" className="blurable">
							<h1>Kurz {editCourseFormData.shortcut}</h1>
							<div id="courseEditSpace">
								<div id="courseParams">
									<TextField 
										value={editCourseFormData.shortcut}
										size="small" 
										placeholder='Skratka' 
										id="standard-basic" 
										label="Skratka" 
										variant="standard" 
										disabled={!addNewCourseFlag}
										required
										onChange={(event) => handleCourseFormChange(event, "shortcut")}
									/>
									<br/><br/>
									<TextField 
										value={editCourseFormData.name}
										size="medium" 
										placeholder='Názov' 
										id="standard-basic" 
										label="Názov" 
										variant="standard" 
										disabled={!addNewCourseFlag}
										required
										onChange={(event) => handleCourseFormChange(event, "name")}
									/>
									<br/><br/>
									<textarea 
										value={editCourseFormData.description}
										rows={9}
										placeholder = "Popis"
										onChange={(event) => handleCourseFormChange(event, "description")}
									/>
									<br/><br/>
									<TextField 
										value={editCourseFormData.studentLimit}
										size="small" 
										placeholder= "Limit študentov" 
										id="standard-basic" 
										label="Limit študentov" 
										variant="standard" 
										disabled={!addNewCourseFlag}
										required
										onChange={(event) => handleCourseFormChange(event, "studentLimit")}
									/>
									<br/><br/>
									<TextField 
										value={editCourseFormData.credits}
										size="small" 
										placeholder= "Počet kreditov" 
										id="standard-basic" 
										label="Počet kreditov" 
										variant="standard" 
										disabled={!addNewCourseFlag}
										required
										onChange={(event) => handleCourseFormChange(event, "credits")}
									/>
									<br/><br/>
									<label>Schváleno:</label>
									<Checkbox
										disabled 
										checked={editCourseFormData.isApproved}
									/>
									<br/>
									<Button onClick={onCourseSaveButton}>Uložiť</Button>
									<Button onClick={onCourseCloseButton}>Zavrieť</Button>
								</div>
								<div id="courseRelated">
									{
										!addNewCourseFlag? 
										<div>
											<div id="courseRegistrationRequests">
												<h3>Žiadosti o registráciu na kurz</h3>
												<form>
													<Fragment>
														{
															(courseRegistrationsTableData != null && courseRegistrationsFetchInProgressFlag == false)?
																<Table sx={{ boxShadow: 2}}	>
																	<colgroup>
																		<col style={{width:'30%'}}/>
																		<col style={{width:'30%'}}/>
																		<col style={{width:'40%'}}/>
																	</colgroup>
																	<TableHead>
																		<TableRow>
																			<TableCell>Login</TableCell>
																			<TableCell>Meno</TableCell>
																			<TableCell>Priezvisko</TableCell>
																			<TableCell></TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{courseRegistrationsTableData.map((td:any) => (
																			<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																				<TableCell sx={{ borderBottom: '0'}}>{td.login}</TableCell>
																				<TableCell sx={{ borderBottom: '0'}}>{td.name}</TableCell>
																				<TableCell sx={{ borderBottom: '0'}}>{td.surname}</TableCell>
																				<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
																					<Button onClick={(event) => onCourseRegistrationAcceptClicked(event, td)}><i className="fa-solid fa-thumbs-up"></i></Button>
																					<Button onClick={(event) => onCourseRegistrationDeclineClicked(event, td)}><i className="fa-solid fa-thumbs-down"></i></Button>
																				</TableCell>
																			</TableRow>
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
															:
																<Fragment>
																	{
																		(courseRegistrationsFetchInProgressFlag == false)?
																			<CannotLoadError text="registrácie na kurz"></CannotLoadError>
																		:
																			<LoadingSign></LoadingSign>
																	}
																</Fragment>
														}
													</Fragment>
												</form>
											</div>
											<div id="lecturersOfCourse">
												<h3>Prednášajúci</h3>
												<form>
													<Fragment>
														{
															(courseLecturersTableData != null && courseLecturersFetchInProgressFlag == false)?
																<Table sx={{ boxShadow: 2}}>
																	<colgroup>
																		<col style={{width:'30%'}}/>
																		<col style={{width:'30%'}}/>
																		<col style={{width:'30%'}}/>
																		<col style={{width:'10%'}}/>
																	</colgroup>
																	<TableHead>
																		<TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																			<TableCell>Login</TableCell>
																			<TableCell>Meno</TableCell>
																			<TableCell>Priezvisko</TableCell>
																			<TableCell onClick={onCourseLecturerAddButton} style={{display:'flex', justifyContent:'center'}}><Button ><i style={{fontSize:20}} className='fa fa-plus-square'></i></Button></TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{courseLecturersTableData.map((td:any) => (
																			<Fragment>
																				{
																					<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																						<TableCell sx={{ borderBottom: '0'}}>{td.login}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>{td.name}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>{td.surname}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
																							<Button onClick={(event) => onCourseLecturerDeleteButton(event, td)}><i className='fas fa-eraser'></i></Button>
																						</TableCell>
																					</TableRow>
																				}
																			</Fragment>
																		))}
																		{
																			<Fragment>
																				{
																					(addNewCourseLecturerFlag && (otherUsersTableData != null && otherUsersTableData.length > 0)) ?
																						<TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																							<TableCell>
																								<InputLabel id="lectureLogin">Login uživateľa</InputLabel>
																								<Select
																									labelId="lectureLogin"
																									name='login'
																									id="standard-basic"
																									value={addCourseLecturerFormData.id}
																									label="Login uživateľa"
																									placeholder='xlogin00' 
																									onChange={(event) => handleCourseLecturerFormChange(event)}
																								>
																									{
																										otherUsersTableData.map((td:any) => (
																											<MenuItem value={td.id}>{td.login}</MenuItem>
																										))
																									}
																								</Select>
																							</TableCell>
																							<TableCell  sx={{ borderBottom: '0'}} style={{textAlign: 'center'}}></TableCell>
																							<TableCell  sx={{ borderBottom: '0'}} style={{textAlign: 'center'}}></TableCell>
																							<TableCell  sx={{ borderBottom: '0'}} style={{textAlign: 'center'}}>
																								<Button onClick={onCourseLecturerSaveButton}>Uložit</Button>
																							</TableCell>
																						</TableRow>
																					:
																						<></>
																				}
																			</Fragment>
																		}
																	</TableBody>
																</Table>
															:
																<Fragment>
																	{
																		(courseLecturersFetchInProgressFlag == false)?
																			<CannotLoadError text="prednášajúci kurzu"></CannotLoadError>
																		:
																			<LoadingSign></LoadingSign>
																	}
																</Fragment>
														}
													</Fragment>
												</form>
											</div>
											<div id="termTable">
												<h3>Správa termínu</h3>
												<form>
													<Fragment>
														{
															(courseTermsTableData != null && courseTermsFetchInProgressFlag == false)?
																<Table sx={{ boxShadow: 2}}	>
																	<colgroup>
																		<col style={{width:'25%'}}/>
																		<col style={{width:'25%'}}/>
																		<col style={{width:'25%'}}/>
																		<col style={{width:'5%'}}/>
																		<col style={{width:'5%'}}/>
																		<col style={{width:'15%'}}/>
																	</colgroup>
																	<TableHead>
																		<TableRow>
																			<TableCell>Názov</TableCell>
																			<TableCell>Začiatok</TableCell>
																			<TableCell>Koniec</TableCell>
																			<TableCell>Registrácia</TableCell>
																			<TableCell>Voliteľné</TableCell>
																			<TableCell
																				onClick={(event) => {
																					onPopupEvent(event);
																					setButtonTermPopup(true);
																					onCourseTermAddButton(event);
																				}} 
																				style={{display:'flex', justifyContent:'center'}}><Button ><i style={{fontSize:20}} className='fa fa-plus-square'></i></Button></TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{courseTermsTableData.map((td:any) => (
																			<Fragment>
																				<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																						<TableCell sx={{ borderBottom: '0'}}>{td.classname}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>{(td.startDate != null) ? (new Date(td.startDate)).toISOString().substring(0, 10) : ""}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>{(td.endDate != null) ? (new Date(td.endDate)).toISOString().substring(0, 10) : ""}</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>
																							<Checkbox
																								disabled 
																								checked={td.isRegistrationEnabled} 
																							/>
																						</TableCell>
																						<TableCell sx={{ borderBottom: '0'}}>
																							<Checkbox
																								disabled 
																								checked={td.isOptional} 
																							/>
																						</TableCell>
																						<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
																							<Button 
																								onClick={(event) => {
																									onPopupEvent(event);
																									setButtonTermPopup(true);
																									onCourseTermEditButton(event, td);
																								}}
																							>
																									<i className='far fa-edit'></i>
																							</Button>
																							<Button onClick={(event) => onCourseTermDeleteButton(event, td)}><i className='fas fa-eraser'></i></Button>
																						</TableCell>
																					</TableRow>
																			</Fragment>
																		))}
																	</TableBody>
																</Table>
															:
																<Fragment>
																	{
																		(courseTermsFetchInProgressFlag == false)?
																			<CannotLoadError text="termíny kurzu"></CannotLoadError>
																		:
																			<LoadingSign></LoadingSign>
																	}
																</Fragment>
														}
													</Fragment>
												</form>
											</div>
										</div>
										:
										<></>
									}
								</div>
							</div>
						</div>
						<div id="termPopup">
							<Popup triggered={buttonTermPopup} setTrigger={setButtonTermPopup}>
								<div className='popupScroll'>
									<h1>Termín {editCourseFormData.shortcut}</h1>
									<Fragment>
										<TextField 
											value={editCourseTermFormData.classname}
											size="small" 
											placeholder='Názov' 
											id="standard-basic" 
											label="Názov" 
											variant="standard" 
											required
											onChange={(event) => handleCourseTermFormChange(event, "classname")}
										/>
										<br/><br/>
										<textarea 
											value={editCourseTermFormData.description}
											rows={9}
											placeholder = "Popis"
											onChange={(event) => handleCourseTermFormChange(event, "description")}
										/>
										<br/><br/>
										<InputLabel id="startdate">Začiatok</InputLabel>
										<TextField 
											value={((editCourseTermFormData.startDate != null)? new Date(editCourseTermFormData.startDate) : new Date()).toISOString().substring(0, 16)}
											type="datetime-local"
											size="small" 
											placeholder='' 
											id="standard-basic" 
											variant="standard" 
											required
											onChange={(event) => handleCourseTermFormChange(event, "startDate")}
										/>
										<InputLabel id="enddate">Koniec</InputLabel>
										<TextField 
											value={((editCourseTermFormData.endDate != null)? new Date(editCourseTermFormData.endDate) : new Date()).toISOString().substring(0, 16)}
											type="datetime-local"
											size="small" 
											placeholder='' 
											id="standard-basic" 
											variant="standard" 
											required
											onChange={(event) => handleCourseTermFormChange(event, "endDate")}
										/>
										<br/><br/>
										<Fragment>
											{
												editCourseTermFormData.isRegistrationEnabled? 
												<div>
													<InputLabel id="rstartdate">Začiatok registrácie</InputLabel>
													<TextField 
														value={((editCourseTermFormData.registrationStartDate != null)? new Date(editCourseTermFormData.registrationStartDate) : new Date()).toISOString().substring(0, 16)}
														type="datetime-local"
														size="small" 
														id="standard-basic" 
														variant="standard" 
														required={editCourseTermFormData.isRegistrationEnabled}
														onChange={(event) => handleCourseTermFormChange(event, "registrationStartDate")}
													/>
													<InputLabel id="renddate">Koniec registrácie</InputLabel>
													<TextField 
														value={((editCourseTermFormData.registrationEndDate != null)? new Date(editCourseTermFormData.registrationEndDate) : new Date()).toISOString().substring(0, 16)}
														type="datetime-local"
														size="small" 
														id="standard-basic" 
														variant="standard" 
														required={editCourseTermFormData.isRegistrationEnabled}
														onChange={(event) => handleCourseTermFormChange(event, "registrationEndDate")}
													/>
													<br/><br/>
												</div>
												:
												<></>
											}
										</Fragment>
										<TextField
											value={editCourseTermFormData.maxMark}
											size="small"
											placeholder='Max bodov'
											id="standard-basic"
											label="Max bodov"
											variant="standard"
											onChange={(event) => handleCourseTermFormChange(event, "maxMark")}
										/>
										<br/><br/>
										<TextField
											value={editCourseTermFormData.studentLimit}
											size="small"
											placeholder='Limit študentov'
											id="standard-basic"
											label="Limit študentov"
											variant="standard"
											onChange={(event) => handleCourseTermFormChange(event, "studentLimit")}
										/>
										<br/><br/>
										<label>Registrácia:</label>
										<Checkbox
											checked={editCourseTermFormData.isRegistrationEnabled} 
											onChange={(event) => handleCourseTermCheckboxFormChange(event, "isRegistrationEnabled")}
											inputProps={{ 'aria-label': 'Registration' }}
										/>
										<br/>
										<label>Voliteľné:</label>
										<Checkbox
											checked={editCourseTermFormData.isOptional}
											onChange={(event) => handleCourseTermCheckboxFormChange(event, "isOptional")}
											inputProps={{ 'aria-label': 'Optional' }}
										/>
										<br/>
										<Button 
											onClick={(event) => {
												onPopupEvent(event);
												setButtonTermPopup(false);
												onCourseTermSaveButton(event);
											}}
										>Uložiť</Button>
										<Button 
											onClick={(event) => {
											onPopupEvent(event);
											setButtonTermPopup(false);
											onCourseTermCloseButton(event);
										}}
										>Zavrieť</Button>
										
									</Fragment>
								</div>
							</Popup>
						</div>
					</div>
				:
					<div id="garantPageMainContent">
						<div id="courseTable">
							<h1>Kurzy</h1>
							<form>
								<Fragment>
									{
										(coursesTableData != null && coursesFetchInProgressFlag == false)?
											<Table sx={{ boxShadow: 2}}	>
												<colgroup>
													<col style={{width:'10%'}}/>
													<col style={{width:'35%'}}/>
													<col style={{width:'20%'}}/>
													<col style={{width:'20%'}}/>
													<col style={{width:'10%'}}/>
													<col style={{width:'15%'}}/>
												</colgroup>
												<TableHead>
													<TableRow>
														<TableCell>Skratka</TableCell>
														<TableCell>Názov</TableCell>
														<TableCell>Počet kreditov</TableCell>
														<TableCell>Limit študentov</TableCell>
														<TableCell>Schválené</TableCell>
														<TableCell onClick={onCourseAddButton} style={{display:'flex', justifyContent:'center'}}><Button ><i style={{fontSize:20}} className='fa fa-plus-square'></i></Button></TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{coursesTableData.map((td:any) => (
														<Fragment>
															<TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
																	<TableCell sx={{ borderBottom: '0'}}>{td.shortcut}</TableCell>
																	<TableCell sx={{ borderBottom: '0'}}>{td.name}</TableCell>
																	<TableCell sx={{ borderBottom: '0'}}>{td.credits}</TableCell>
																	<TableCell sx={{ borderBottom: '0'}}>{td.studentLimit}</TableCell>
																	<TableCell sx={{ borderBottom: '0'}}>
																		<Checkbox
																			disabled 
																			checked={td.isApproved} 
																		/>
																	</TableCell>
																	<TableCell sx={{ borderBottom: '0'}} style={{display:'flex'}}>
																		<Button onClick={(event) => onCourseEditButton(event, td)}><i className='far fa-edit'></i></Button>
																		<Button onClick={(event) => onCourseDeleteButton(event, td)}><i className='fas fa-eraser'></i></Button>
																	</TableCell>
																</TableRow>
														</Fragment>
													))}
												</TableBody>
											</Table>
										:
											<Fragment>
												{
													(coursesFetchInProgressFlag == false)?
														<CannotLoadError text="kurzy"></CannotLoadError>
													:
														<LoadingSign></LoadingSign>
												}
											</Fragment>
									}
								</Fragment>
							</form>
						</div>
					</div>
			}
			<PageFooter></PageFooter>
		</div>
	);
	
}

export default GarantPage;