import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function BlogPostCommentForm({ setComments, currentPage }) {
  const { enqueueSnackbar } = useSnackbar();
  const { title } = useParams();

  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
  });

  const defaultValues = {
    comment: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values) => {
    try {
      axios
        .post('/post/comment', {
          postID: title,
          content: values.comment,
        })
        .then(() => {
          enqueueSnackbar('Post comment success!');
          reset();

          try {
            axios
              .post('/post/load-comments', {
                postID: title,
                // eslint-disable-next-line object-shorthand
                currentPage: currentPage,
                pageSize: 10,
              })
              .then((res) => {
                setComments(res.data.data);
              });
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Add Comment
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="comment" label="Comment *" multiline rows={3} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post comment
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
}
