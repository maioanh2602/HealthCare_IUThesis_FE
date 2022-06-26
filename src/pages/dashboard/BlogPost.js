import { useEffect, useState, useCallback } from 'react';
import { sentenceCase } from 'change-case';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Card, Divider, Container, Typography, Button, Pagination } from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import axios from '../../utils/axios';
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { SkeletonPost } from '../../components/skeleton';
import { BlogPostHero, BlogPostTags, BlogPostCommentList, BlogPostCommentForm } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function BlogPost() {
  const { themeStretch } = useSettings();
  const role = localStorage.getItem('role');

  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { title } = useParams();

  const [post, setPost] = useState(null);

  const [error, setError] = useState(null);
  const [comments, setComments] = useState({
    comments: [],
    totalRecord: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const getPost = useCallback(async () => {
    try {
      const response = await axios.post('/post/get-details', {
        postID: window.location.pathname.split('/')[4],
      });

      if (isMountedRef.current) {
        setPost(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }, [isMountedRef]);

  const _onDeletePost = async () => {
    try {
      await axios.post('/post/delete', {
        postID: post._id,
      });

      enqueueSnackbar('Delete success!');
      navigate(PATH_DASHBOARD.blog.posts);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const handleSelectPagi = (e, page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getPost();
  }, [getPost]);

  useEffect(() => {
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
  }, [currentPage, title]);

  return (
    <Page title="Blog: Post Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Post Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blog', href: PATH_DASHBOARD.blog.root },
            { name: sentenceCase(post?.title || '') },
          ]}
        />

        {post && (
          <Card>
            <BlogPostHero post={post} />

            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h6" sx={{ mb: 5 }}>
                {post.description}
              </Typography>

              <Markdown children={post.body} />

              <Box sx={{ my: 5 }}>
                <Divider />
                <BlogPostTags post={post} />
                <Divider />
              </Box>

              {role === 'admin' && (
                <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={_onDeletePost}>Delete</Button>
                </Box>
              )}

              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant="h4">Comments</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                  ({comments.totalRecord})
                </Typography>
              </Box>

              <BlogPostCommentList comments={comments.comments} />

              {comments.totalRecord > 0 && (
                <Box sx={{ mb: 5, mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Pagination
                    count={
                      comments.totalRecord % 10 === 0
                        ? Math.floor(comments.totalRecord / 10)
                        : Math.floor(comments.totalRecord / 10 + 1)
                    }
                    page={currentPage}
                    onChange={handleSelectPagi}
                    color="primary"
                  />
                </Box>
              )}

              <BlogPostCommentForm setComments={setComments} currentPage={currentPage} />
            </Box>
          </Card>
        )}

        {!post && !error && <SkeletonPost />}

        {error && <Typography variant="h6">404 {error}!</Typography>}
      </Container>
    </Page>
  );
}
