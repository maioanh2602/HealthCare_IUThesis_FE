import PropTypes from 'prop-types';
// import { formatDistanceToNowStrict } from 'date-fns';
import moment from 'moment';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import { useSelector } from '../../../redux/store';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  // conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message, onOpenLightbox }) {
  const { conversations } = useSelector((state) => state.chat);

  const { user } = useAuth();

  let sender = {};

  conversations.forEach((item) => {
    const find = item.participants.find((participant) => participant._id === message.sender);
    if (find) {
      sender = find;
    }
  });

  const senderDetails =
    message.sender === user?._id ? { type: 'me' } : { avatar: sender?.cover, name: sender?.fullName };

  const isMe = senderDetails.type === 'me';
  const isImage = message.type === 'image';
  const firstName = senderDetails.name;

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' }),
            }}
          >
            {!isMe && `${firstName},`}&nbsp;
            {/* {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true,
            })} */}
            {moment(message.createdAt).fromNow()}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              ...(isImage && { p: 0 }),
            }}
          >
            {isImage ? (
              <Image
                alt="attachment"
                src={message.message}
                onClick={() => onOpenLightbox(message.message)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : (
              <Typography variant="body2">{message.message}</Typography>
            )}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
