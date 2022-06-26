import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import styled from '@emotion/styled';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Avatar, Grid, Card, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
// routes
import axios from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

AppointmentFreeTime.propTypes = {
  isEdit: PropTypes.bool,
  // currentUser: PropTypes.object,
};

export default function AppointmentFreeTime({ isEdit }) {
  const navigate = useNavigate();

  const [listDoctors, setListDoctors] = useState([]);
  const [listTimes, setListTimes] = useState([]);
  const [listDates, setListDates] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});

  const [defaultValue, setDefaultValue] = useState({
    description: '',
    doctor: '',
    time: '',
    date: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    // doctor: Yup.string().required('Doctor is required'),
    // time: Yup.string().required('Time is required'),
    // date: Yup.string().required('Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      description: defaultValue?.description || '',
      doctor: defaultValue?.doctor || '',
      time: defaultValue?.time || '',
      date: defaultValue?.date || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValue]
  );

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && defaultValue) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, defaultValue]);

  const onSubmit = async () => {
    if (isEdit) {
      try {
        await axios.post('/appointment/update', {
          description: defaultValue.description,
          doctorID: defaultValue.doctor,
          date: defaultValue.date,
          time: defaultValue.time,
          appointmentID: window.location.pathname.split('/')[3],
        });
        reset();
        enqueueSnackbar('Update appoinment success!');
        navigate(PATH_DASHBOARD.appointment.root);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    } else {
      try {
        await axios.post('/appointment/create', {
          description: defaultValue.description,
          doctorID: defaultValue.doctor,
          date: defaultValue.date,
          time: defaultValue.time,
        });
        reset();
        // enqueueSnackbar('Add appoinment success!');
        localStorage.setItem(
          'paymentDoctorName',
          listDoctors.find((item) => item.value === defaultValue.doctor)?.label
        );
        localStorage.setItem('paymentTime', defaultValue.time);
        localStorage.setItem('paymentDate', listDates.find((item) => item.value === defaultValue.date)?.label);
        navigate(PATH_DASHBOARD.payment.root);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  };

  const handleChangeDescription = (e) => {
    setDefaultValue({
      ...defaultValue,
      description: e.target.value,
    });
  };

  const handleSelectDoctor = async (e) => {
    // setSelectedDoctor()
    const temp = listDoctors.find((item) => item.value === e.target.value);
    if (temp) {
      setSelectedDoctor(temp.item);
    } else {
      setSelectedDoctor({});
    }
    console.log(
      'e',
      listDoctors.find((item) => item.value === e.target.value)
    );

    setDefaultValue({
      ...defaultValue,
      doctor: e.target.value,
    });
    try {
      await axios
        .post('/doctor/get-available-date', {
          doctorID: e.target.value,
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            // eslint-disable-next-line prefer-const
            let tempDates = [];
            res.data.data[0].date.forEach((item) => {
              tempDates.push({
                label: moment(item).format('DD MMMM YYYY'),
                value: item,
              });
            });
            setListDates(tempDates);
          } else {
            setListDates([]);
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const handleSelectDate = async (e) => {
    setDefaultValue({
      ...defaultValue,
      date: e.target.value,
    });
    try {
      await axios
        .post('/doctor/get-available-time', {
          doctorID: defaultValue.doctor,
          date: e.target.value,
        })
        .then((res) => {
          if (res.data.data.length > 0) {
            // eslint-disable-next-line prefer-const
            let tempDates = [];
            res.data.data[0].time.forEach((item) => {
              tempDates.push({
                label: item.time,
                value: item.time,
                status: item.status,
              });
            });
            setListTimes(tempDates);
          } else {
            setListTimes([]);
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const handleSelectTime = (e) => {
    setDefaultValue({
      ...defaultValue,
      time: e.target.value,
    });
  };

  useEffect(() => {
    try {
      axios.post('/load-doctor').then((res) => {
        if (res.data.data.length > 0) {
          // eslint-disable-next-line prefer-const
          let tempDoctors = [];
          res.data.data.forEach((item) => {
            if (item.role !== 'admin') {
              tempDoctors.push({
                label: item.fullName,
                value: item._id,
                item: { ...item },
              });
            }
          });
          setListDoctors(tempDoctors);
        }
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (isEdit) {
      try {
        axios
          .post('/appointment/get-details', {
            appointmentID: window.location.pathname.split('/')[3],
          })
          .then((res) => {
            setDefaultValue({
              description: res.data.data.description,
              doctor: res.data.data.doctorID,
              time: res.data.data.time,
              date: res.data.data.date,
            });

            try {
              axios
                .post('/doctor/get-available-date', {
                  doctorID: res.data.data.doctorID,
                })
                .then((res) => {
                  if (res.data.data.length > 0) {
                    // eslint-disable-next-line prefer-const
                    let tempDates = [];
                    res.data.data[0].date.forEach((item) => {
                      tempDates.push({
                        label: moment(item).format('DD MMMM YYYY'),
                        value: item,
                      });
                    });
                    setListDates(tempDates);
                  } else {
                    setListDates([]);
                  }
                });
            } catch (error) {
              enqueueSnackbar(error.message, {
                variant: 'error',
              });
            }

            try {
              axios
                .post('/doctor/get-available-time', {
                  doctorID: res.data.data.doctorID,
                  date: res.data.data.date,
                })
                .then((res) => {
                  if (res.data.data.length > 0) {
                    // eslint-disable-next-line prefer-const
                    let tempDates = [];
                    res.data.data[0].time.forEach((item) => {
                      tempDates.push({
                        label: item.time,
                        value: item.time,
                        status: item.status,
                      });
                    });
                    setListTimes(tempDates);
                  } else {
                    setListTimes([]);
                  }
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
    }
  }, [enqueueSnackbar, isEdit]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack style={{ marginBottom: '16px' }}>
                <RHFTextField label="Description" name="description" onChange={handleChangeDescription} />
              </Stack>
              <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
                <FormControl fullWidth>
                  <InputLabel id="doctor">Doctor</InputLabel>
                  <Select
                    value={defaultValue.doctor}
                    label="Doctor"
                    onChange={handleSelectDoctor}
                    labelId="doctor"
                    id="doctor"
                  >
                    {listDoctors.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="date">Date</InputLabel>
                  <Select value={defaultValue.date} label="Date" onChange={handleSelectDate} labelId="date" id="date">
                    {listDates.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="time">Time</InputLabel>
                  <Select value={defaultValue.time} label="Time" onChange={handleSelectTime} labelId="time" id="time">
                    {listTimes.map((option) => (
                      <MenuItem key={option.value} value={option.value} disabled={!option.status}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {Object.keys(selectedDoctor).length > 0 && (
          <WrapSelectedDoctor>
            <Avatar alt="cover" src={selectedDoctor.cover} sx={{ width: 60, height: 60 }} />

            <Info>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontSize: '35px', color: '#00AB55' }}>Dr. {selectedDoctor.fullName}</span>
                <span style={{ fontSize: '25px', color: '#F1190B' }}>Rating: {selectedDoctor.rating}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {selectedDoctor.specialist && (
                  <span style={{ fontSize: '25px', fontWeight: 700 }}>Specialist: {selectedDoctor.specialist}</span>
                )}
                <span style={{ fontSize: '25px' }}>Email: {selectedDoctor.email}</span>
              </div>

              {selectedDoctor.experiences && (
                <span style={{ fontSize: '25px' }}>Experiences: {selectedDoctor.experiences}</span>
              )}
              {selectedDoctor.certificates && (
                <span style={{ fontSize: '25px' }}>Certificates: {selectedDoctor.certificates}</span>
              )}
            </Info>
          </WrapSelectedDoctor>
        )}

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} justifyContent="center" alignItems="center">
          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            style={{ width: 'fit-content' }}
          >
            Save
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}

const WrapSelectedDoctor = styled.div`
  display: flex;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 24px;
  padding: 24px;
  width: 100%;
`;

const Info = styled.div`
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
