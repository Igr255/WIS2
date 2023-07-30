import './LogoutButton.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

type Props = {
  apiPath:string
}

function LogoutButton({apiPath}:Props) {

  let navigate = useNavigate();

  const logoutUser = (event:any) => {
		event.preventDefault();
		fetch(apiPath + "/user/logout", {
        method:"GET",
        cache: "no-cache",
        headers:{
          "content-type":"application/json"
        }
			}
		).then((response) => {
      console.log(response);
      if (response.ok) {
        navigate("/");
      }
    })
	}

  return (
    <Button onClick={logoutUser}><i className="fa-solid fa-power-off"></i></Button>
  );
}

export default LogoutButton;
