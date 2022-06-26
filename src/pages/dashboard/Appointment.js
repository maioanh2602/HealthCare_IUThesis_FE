import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { paramCase } from 'change-case';
import { useSnackbar } from 'notistack';

import {
  Container,
  Button,
  TableContainer,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  Box,
  TablePagination,
} from '@mui/material';
import axios from '../../utils/axios';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import { UserTableRow } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstName', label: 'First name', align: 'left' },
  { id: 'lastName', label: 'Last name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'time', label: 'Time', align: 'left' },
  { id: '' },
];

const TABLE_HEAD_ADMIN = [
  { id: 'doctorName', label: 'Doctor name', align: 'left' },
  { id: 'patientName', label: 'Patient name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'time', label: 'Time', align: 'left' },
];

export default function BlogNewPost() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState([]);
  const [totalAppoinments, setTotalAppoinments] = useState(0);

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const handleDeleteRow = (id) => {
    setSelected([]);
    try {
      axios
        .post('/appointment/delete', {
          appointmentID: id,
        })
        .then(() => {
          enqueueSnackbar('Delete success!');
          try {
            axios
              .post('/appointment/get-all', {
                currentPage: 1,
                recordPerPage: 5,
              })
              .then((res) => {
                setTableData(res.data.data.result);
                setTotalAppoinments(res.data.data.totalPages);
              });
          } catch (error) {
            enqueueSnackbar(error.message, {
              variant: 'error',
            });
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const handleDeleteRows = () => {};

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.appointment.edit(paramCase(id)));
  };

  useEffect(() => {
    try {
      axios
        .post('/appointment/get-all', {
          currentPage: page + 1,
          recordPerPage: rowsPerPage,
        })
        .then((res) => {
          setTableData(res.data.data.result);
          setTotalAppoinments(res.data.data.totalPages);
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, page, rowsPerPage]);

  return (
    <Page title="Appointment: Appointment">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Appointment"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Appointment' }]}
          action={
            <>
              {role === 'patient' && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.appointment.new}
                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                >
                  New Appointment
                </Button>
              )}
              {role === 'doctor' && (
                <Button
                  variant="contained"
                  component={RouterLink}
                  to={PATH_DASHBOARD.appointment.free}
                  startIcon={<Iconify icon={'eva:plus-fill'} />}
                  style={{ marginLeft: '16px' }}
                >
                  Set free time
                </Button>
              )}
            </>
          }
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            {selected.length > 0 && (
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                      <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={role === 'admin' ? TABLE_HEAD_ADMIN : TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {tableData.map((row) => (
                  <UserTableRow
                    checkbox={false}
                    key={row._id}
                    row={row}
                    selected={selected.includes(row._id)}
                    onSelectRow={() => onSelectRow(row._id)}
                    onDeleteRow={() => handleDeleteRow(row._id)}
                    onEditRow={() => handleEditRow(row._id)}
                    showAction={role === 'patient'}
                  />
                ))}

                <TableNoData isNotFound={tableData.length === 0} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAppoinments}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Box>
      </Container>
    </Page>
  );
}
