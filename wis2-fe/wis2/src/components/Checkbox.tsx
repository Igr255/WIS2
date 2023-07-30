type Props = {
  id:string
  checkBoxName:string
}

function Checkbox({id, checkBoxName}:Props) {
  return (
  <div>
    <input type="checkbox" value={id} className={checkBoxName}/>
  </div>
  );
}

export default Checkbox;
