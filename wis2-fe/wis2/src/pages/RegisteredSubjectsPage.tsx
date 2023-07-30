import { useEffect, useState } from 'react';
import DetailsTable from '../components/DetailsTable';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import '../App.css';
import data from '../mockData/mockRegistrationtableData.json';

type Props = {
	apiPath:string
}

function RegisteredSubjectsPage({apiPath}:Props) {
	const [tableData, setTableData] = useState(data);
	//const [year, setYear] = useState("ziadenrok");
	
	useEffect(() => {
		fetch(apiPath + '/course/list/registered').then(res => res.json()).then(recData => {
			setTableData(recData);
		});
	}, []);

	/*useEffect(() => {
		fetch('/year').then(res => res.json()).then(recData => {
			setYear(recData.year);
		});
	}, []);*/

	return (
	<div>
		<PageHeader apiPath={apiPath}  homePage='/home' useLogout={true}></PageHeader>
			<div id="registeredSubjectsMainContent">
				<DetailsTable tableData={tableData}></DetailsTable>
			</div>
		<PageFooter></PageFooter>
	</div>
	);
}

export default RegisteredSubjectsPage;
