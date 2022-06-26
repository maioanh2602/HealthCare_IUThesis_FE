/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { fData } from '../../../utils/formatNumber';
import axios from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function UserNewEditForm({ isEdit }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState([]);
  const [valueRating, setValueRating] = useState(0);
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    if (isEdit) {
      try {
        axios
          .post('/user/get-by-id', {
            userID: window.location.pathname.split('/')[3],
          })
          .then((res) => {
            setCurrentUser(res.data.data);

            if (res.data?.data?.role === 'doctor') {
              try {
                axios
                  .post('/doctor/get-rate', {
                    doctorID: window.location.pathname.split('/')[3],
                  })
                  .then((res) => {
                    setValueRating(res.data.data?.rating);
                  });
              } catch (error) {
                console.log(error.message);
              }
            }
          });
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [isEdit]);

  const { enqueueSnackbar } = useSnackbar();

  const roleUser = [
    {
      label: 'Doctor',
      value: 'doctor',
    },
    {
      label: 'Patient',
      value: 'patient',
    },
  ];

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: isEdit && Yup.string().required('Email is required').email(),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.cover || '',
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      company: currentUser?.company || '',
      role: currentUser?.role || '',
      password: currentUser?.password || '',
      image: {
        image: currentUser?.cover || '',
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (value) => {
    if (isEdit) {
      try {
        await axios.post('/user/update-by-id', {
          firstName: value.firstName,
          lastName: value.lastName,
          address: value.address,
          cover: value?.image?.image || '',
          role: value.role,
          password: value.password,
          id: window.location.pathname.split('/')[3],
          phone: value.phoneNumber,
          stars: valueRating,
        });

        reset();
        navigate(PATH_DASHBOARD.user.list);
        enqueueSnackbar('Update success!');
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    } else {
      try {
        await axios.post('/user/create', {
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          address: value.address,
          cover: value?.image?.image || '',
          role: value.role,
          password: value.password,
        });

        reset();
        navigate(PATH_DASHBOARD.user.list);
        enqueueSnackbar('Create success!');
      } catch (error) {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const formData = new FormData();
      formData.append('image', file);
      axios
        .post('/image-upload', formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
        .then((res) => {
          setValue('image', {
            image: res.data.data.link,
          });
        });

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField disabled={isEdit} name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="address" label="Address" />
              <RHFSelect name="role" label="Role" placeholder="Role">
                <option value="" />
                {roleUser.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField type="password" name="password" label="New password" />
              {currentUser?.role === 'doctor' && (
                <WrapRating>
                  <Rating
                    style={{ width: '60%' }}
                    size="large"
                    name="hover-feedback"
                    value={valueRating}
                    precision={0.1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                      setValueRating(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    icon={<StarIcon style={{ color: '#faaf00' }} fontSize="inherit" />}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  {valueRating !== null && (
                    <Box sx={{ ml: 1, fontSize: '14px', width: '35%' }}>
                      {labels[hover !== -1 ? hover : valueRating]}
                    </Box>
                  )}
                </WrapRating>
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

const WrapRating = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
