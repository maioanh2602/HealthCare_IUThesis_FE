// import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  // Box,
  // Button,
  Avatar,
  Divider,
  ListItem,
  // TextField,
  Typography,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

BlogPostCommentItem.propTypes = {
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  tagUser: PropTypes.string,
  postedAt: PropTypes.string,
  hasReply: PropTypes.bool,
};

export default function BlogPostCommentItem({ name, avatarUrl, message, tagUser, postedAt, hasReply }) {
  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: 'flex-start',
          py: 3,
          ...(hasReply && {
            ml: 'auto',
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }),
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: 'subtitle1' }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.disabled',
                }}
              >
                {fDate(postedAt)}
              </Typography>
              <Typography component="span" variant="body2">
                <strong>{tagUser}</strong> {message}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider
        sx={{
          ml: 'auto',
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}
