import logo from './logo.svg';
import './Table.css';

type Props = {
  tableData:any
}

function Table({tableData}:Props) {
  return (
    <table id="registrationTable" className='wisTable'>
      <thead>
        <tr>
          <th>Nazov</th>
          <th>Datum hodnotenia</th>
          <th>Hodnotiaci</th>
          <th>Body</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((td:any) => (
          <tr key={td.id}>
              <td>{td.course}</td>
              <td>{td.date}</td>
              <td>{td.lecturer}</td>
              <td>{td.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
