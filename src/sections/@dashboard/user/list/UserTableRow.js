import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
// import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  checkbox: PropTypes.bool,
  showAction: PropTypes.bool,
};

UserTableRow.defaultProps = {
  checkbox: true,
  showAction: true,
};

// export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, ...other }) {
export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, checkbox, showAction }) {
  // const theme = useTheme();

  const { firstName, lastName, cover, email, role, description, date, time, doctorName, patientName } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      {checkbox && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      {firstName && (
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={firstName} src={cover} sx={{ mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {firstName}
          </Typography>
        </TableCell>
      )}

      {doctorName && (
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={doctorName} src={cover} sx={{ mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {doctorName}
          </Typography>
        </TableCell>
      )}

      {patientName && <TableCell align="left">{patientName}</TableCell>}

      {lastName && <TableCell align="left">{lastName}</TableCell>}

      {email && <TableCell align="left">{email}</TableCell>}
      {role && (
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {role}
        </TableCell>
      )}

      {description && (
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {description}
        </TableCell>
      )}

      {date && (
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {moment(date).format('DD MMMM YYYY')}
        </TableCell>
      )}

      {time && (
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {time}
        </TableCell>
      )}

      {/* <TableCell align="center">
        <Iconify
          icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isVerified && { color: 'warning.main' }),
          }}
        />
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'banned' && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell> */}

      {showAction && (
        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Delete
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  Edit
                </MenuItem>
              </>
            }
          />
        </TableCell>
      )}
    </TableRow>
  );
}
