/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
// @mui
import { styled as styledMui } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton, InputAdornment } from '@mui/material';
// utils
// import uuidv4 from '../../../utils/uuidv4';
import axios from '../../../utils/axios';
// components
import Iconify from '../../../components/Iconify';
import EmojiPicker from '../../../components/EmojiPicker';

// ----------------------------------------------------------------------

const RootStyle = styledMui('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func,
};

// export default function ChatMessageInput({ disabled, conversationId, onSend, recipients }) {
export default function ChatMessageInput({ disabled, conversationId, onSend }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleAttach = (acceptedFiles) => {
    const file = acceptedFiles.target.files[0];

    const formData = new FormData();
    formData.append('image', file);
    axios
      .post('/image-upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        const message = res.data.data.link;
        const type = 'image';
        onSend({
          conversationId,
          message,
          type,
        });
      });
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend && conversationId) {
      const type = 'text';
      onSend({
        conversationId,
        // messageId: uuidv4(),
        message,
        type,
        // contentType: 'text',
        // attachments: [],
        // createdAt: new Date(),
        // senderId: '8864c717-587d-472a-929a-8e5f298024da-0',
      });
    }
    return setMessage('');
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
          </InputAdornment>
        }
        endAdornment={
          <CustomStack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            <IconButton disabled={disabled} size="small">
              <label for="upload-photo">
                <Iconify icon="eva:attach-2-fill" width={22} height={22} />
              </label>
              <input type="file" name="file" onChange={handleAttach} id="upload-photo" />
            </IconButton>
            {/* <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} /> */}
            {/* <IconButton disabled={disabled} size="small" onDrop={handleAttach}>
              <Iconify icon="eva:attach-2-fill" width={22} height={22} />
            </IconButton> */}
            {/* <IconButton disabled={disabled} size="small">
              <Iconify icon="eva:mic-fill" width={22} height={22} />
            </IconButton> */}
          </CustomStack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}

const CustomStack = styled(Stack)`
  #upload-photo {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  label {
    cursor: pointer;
  }
`;
