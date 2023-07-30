import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

type Props = {
    tableData:any
}

function DetailsTable({tableData}:Props) {
    return (
        <div>
            <Table id="detailsTable" sx={{ boxShadow: 2}}>
                <TableHead>
                    <TableRow sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
                        <TableCell>Skratka predmet</TableCell>
                        <TableCell>Nazov predmetu</TableCell>
                        <TableCell>Pocet kreditov</TableCell>
                        <TableCell>Pocet bodov</TableCell>
                        <TableCell>Detail Predmetu</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((td:any) => (
                    <TableRow key={td.id} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
                        <TableCell>{td.shortcut}</TableCell>
                        <TableCell>{td.fullname}</TableCell>
                        <TableCell>{td.credits}</TableCell>
                        <TableCell>{td.points}</TableCell>
                        <TableCell><Link to={'registeredSubjectsDetails/' + td.shortcut + '/' + td.id}>detail</Link></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default DetailsTable;
