import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AppointmentFreeTime from '../../sections/@dashboard/appointment/AppointmentFreeTime';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Appointment: Add Free Time">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Add Free Time"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Appointment', href: PATH_DASHBOARD.appointment.root },
            { name: 'Set Free Time' },
          ]}
        />

        <AppointmentFreeTime />
      </Container>
    </Page>
  );
}
