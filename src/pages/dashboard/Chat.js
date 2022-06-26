import { useEffect, useState } from 'react';
import { Card, Container } from '@mui/material';
import { useDispatch } from '../../redux/store';
import axios from '../../utils/axios';
import { getConversations } from '../../redux/slices/chat';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow } from '../../sections/@dashboard/chat';

import { socket } from '../../sections/@dashboard/chat/ws';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const [dataWebSocket, setDataWebSocket] = useState({
    userOnline: [],
    messages: [],
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    socket.on('newMessage', (data) => {
      setDataWebSocket((prev) => {
        const newValue = {
          ...prev,
          messages: data.chatMessage,
        };
        return newValue;
      });
      dispatch(getConversations());
    });
  }, [dispatch]);

  useEffect(() => {
    socket.on('userOnline', (data) => {
      setDataWebSocket((prev) => {
        const newValue = {
          ...prev,
          userOnline: data,
        };
        return newValue;
      });
      dispatch(getConversations());
    });
  }, [dispatch]);

  useEffect(() => {
    socket.on('ringing', (data) => {
      window.open(data.linkCall);
    });
  }, []);

  useEffect(() => {
    try {
      axios.post('/load-user-online').then((res) => {
        setDataWebSocket((prev) => {
          const newValue = {
            ...prev,
            userOnline: res.data.data,
          };
          return newValue;
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  return (
    <Page title="Chat">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar
            dataWebSocket={dataWebSocket}
            setDataWebSocket={setDataWebSocket}
            setPage={setPage}
            setHasMore={setHasMore}
          />
          <ChatWindow
            dataWebSocket={dataWebSocket}
            setDataWebSocket={setDataWebSocket}
            page={page}
            setPage={setPage}
            hasMore={hasMore}
            setHasMore={setHasMore}
          />
        </Card>
      </Container>
    </Page>
  );
}
