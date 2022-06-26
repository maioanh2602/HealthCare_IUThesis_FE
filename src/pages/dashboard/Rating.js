/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';

import styled from '@emotion/styled';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';

import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

import BannerHome1 from '../../assets/images/home.png';

function RatingDoctor() {
  const { enqueueSnackbar } = useSnackbar();
  const { roomid } = useParams();
  const { user } = useAuth();

  const [value, setValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const [IDDoctor, setIDDoctor] = useState('');

  const labels = {
    1: 'Very unsatisfeid',
    2: 'Unsatisfeid',
    3: 'Neutral',
    4: 'Satisfed',
    5: 'Very satisfeid',
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }

  const _onSubmitRating = () => {
    try {
      axios
        .post('/doctor/rate', {
          doctorID: IDDoctor,
          stars: value,
        })
        .then(() => {
          enqueueSnackbar('Success!');
          window.open('/dashboard/app', '_self');
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    try {
      axios
        .post('/room/load-participants', {
          roomID: roomid,
        })
        .then((res) => {
          const id = res.data.data.filter((item) => item !== user._id);
          if (id) {
            setIDDoctor(id[0]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [roomid, user._id]);

  return (
    <Wrapper>
      <img src={BannerHome1} alt="banner" />
      <Box
        style={{
          background: '#333244',
          borderRadius: '5px',
          color: '#fff',
          padding: '0 24px',
          position: 'absolute',
          top: '30%',
          left: '25%',
        }}
        sx={{
          width: 800,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '30px', marginTop: '32px', marginBottom: '32px' }}>
          Are you satisfied with the doctor?
        </span>
        <Wrap>
          <WrapRating>
            <Rating
              sx={{
                fontSize: '70px',
              }}
              name="hover-feedback"
              value={value}
              getLabelText={getLabelText}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              icon={<StarIcon style={{ color: '#faaf00' }} fontSize="inherit" />}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </WrapRating>
          {value !== null && (
            <Box sx={{ ml: 2, fontSize: '24px', width: '30%' }}>{labels[hover !== -1 ? hover : value]}</Box>
          )}
        </Wrap>
        <Button
          size="large"
          style={{
            alignSelf: 'flex-end',
            background: '#333244',
            border: '0.5px solid #FDF9F9',
            borderRadius: '5px',
            color: '#fff',
            marginRight: '30px',
            marginTop: '30px',
          }}
          onClick={_onSubmitRating}
        >
          SUBMIT
        </Button>
      </Box>
    </Wrapper>
  );
}

export default RatingDoctor;

const Wrapper = styled.div`
  position: relative;

  img {
    width: 99%;
    object-fit: cover;
  }
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapRating = styled.div`
  width: 65%;
  display: flex;
  justify-content: flex-end;
`;
