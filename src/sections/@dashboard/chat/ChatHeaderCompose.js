import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha, styled } from '@mui/material/styles';
// import { Box, Avatar, TextField, Typography, Autocomplete, Chip } from '@mui/material';
import { Box, Avatar, TextField, Typography, Autocomplete } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from '../../../redux/store';
// import { getConversations, getContacts } from '../../../redux/slices/chat';
import { getConversations } from '../../../redux/slices/chat';

// components
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';

import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
}));

const AutocompleteStyle = styled('div')(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    minWidth: 280,
    marginLeft: theme.spacing(2),
    '&.Mui-focused .MuiAutocomplete-inputRoot': {
      boxShadow: theme.customShadows.z8,
    },
  },
  '& .MuiAutocomplete-inputRoot': {
    transition: theme.transitions.create('box-shadow', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`,
    },
  },
}));

// ----------------------------------------------------------------------

ChatHeaderCompose.propTypes = {
  // contacts: PropTypes.array,
  recipients: PropTypes.object,
  onAddRecipients: PropTypes.func,
};

// export default function ChatHeaderCompose({ contacts, recipients, onAddRecipients }) {
export default function ChatHeaderCompose({ recipients, onAddRecipients }) {
  const [query, setQuery] = useState('');
  const [listDoctors, setListDoctors] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleAddRecipients = (recipients) => {
    setQuery('');
    onAddRecipients(recipients);

    try {
      axios
        .post('/room/create', {
          chatUserID: recipients._id,
        })
        .then((res) => {
          dispatch(getConversations());
          navigate(PATH_DASHBOARD.chat.view(res.data.data.roomID));
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    try {
      axios.post('/load-doctor').then((res) => {
        if (res.data.data.length > 0) {
          // eslint-disable-next-line prefer-const
          let tempDoctors = [];
          res.data.data.forEach((item) => {
            if (item._id !== user._id) {
              tempDoctors.push(item);
            }
          });
          setListDoctors(tempDoctors);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [user._id]);

  return (
    <RootStyle>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        To:
      </Typography>

      <AutocompleteStyle>
        <Autocomplete
          size="small"
          disablePortal
          popupIcon={null}
          noOptionsText={<SearchNotFound searchQuery={query} />}
          onChange={(event, value) => handleAddRecipients(value)}
          onInputChange={(event, value) => setQuery(value)}
          options={listDoctors}
          getOptionLabel={(recipient) => recipient.fullName}
          renderOption={(props, recipient, { inputValue, selected }) => {
            const { fullName, cover } = recipient;
            const matches = match(fullName, inputValue);
            const parts = parse(fullName, matches);
            return (
              <Box component="li" sx={{ p: '12px !important' }} {...props}>
                <Box
                  sx={{
                    mr: 1.5,
                    width: 32,
                    height: 32,
                    overflow: 'hidden',
                    borderRadius: '50%',
                    position: 'relative',
                  }}
                >
                  <Avatar alt={fullName} src={cover} />
                  <Box
                    sx={{
                      top: 0,
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                      transition: (theme) =>
                        theme.transitions.create('opacity', {
                          easing: theme.transitions.easing.easeInOut,
                          duration: theme.transitions.duration.shorter,
                        }),
                      ...(selected && {
                        opacity: 1,
                        color: 'primary.main',
                      }),
                    }}
                  >
                    <Iconify icon="eva:checkmark-fill" width={20} height={20} />
                  </Box>
                </Box>

                {parts.map((part, index) => (
                  <Typography key={index} variant="subtitle2" color={part.highlight ? 'primary' : 'textPrimary'}>
                    {part.text}
                  </Typography>
                ))}
              </Box>
            );
          }}
          // renderTags={(recipients, getTagProps) =>
          //   recipients.map((recipient, index) => {
          //     const { id, fullName, cover } = recipient;
          //     console.log('recipient', recipient);
          //     return (
          //       <Chip
          //         {...getTagProps({ index })}
          //         key={id}
          //         size="small"
          //         label={fullName}
          //         color="info"
          //         avatar={<Avatar alt={fullName} src={cover} />}
          //       />
          //     );
          //   })
          // }
          renderInput={(params) => (
            <TextField {...params} placeholder={Object.keys(recipients)?.length === 0 ? 'Recipients' : ''} />
          )}
        />
      </AutocompleteStyle>
    </RootStyle>
  );
}
