import LinkButton from '../components/LinkButton';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import '../App.css';

type Props = {
	apiPath:string
}

function StudentPage({apiPath}:Props) {
  return (
  <div>
    <PageHeader apiPath={apiPath} homePage='/home' useLogout={true}></PageHeader>
		<div id="studentPageMainContent">
			<div id="buttonMenu">
				<LinkButton linkText='Profil' linkValue='/userProfile'></LinkButton>
				<LinkButton linkText='Registrácie predmetov' linkValue='/courseRegistration'></LinkButton>
				<LinkButton linkText='Aktuálne predmety' linkValue='/registeredSubjects'></LinkButton>
				<LinkButton linkText='Rozvrh' linkValue='/timeTable'></LinkButton>
			</div>
		</div>
	<PageFooter></PageFooter>
  </div>
  );
}

export default StudentPage;
