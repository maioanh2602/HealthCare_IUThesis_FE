/* eslint-disable prefer-const */
import React from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';

import BannerHome1 from '../../assets/images/home.png';
import payment from '../../assets/images/payment.png';

Payment.propTypes = {};

function Payment() {
  let nameDoctor = localStorage.getItem('paymentDoctorName');
  let time = localStorage.getItem('paymentTime');
  let date = localStorage.getItem('paymentDate');
  const { user } = useAuth();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Wrapper>
      <Banner>
        <img src={BannerHome1} alt="BannerHome1" />
        <span>Transaction</span>
        <p>Dashboard . Transition</p>
      </Banner>

      <InfoPayment>
        <img src={payment} alt="payment" />

        <Info>
          <Title>DETAILED TRANSACTION</Title>
          <Wrap>
            <Patient>&#8226; {user.displayName}</Patient>
            <Doctor>&#8226; Dr. {nameDoctor}</Doctor>
            <Time>
              &#8226; {time} &#8226; {date}
            </Time>
            <Money>200 000 VND</Money>
          </Wrap>
        </Info>
      </InfoPayment>

      <WrapButton>
        <Save
          onClick={() => {
            enqueueSnackbar('Success!');
            navigate(PATH_DASHBOARD.payment.root);
          }}
        >
          Successful payment
        </Save>
        <Cancel
          onClick={() => {
            navigate(PATH_DASHBOARD.root);
          }}
        >
          Cancel
        </Cancel>
      </WrapButton>
    </Wrapper>
  );
}

export default Payment;

const Wrapper = styled.div`
  width: 100%;
`;

const Banner = styled.div`
  position: relative;
  img {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
  }

  span {
    font-weight: 700;
    font-size: 40px;
    color: #fff;
    position: absolute;
    top: 15rem;
    left: 12rem;
  }

  p {
    font-size: 20px;
    color: #fff;
    position: absolute;
    top: 20rem;
    left: 12rem;
  }
`;

const InfoPayment = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  margin-left: 100px;
  width: 365px;
  height: 365px;
  padding: 30px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  color: #00ab55;
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 30px;
`;

const Wrap = styled.div`
  font-weight: 400;
  font-size: 24px;
`;

const Patient = styled.div``;

const Doctor = styled.div``;

const Time = styled.div``;

const Money = styled.div`
  font-weight: 700;
  font-size: 40px;
  color: #00ab55;
  margin-top: 30px;
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 50px;
`;

const Save = styled.div`
  background: #1844b7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: 238px;
  font-weight: 700;
  font-size: 30px;
  margin-right: 30px;
  color: #fff;
  text-align: center;
  cursor: pointer;
`;

const Cancel = styled.div`
  background: #da1414;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  width: 238px;
  height: 78px;
  font-weight: 700;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
  cursor: pointer;
`;
