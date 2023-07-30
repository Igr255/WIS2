import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import data from '../mockData/mockAccordionData.json';
import '../App.css';

type Props = {
	apiPath:string
}

function EmployeePage({apiPath}:Props) {
	const [acordionData, setAcordionData] = useState(data);

	useEffect(() => {
		fetch(apiPath + '/course/list').then(res => res.json()).then(recData => {
		  setAcordionData(recData);
		});
	  }, []);

	return (
	<div>
		<PageHeader apiPath={apiPath} homePage='/home' useLogout={false}></PageHeader>
			<div id="noAccMainContent">
				<h1>Prehlad kurzov</h1>
				<Accordion defaultActiveKey="0">
					{acordionData.map((ac:any) => (
						<Accordion.Item eventKey={ac.id} key={ac.id}>
							<Accordion.Header>{ac.name}</Accordion.Header>
							<Accordion.Body>
							{ac.description}
							</Accordion.Body>
						</Accordion.Item>
					))}
				</Accordion>
			</div>
		<PageFooter></PageFooter>
	</div>
	);
}

export default EmployeePage;
