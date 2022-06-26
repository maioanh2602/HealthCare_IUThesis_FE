import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from '@emotion/styled';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../../../utils/axios';

//
// import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired,
  page: PropTypes.number,
  hasMore: PropTypes.bool,
  setPage: PropTypes.func,
  setHasMore: PropTypes.func,
  setDataWebSocket: PropTypes.func,
};

export default function ChatMessageList({ conversation, setDataWebSocket, page, hasMore, setPage, setHasMore }) {
  const scrollRef = useRef(null);
  const { conversationKey } = useParams();

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const _onLoadMore = () => {
    const temp = page + 1;
    setPage(temp);
    try {
      axios
        .post('/room/load-message', {
          roomID: conversationKey,
          currentPage: temp,
          recordPerPage: 10,
        })
        .then((res) => {
          // eslint-disable-next-line prefer-const
          let temp = [];
          res.data.data.chatMessage.forEach((item) => {
            temp.push(item);
          });

          setDataWebSocket((prev) => {
            const newValue = {
              ...prev,
              messages: prev.messages.concat(temp),
            };

            if (newValue.messages.length === res.data.data.total) {
              setHasMore(false);
            }
            return newValue;
          });
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation.messages]);

  const imagesLightbox = conversation.messages
    .filter((messages) => messages.type === 'image')
    .map((messages) => messages.message);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      <WrapContent id="scrollableDiv">
        <InfiniteScroll
          dataLength={conversation.messages.length}
          scrollableTarget="scrollableDiv"
          loader={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
              <CircularProgress />
            </div>
          }
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
          }}
          // endMessage={
          //   <p style={{ textAlign: 'center' }}>
          //     <b>Yay! You have seen it all</b>
          //   </p>
          // }
          hasMore={hasMore}
          inverse
          next={_onLoadMore}
          height={570}
        >
          {/* <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}> */}
          {conversation.messages.map((message) => (
            <ChatMessageItem
              key={message._id}
              message={message}
              conversation={conversation}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
          {/* </Scrollbar> */}
        </InfiniteScroll>
      </WrapContent>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}

const WrapContent = styled.div`
  height: 570px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  padding-left: 24px;

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;
