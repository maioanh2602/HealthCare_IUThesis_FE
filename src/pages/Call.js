/* eslint-disable spaced-comment */
/* eslint-disable object-shorthand */
import { useEffect } from 'react';
import { VideoSDKMeeting } from '@videosdk.live/rtc-js-prebuilt';
import { useParams } from 'react-router-dom';

import { LINK_FE } from '../config';

import useAuth from '../hooks/useAuth';

function Call() {
  const { user } = useAuth();
  const { roomID } = useParams();

  const role = localStorage.getItem('role');

  useEffect(() => {
    // const apiKey = process.env.REACT_APP_VIDEOSDK_API_KEY;
    const apiKey = 'df3a0661-f33a-40fe-8829-bf612ae4a929';
    const meetingId = roomID;
    const name = user.displayName;

    const config = {
      name: name,
      meetingId: meetingId,
      apiKey: apiKey,

      region: 'HCM', // region for new meeting

      containerId: 'call',
      redirectOnLeave: role === 'patient' ? `${LINK_FE}/dashboard/rating/${roomID}` : `${LINK_FE}/dashboard/app`,

      micEnabled: false,
      webcamEnabled: false,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      participantCanLeave: true, // if false, leave button won't be visible

      chatEnabled: false,
      screenShareEnabled: false,
      pollEnabled: false,
      whiteboardEnabled: false,
      raiseHandEnabled: false,

      recording: {
        autoStart: false, // auto start recording on participant joined
        enabled: false,
        webhookUrl: 'https://www.videosdk.live/callback',
        awsDirPath: `/meeting-recordings/${meetingId}/`, // automatically save recording in this s3 path
      },

      livestream: {
        autoStart: false,
        enabled: false,
      },

      layout: {
        type: 'SPOTLIGHT', // "SPOTLIGHT" | "SIDEBAR" | "GRID"
        priority: 'PIN', // "SPEAKER" | "PIN",
        // gridSize: 3,
      },

      branding: {
        enabled: false,
        logoURL: 'https://static.zujonow.com/videosdk.live/videosdk_logo_circle_big.png',
        name: 'Prebuilt',
        poweredBy: false,
      },

      permissions: {
        pin: false,
        askToJoin: false, // Ask joined participants for entry in meeting
        toggleParticipantMic: false, // Can toggle other participant's mic
        toggleParticipantWebcam: false, // Can toggle other participant's webcam
        drawOnWhiteboard: false, // Can draw on whiteboard
        toggleWhiteboard: false, // Can toggle whiteboard
        toggleRecording: false, // Can toggle meeting recording
        toggleLivestream: false, //can toggle live stream
        removeParticipant: false, // Can remove participant
        endMeeting: true, // Can end meeting
        changeLayout: false, //can change layout
      },

      joinScreen: {
        visible: false, // Show the join screen ?
        title: 'Metting', // Meeting title
        meetingUrl: `${LINK_FE}/dashboard/call/${meetingId}`, // Meeting joining url
      },

      leftScreen: {
        // visible when redirect on leave not provieded
        actionButton: {
          // optional action button
          label: 'IU Health', // action button label
          href: `${LINK_FE}/`, // action button href
        },
      },

      notificationSoundEnabled: true,

      debug: true, // pop up error during invalid config or netwrok error

      maxResolution: 'sd', // "hd" or "sd"

      joinWithoutUserInteraction: true,

      // For more features check: /prebuilt/guide/prebuilt-video-and-audio-calling/getting-started
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomID, user]);
  return <div id="call" style={{ width: '100%', height: '100%' }} />;
}

export default Call;
