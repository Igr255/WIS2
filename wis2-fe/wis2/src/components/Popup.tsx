import { Identifier } from 'typescript';
import './Popup.css';

type Props = {
    triggered:any
    setTrigger:any
    children?: JSX.Element | JSX.Element[];
}

const onPopupEvent = (event:any) => {
    var blurables = document.getElementsByClassName('blurable');
    for (var i = 0; i < blurables.length; i++) {
        var blurable = blurables[i];
        blurable.classList.toggle('blur');
    }
}

function Popup({triggered, setTrigger, children}:Props) {
    return (triggered) ? (
        <div className="popup">
            <div className="popup-inner">
                {children}
            </div>
        </div>
    ) : ( <></>);
}

export {Popup, onPopupEvent};