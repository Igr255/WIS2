import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Props = {
  apiPath:string
}

const PrivateRouteUser = ({apiPath}:Props) => {
  const [eauth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    var tmp = apiPath + "/user/auth/user";
    console.log(tmp);

    fetch(tmp, {
      method:"GET",
      cache: "no-cache",
      headers:{
        "content-type":"application/json",
      }})
    .then(res => res.json()).then(recData => {
      console.log("DATA:",recData.level);
      if (recData.level === true) {
        console.log("hej");
        setLoading(false)
        setAuth(true)
      } else {
        console.log("ne");
        setAuth(false)
        setLoading(false)
      }
    });
  }, []);

  return (
    loading ? <div></div> : eauth ? <Outlet/> : <Navigate to="/"/>
  );
}

export default PrivateRouteUser;
