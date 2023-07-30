import '../App.css';
import LinkButton from '../components/LinkButton';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';

type Props = {
    apiPath:string
}

function HomePage({apiPath}:Props) {
    return (
    <div>
    <PageHeader apiPath={apiPath} homePage='/home' useLogout={true}></PageHeader>
    <div id="mainHomePageContent">
        <div id="buttonMenu">
            <LinkButton linkText='Študent' linkValue='/student'></LinkButton>
            <LinkButton linkText='Zamestnanec' linkValue='/employee'></LinkButton>
            <LinkButton linkText='Admin' linkValue='/adminPage'></LinkButton>
        </div>
    </div>

    <PageFooter></PageFooter>
    </div>
    );
}

export default HomePage;
