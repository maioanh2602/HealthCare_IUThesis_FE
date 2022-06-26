import { io } from 'socket.io-client';
import { LINK_WS } from '../../../config';

export const socket = io(LINK_WS, {
  auth: {
    token: localStorage.getItem('accessToken'),
  },
});
