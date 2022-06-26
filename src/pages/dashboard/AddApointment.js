import { Container } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AddApoinment from '../../sections/@dashboard/appointment/AddAppointment';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isEdit = pathname.includes('edit');

  return (
    <Page title="Appointment: Add Appointment">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Add Appointment' : 'Edit Appointment'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Appointment', href: PATH_DASHBOARD.appointment.root },
          ]}
        />

        <AddApoinment isEdit={isEdit} />
      </Container>
    </Page>
  );
}
