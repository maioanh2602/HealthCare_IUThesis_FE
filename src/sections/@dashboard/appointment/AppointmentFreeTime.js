import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import moment from 'moment';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import startOfDay from 'date-fns/startOfDay';
import { LoadingButton, StaticDatePicker, PickersDay } from '@mui/lab';
import { Grid, Card, Chip, Stack, TextField, Autocomplete } from '@mui/material';
// routes
import axios from '../../../utils/axios';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import useAuth from '../../../hooks/useAuth';
import { FormProvider } from '../../../components/hook-form';

export default function AppointmentFreeTime() {
  //   const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [defaultTime, setDefaultTime] = useState([]);
  const [ID, setID] = useState('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    // title: Yup.string().required('Title is required'),
  });

  const { user } = useAuth();

  //   const defaultValues = useMemo(
  //     () => ({
  //       timeFree: defaultTime?.time || [],
  //     }),
  //     [defaultTime]
  //   );

  //   useEffect(() => {
  //     const tempFields = defaultTime?.time || [];

  //     setTest(tempFields);

  //     // setDefaultValues(tempFields);
  //   }, [defaultTime]);

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    // defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    // eslint-disable-next-line prefer-const
    let tempDate = [];

    values.forEach((item) => {
      tempDate.push(convertUTCDateToLocalDate(item).toISOString());
    });

    if (ID !== '') {
      try {
        await axios.post('/doctor/set-calendar', {
          date: tempDate,
          time: defaultTime,
          id: ID,
        });
        reset();
        enqueueSnackbar('Set calendar success!');
        // navigate(PATH_DASHBOARD.appointment.root);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    } else {
      try {
        await axios.post('/doctor/set-calendar', {
          date: tempDate,
          time: defaultTime,
        });
        reset();
        enqueueSnackbar('Set calendar success!');
        // navigate(PATH_DASHBOARD.appointment.root);
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  };

  const time = [
    '7:30 - 8:30',
    '8:30 - 9:30',
    '9:30 - 10:30',
    '10:30 - 11:30',
    '13:30 - 14:30',
    '14:30 - 15:30',
    '16:30 - 16:30',
  ];

  const findDate = (dates, date) => {
    const dateTime = date.getTime();
    return dates.find((item) => item.getTime() === dateTime);
  };

  const findIndexDate = (dates, date) => {
    const dateTime = date.getTime();
    return dates.findIndex((item) => item.getTime() === dateTime);
  };

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'selected',
  })(({ theme, selected }) => ({
    ...(selected && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }));

  const renderPickerDay = (date, selectedDates, pickersDayProps) => {
    // if (!values) {
    //   return <PickersDay {...pickersDayProps} />;
    // }

    const selected = findDate(values, date);

    return <CustomPickersDay {...pickersDayProps} disableMargin selected={selected} />;
  };

  function convertUTCDateToLocalDate(date) {
    const newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return newDate;
  }

  useEffect(() => {
    if (user) {
      const today = new Date();
      const currentMonth = today.getMonth();

      setLoading(true);

      try {
        axios
          .post('/doctor/get-calendar', {
            doctorID: user._id,
            month: currentMonth,
          })
          .then((res) => {
            if (res.data.data.length > 0) {
              // eslint-disable-next-line prefer-const
              let tempDate = [];
              res.data.data[0].date.forEach((item) => {
                if (today.getTime() < new Date(item.slice(0, 10)).getTime()) {
                  tempDate.push(startOfDay(new Date(item.slice(0, 10))));
                }
              });
              setValues(tempDate);

              setDefaultTime(res.data.data[0].time);

              setID(res.data.data[0]._id);
            } else {
              setValues([]);
              setDefaultTime([]);
            }
            setLoading(false);
          });
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
        setLoading(false);
      }
    }
  }, [enqueueSnackbar, user]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <CustomStack spacing={2} direction="row" justifyContent="center" alignItems="center">
                <StaticDatePicker
                  onMonthChange={(hihi) => {
                    const today = new Date();
                    const currentMonth = moment(hihi).month();

                    setDefaultTime([]);
                    setLoading(true);

                    try {
                      axios
                        .post('/doctor/get-calendar', {
                          doctorID: user._id,
                          month: currentMonth,
                        })
                        .then((res) => {
                          if (res.data.data.length > 0) {
                            // eslint-disable-next-line prefer-const
                            let tempDate = [];
                            res.data.data[0].date.forEach((item) => {
                              if (today.getTime() < new Date(item.slice(0, 10)).getTime()) {
                                tempDate.push(startOfDay(new Date(item.slice(0, 10))));
                              }
                            });
                            setValues(tempDate);

                            setDefaultTime(res.data.data[0].time);

                            setID(res.data.data[0]._id);
                          } else {
                            setValues([]);
                            setDefaultTime([]);
                            setID('');
                          }
                          setLoading(false);
                        });
                    } catch (error) {
                      enqueueSnackbar(error.message, {
                        variant: 'error',
                      });
                      setLoading(false);
                    }
                  }}
                  // displayStaticWrapperAs="desktop"
                  label="Date picker"
                  value={values}
                  loading={loading}
                  minDate={new Date(new Date().valueOf() + 1000 * 3600 * 24)}
                  maxDate={new Date(new Date().getFullYear(), 11, 31)}
                  onChange={(newValue) => {
                    const array = [...values];
                    const date = startOfDay(newValue);
                    const index = findIndexDate(array, date);
                    if (index >= 0) {
                      array.splice(index, 1);
                    } else {
                      array.push(date);
                    }
                    setValues(array);
                  }}
                  renderDay={renderPickerDay}
                  //   renderInput={(params) => <TextField {...params} />}
                  //   inputFormat="'Week of' MMM d"
                />

                <Controller
                  name="timeFree"
                  control={control}
                  render={() => (
                    <Autocomplete
                      style={{ width: '40%' }}
                      multiple
                      freeSolo
                      onChange={(event, newValue) => setDefaultTime(newValue)}
                      options={time.map((option) => option)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} />)
                      }
                      renderInput={(params) => <TextField label="Pick time" {...params} />}
                      value={defaultTime}
                    />
                  )}
                />
              </CustomStack>
            </Card>
          </Grid>
        </Grid>
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

const CustomStack = styled(Stack)`
  .PrivatePickersToolbar-root {
    display: none;
  }
`;
