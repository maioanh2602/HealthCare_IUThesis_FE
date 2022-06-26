import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Grid } from '@mui/material';
import BannerHome1 from '../../assets/images/home.png';

//
import { TextAnimate, MotionContainer, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const CONTACTS = [
  {
    email: 'maioanh26022k@gmail.com',
    address: 'Quarter 6, Linh Trung Ward, Thu Duc District, HCMC',
    phoneNumber: '+84 924 450 587',
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `url(/assets/overlay.svg), url(${BannerHome1})`,
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    height: 560,
    padding: 0,
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    position: 'absolute',
    bottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function ContactHero() {
  return (
    <RootStyle>
      <Container component={MotionContainer} sx={{ position: 'relative', height: '100%' }}>
        <ContentStyle>
          <TextAnimate text="Where" sx={{ color: 'primary.main' }} variants={varFade().inRight} />
          <br />
          <Box sx={{ display: 'inline-flex', color: 'common.white' }}>
            <TextAnimate text="to" sx={{ mr: 2 }} />
            <TextAnimate text="find" sx={{ mr: 2 }} />
            <TextAnimate text="us?" />
          </Box>

          <Grid style={{ marginLeft: 0 }} container spacing={5} sx={{ mt: 5, color: 'common.white' }}>
            {CONTACTS.map((contact) => (
              <Grid key={contact.email} style={{ marginRight: '16px' }}>
                <m.div variants={varFade().in}>
                  <Typography variant="h6" paragraph>
                    Email: {contact.email}
                  </Typography>
                </m.div>
                <m.div variants={varFade().inRight}>
                  <Typography variant="body2">
                    Address: {contact.address}
                    <br /> Phone: {contact.phoneNumber}
                  </Typography>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
