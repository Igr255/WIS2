import { MouseEventHandler } from 'react';
import './EventButton.css';

type Props = {
    buttonText:string
    onClick:MouseEventHandler<HTMLButtonElement>
}

function LinkButton({buttonText, onClick}: Props) {

  return (
    <button className="button" onClick={onClick}>{buttonText}</button>
  );
}

export default LinkButton;
