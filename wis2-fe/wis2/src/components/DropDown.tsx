type Props = {
  dropDownData:any
  onChange:any
}

function DropDown({dropDownData, onChange}: Props) {
  return (
    <div>
      <select className="dropDown" name="courses" id="courses" onChange={onChange}>
        {dropDownData.map((opt:any) => (
          <option key={opt.id} value={opt.value}>{opt.text}</option>
        ))}
      </select>
    </div>
  );
}

export default DropDown;
