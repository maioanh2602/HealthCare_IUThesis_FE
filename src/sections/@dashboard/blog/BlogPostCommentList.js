import PropTypes from 'prop-types';
// @mui
import { Box, List } from '@mui/material';
//
import BlogPostCommentItem from './BlogPostCommentItem';

// ----------------------------------------------------------------------

BlogPostCommentList.propTypes = {
  comments: PropTypes.array,
};

export default function BlogPostCommentList({ comments }) {
  return (
    <List disablePadding>
      {comments.map((comment) => {
        const { _id } = comment;

        return (
          <Box key={_id} sx={{}}>
            <BlogPostCommentItem
              name={comment.userDetails.firstName}
              avatarUrl={comment.userDetails.avatarUrl}
              postedAt={comment.createdAt}
              message={comment.content}
            />
          </Box>
        );
      })}
    </List>
  );
}
