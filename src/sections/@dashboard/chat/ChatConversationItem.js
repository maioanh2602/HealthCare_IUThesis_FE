import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Avatar, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
//
import BadgeStatus from '../../../components/BadgeStatus';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all'),
}));

const AvatarWrapperStyle = styled('div')({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' },
});

// ----------------------------------------------------------------------

const getDetails = (conversation, currentUserId, item) => {
  const otherParticipants = item.participants.filter((participant) => participant._id !== currentUserId);
  const displayNames = otherParticipants[0].fullName;

  let displayText = '';
  let isUnread = true;
  const { lastMessage } = item;
  if (lastMessage && lastMessage !== null) {
    const sender = lastMessage.sender === currentUserId ? 'You: ' : '';
    const message = lastMessage.type === 'image' ? 'Sent a photo' : lastMessage.message;
    displayText = `${sender}${message}`;

    isUnread = lastMessage.sender === currentUserId ? true : lastMessage.read;
  }

  return { otherParticipants, displayNames, displayText, isUnread };
};

ChatConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  conversation: PropTypes.array,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func,
  item: PropTypes.object,
  dataWebSocket: PropTypes.object,
};

export default function ChatConversationItem({
  isSelected,
  conversation,
  isOpenSidebar,
  onSelectConversation,
  item,
  dataWebSocket,
}) {
  const { user } = useAuth();

  const details = getDetails(conversation, user._id, item);

  // const displayLastActivity = conversation[conversation.length - 1]?.createdAt;

  const isGroup = details.otherParticipants.length > 1;
  const isUnread = !details.isUnread;
  const isOnlineGroup = isGroup && details.otherParticipants.map((item) => item.status).includes('online');

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' }),
      }}
    >
      <ListItemAvatar>
        <Box
          sx={{
            ...(isGroup && {
              position: 'relative',
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              '& .avatarWrapper': {
                position: 'absolute',
                width: AVATAR_SIZE_GROUP,
                height: AVATAR_SIZE_GROUP,
                '&:nth-of-type(1)': {
                  left: 0,
                  zIndex: 9,
                  bottom: 2,
                  '& .MuiAvatar-root': {
                    border: (theme) => `solid 2px ${theme.palette.background.paper}`,
                  },
                },
                '&:nth-of-type(2)': { top: 2, right: 0 },
              },
            }),
          }}
        >
          {details.otherParticipants.map((participant) => (
            <AvatarWrapperStyle className="avatarWrapper" key={participant._id}>
              <Avatar alt={participant.name} src={participant.cover} />
              {!isGroup && dataWebSocket.userOnline.length > 0 && (
                <BadgeStatus
                  status={dataWebSocket.userOnline.some((item) => item._id === participant._id) ? 'online' : 'offline'}
                  sx={{ right: 2, bottom: 2, position: 'absolute' }}
                />
              )}
            </AvatarWrapperStyle>
          ))}

          {isOnlineGroup && <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />}
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={details.displayNames}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={details.displayText}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'textPrimary' : 'textSecondary',
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
              }}
            >
              {/* {formatDistanceToNowStrict(new Date(displayLastActivity), {
                addSuffix: false,
              })} */}
            </Box>
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
