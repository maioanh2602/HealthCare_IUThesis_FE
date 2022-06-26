import { Container, Grid } from '@mui/material';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import BannerHome1 from '../../assets/images/home.png';
import BannerHome2 from '../../assets/images/home2.png';
import OurService from '../../assets/images/ourService.svg';
import OurDoctor from '../../assets/images/ourDoctor.svg';
import MedicalRecord from '../../assets/images/medicalRecord.svg';
import News from '../../assets/images/news.svg';
import OurSystem from '../../assets/images/ourSystem.svg';
import OurStaff from '../../assets/images/ourStaff.svg';
import Visit from '../../assets/images/visit.svg';
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const aboutUs = [
    {
      icon: OurService,
      title: 'OUR SERVICE',
      des: 'I Providing comprehensive personal and business health operation services and supporting facilities.',
    },
    {
      icon: OurDoctor,
      title: 'OUR DOCTOR',
      des: 'The team of doctors often practice abroad, with high skills and long-term working experience.',
    },
    {
      icon: MedicalRecord,
      title: 'MEDICAL RECORD',
      des: 'Patients can view and save their medical history and ask their treating doctor for an online consultation.',
    },
    {
      icon: News,
      title: 'NEWS & EVENTS',
      des: 'We always update the latest health information and service news',
    },
    {
      icon: OurSystem,
      title: 'OUR SYSTEM',
      des: 'Our system always meets the needs of patients, 100% remote support without going to the hospital.',
    },
    {
      icon: OurStaff,
      title: 'OUR STAFF',
      des: 'We have a professional hotline support team to guide and answer all hospital questions',
    },
  ];

  return (
    <Page title="General: App">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Banner>
            <img src={BannerHome1} alt="BannerHome1" />
            <span>IU Health Care</span>
            <p>Your health will be taken care anywhere.</p>
          </Banner>
          <AboutUs>
            {aboutUs.map((item, idx) => (
              <Wrap key={idx}>
                <img src={item.icon} alt={idx} />
                <span>{item.title}</span>
                <p>{item.des}</p>
              </Wrap>
            ))}
          </AboutUs>
          <Banner2>
            <img src={BannerHome2} alt="BannerHome2" />
          </Banner2>
          <VisitUs>
            <Left>
              <Title>Visit us:</Title>
              <p>
                Address: <span> Quarter 6, Linh Trung w., Thu Duc City, Ho Chi Minh City</span>
              </p>
              <p>
                Telephone: <span> (028) 37244270 ext. 3232</span>
              </p>
              <p>
                Fax: <span> (028) 37244271</span>
              </p>
              <p>
                Email: <span> cse@hcmiu.edu.vn</span>
              </p>
            </Left>
            <Right>
              <p>Receive special offers</p>
              <span>Sign up to receive special offers, events and updates on medical knowledge</span>

              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', marginTop: '30px' }}
              >
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Please input your email" />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                  <img src={Visit} alt="visit" />
                </IconButton>
              </Paper>
            </Right>
          </VisitUs>
        </Grid>
      </Container>
    </Page>
  );
}

const Banner = styled.div`
  position: relative;
  width: 100%;

  img {
    width: 100%;
    max-height: 504px;
    object-fit: cover;
  }

  span {
    font-weight: 700;
    font-size: 65px;
    color: #fff;
    position: absolute;
    top: 15rem;
    left: 12rem;
  }

  p {
    font-size: 40px;
    color: #fff;
    position: absolute;
    top: 20rem;
    left: 6rem;
  }
`;

const AboutUs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: -4rem;
  z-index: 2;
  margin-bottom: 24px;
`;

const Wrap = styled.div`
  width: 364px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border: 1px solid #000000;
  border-radius: 10px;
  padding: 16px;
  margin-right: 24px;
  margin-bottom: 24px;

  img {
    width: fit-content;
  }

  span {
    font-weight: 700;
    font-size: 30px;
  }
`;

const Banner2 = styled.div`
  width: 100%;
  margin-bottom: 24px;

  img {
    width: 100%;
    max-height: 630px;
    object-fit: cover;
  }
`;

const VisitUs = styled.div`
  background: rgba(0, 0, 0, 0.76);
  border-radius: 10px;
  width: 100%;
  padding: 48px;
  display: flex;
`;

const Left = styled.div`
  color: #fff;
  flex: 2;
  font-weight: 700;
  font-size: 20px;

  span {
    font-weight: 400;
    font-size: 16px;
  }
`;

const Right = styled.div`
  color: #e1bf0b;
  flex: 1;

  p {
    font-weight: 700;
    font-size: 30px;
    margin-bottom: 1rem;
  }

  span {
    font-size: 24px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 50px;
  margin-left: 2rem;
`;
