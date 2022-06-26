import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { List } from '@mui/material';
import { useDispatch } from '../../../redux/store';
import { getConversations } from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
//
import ChatConversationItem from './ChatConversationItem';
import axios from '../../../utils/axios';
// import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.array,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  sx: PropTypes.object,
  dataWebSocket: PropTypes.object,
  setDataWebSocket: PropTypes.func,
  setPage: PropTypes.func,
  setHasMore: PropTypes.func,
};

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  // activeConversationId,
  sx,
  dataWebSocket,
  setDataWebSocket,
  setPage,
  setHasMore,
  ...other
}) {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const dispatch = useDispatch();

  const { conversationKey } = useParams();

  const handleSelectConversation = (conversationId) => {
    setPage(1);
    setHasMore(true);
    let conversationKey = '';
    // const conversation = conversations.byId[conversationId];

    // const otherParticipant = conversationId.participants.find((participant) => participant._id !== user._id);
    if (conversationId?._id) {
      conversationKey = conversationId?._id;
    }

    // if (conversation.type === 'GROUP') {
    //   conversationKey = conversation.id;
    // } else {
    //   const otherParticipant = conversation.participants.find((participant) => participant.id !== user._id);
    //   if (otherParticipant?.username) {
    //     conversationKey = otherParticipant?.username;
    //   }
    // }
    navigate(PATH_DASHBOARD.chat.view(conversationKey));

    try {
      axios
        .post('/room/mark-read', {
          roomID: conversationKey,
        })
        .then(() => {
          dispatch(getConversations());
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  const loading = !conversations.length;

  useEffect(() => {
    if (conversationKey) {
      try {
        axios
          .post('/room/load-message', {
            roomID: conversationKey,
            currentPage: 1,
            recordPerPage: 10,
          })
          .then((res) => {
            setDataWebSocket((prev) => {
              const newValue = {
                ...prev,
                messages: res.data.data.chatMessage,
              };
              return newValue;
            });
            if (res.data.data.chatMessage.length === 0) {
              setHasMore(false);
            }
          });
      } catch (error) {
        console.log('error', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : conversations).map((item, index) =>
        item ? (
          <ChatConversationItem
            item={item}
            key={item._id}
            isOpenSidebar={isOpenSidebar}
            conversation={dataWebSocket.messages}
            isSelected={conversationKey === item._id}
            onSelectConversation={() => handleSelectConversation(item)}
            dataWebSocket={dataWebSocket}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
