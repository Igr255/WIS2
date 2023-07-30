import { useEffect, useState } from 'react';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import data from '../mockData/mockCalendarData.json';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import '../App.css'

type Props = {
	apiPath:string
}

function SubjectRegistrationPage({apiPath}:Props) {
	const [calendarData, setCalendarData] = useState(data) as any;
	
	
	useEffect(() => {
	  fetch(apiPath + '/term/listupcoming/monked').then(res => res.json()).then(recData => {
		console.log(recData);
		setCalendarData(recData);
	  });
	}, []);

	useEffect(() => {
		//document.getElementsByTagName
	}, [])
	
	return (
		<div>
			<PageHeader apiPath={apiPath}  homePage='/home' useLogout={true}></PageHeader>
			<div id="timeTablePage">
				<div className="timeTable">
					<FullCalendar
						initialView='timeGridWeek'
						locale={'sk'}
						headerToolbar={{
							left: 'prev,next today',
							center: 'title',
							right: 'dayGridMonth,timeGridWeek,timeGridDay',
							}}
						buttonText = {{
							today: 'Dnes',
							month: 'Mesiac',
							week: 'Týždeň',
							day: 'Deň',
							allday: 'E'
						}}
						themeSystem="Simplex"
						plugins={[dayGridPlugin, timeGridPlugin]}
						events={calendarData}
					/>
				</div>
			</div>
			<PageFooter></PageFooter>
		</div>
	);
}

export default SubjectRegistrationPage;
