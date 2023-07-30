import './LinkButton.css';
import { Link } from 'react-router-dom';

type Props = {
    linkValue:string
    linkText:string
}

function LinkButton({linkValue, linkText}: Props) {
  return (
  <div className='mainButton'>
    <Link to={linkValue}>{linkText}</Link>
  </div>
  );
}

export default LinkButton;
