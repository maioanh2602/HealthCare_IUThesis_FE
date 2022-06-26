import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Chip, Checkbox, FormControlLabel } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import axios from '../../../utils/axios';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

BlogPostTags.propTypes = {
  post: PropTypes.object.isRequired,
};

export default function BlogPostTags({ post }) {
  // const { favorite, tags, favoritePerson } = post;
  const { tags } = post;

  const [like, setLike] = useState(0);
  const [isLike, setIsLike] = useState(false);

  const handleLike = (value) => {
    setIsLike(value.target.checked);
    try {
      axios
        .post('/post/interaction', {
          postID: post._id,
          type: value.target.checked ? 'like' : 'dislike',
        })
        .then(() => {
          try {
            axios
              .post('/post/load-interaction', {
                postID: post._id,
              })
              .then((res) => {
                setLike(res.data.data.total);
              });
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      axios
        .post('/post/load-interaction', {
          postID: post._id,
        })
        .then((res) => {
          setLike(res.data.data.total);
        });
    } catch (error) {
      console.log(error);
    }
  }, [post._id]);

  useEffect(() => {
    try {
      axios
        .post('/post/check-interaction', {
          postID: post._id,
          type: 'like',
        })
        .then((res) => {
          setIsLike(res.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, [post._id]);

  useEffect(() => {
    console.log('isLike', isLike);
  }, [isLike]);

  return (
    <Box sx={{ py: 3 }}>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} sx={{ m: 0.5 }} />
      ))}

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isLike}
              size="small"
              color="error"
              icon={<Iconify icon="eva:heart-fill" />}
              checkedIcon={<Iconify icon="eva:heart-fill" />}
              onChange={handleLike}
            />
          }
          label={fShortenNumber(like)}
        />
        {/* <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': { width: 32, height: 32 },
          }}
        >
          {favoritePerson.map((person) => (
            <Avatar key={person.name} alt={person.name} src={person.avatarUrl} />
          ))}
        </AvatarGroup> */}
      </Box>
    </Box>
  );
}
