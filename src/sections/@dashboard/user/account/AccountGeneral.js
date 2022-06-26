/* eslint-disable react/jsx-no-bind */
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect } from 'react';
import styled from '@emotion/styled';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import InputLabel from '@mui/material/InputLabel';
import { LoadingButton } from '@mui/lab';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
// import { countries } from '../../../../_mock';
// components
// import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const [valueRating, setValueRating] = useState(0);
  const [hover, setHover] = useState(-1);

  const [valueForm, setValueForm] = useState({
    specialist: '',
    experiences: '',
    certificates: '',
  });

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    photoURL: user?.photoUrl || '',
    phoneNumber: user?.phone || '',
    country: user?.country || '',
    address: user?.address || '',
    state: user?.state || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    about: user?.about || '',
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (value) => {
    try {
      await axios.post('/update', {
        firstName: value.firstName,
        lastName: value.lastName,
        address: value.address,
        id: user._id,
        cover: value?.image?.image || '',
        phone: value.phoneNumber,
        specialist: valueForm.specialist,
        experiences: valueForm.experiences,
        certificates: valueForm.certificates,
      });

      enqueueSnackbar('Update success!');
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const handleInputValue = (e, type) => {
    setValueForm({
      ...valueForm,
      [type]: e.target.value,
    });
  };

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
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (user.role === 'doctor') {
      setValueForm({
        specialist: user?.specialist || '',
        experiences: user?.experiences || '',
        certificates: user?.certificates || '',
      });

      try {
        axios
          .post('/doctor/get-rate', {
            doctorID: user?._id,
          })
          .then((res) => {
            setValueRating(res.data.data?.rating);
          });
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [user]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
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
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField disabled name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="address" label="Address" />

              {user.role === 'doctor' && (
                <WrapRating>
                  <Rating
                    style={{ width: '60%' }}
                    size="large"
                    name="hover-feedback"
                    value={valueRating}
                    disabled
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

            {user.role === 'doctor' && (
              <>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '24px',
                    alignItems: 'center',
                  }}
                >
                  <InputLabel style={{ width: '20%' }}>Specialist</InputLabel>
                  <TextareaAutosize
                    style={{
                      width: '80%',
                      fontSize: '16px',
                      padding: '16px 14px',
                      borderRadius: '8px',
                      borderColor: '#c6c8cc',
                    }}
                    value={valueForm.specialist}
                    label="Specialist"
                    onChange={(e) => handleInputValue(e, 'specialist')}
                    minRows={1}
                    maxRows={7}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    marginTop: '24px',
                    alignItems: 'center',
                  }}
                >
                  <InputLabel style={{ width: '20%' }}>Experiences</InputLabel>
                  <TextareaAutosize
                    style={{
                      width: '80%',
                      fontSize: '16px',
                      padding: '16px 14px',
                      borderRadius: '8px',
                      borderColor: '#c6c8cc',
                    }}
                    value={valueForm.experiences}
                    label="Experiences"
                    onChange={(e) => handleInputValue(e, 'experiences')}
                    minRows={1}
                    maxRows={7}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    marginTop: '24px',
                    alignItems: 'center',
                  }}
                >
                  <InputLabel style={{ width: '20%' }}>Certificates</InputLabel>
                  <TextareaAutosize
                    style={{
                      width: '80%',
                      fontSize: '16px',
                      padding: '16px 14px',

                      borderRadius: '8px',
                      borderColor: '#c6c8cc',
                    }}
                    value={valueForm.certificates}
                    label="Certificates"
                    onChange={(e) => handleInputValue(e, 'certificates')}
                    minRows={1}
                    maxRows={7}
                  />
                </div>
              </>
            )}

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
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
