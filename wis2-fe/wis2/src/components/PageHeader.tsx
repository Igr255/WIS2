import './PageHeader.css';
import LogoutButton from './LogoutButton';

type Props = {
  homePage:string
  useLogout:boolean
  apiPath:string
}

function PageHeader({homePage, useLogout, apiPath}: Props) {
  return (
    <div id="header">
      <div id="headerLogo">
        <a href={homePage}>
          <p id="wisName">Wis</p>i.m
        </a>
        <div id="headerImage"></div>
      </div>
      
      {
      useLogout ?
        <div id="headerLogOut">
          <LogoutButton apiPath={apiPath}></LogoutButton>
        </div> 
        :
        <div></div>
      }
		</div>
  );
}

export default PageHeader;
