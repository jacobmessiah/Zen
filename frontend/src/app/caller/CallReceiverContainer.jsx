import authUserStore from "@/store/authUserStore";
import userCallStore from "@/store/userCallStore";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import RequestVideo from "./ui/popup/RequestVideo";
import VideoRender from "./ui/VideoRender";
import AudioRender from "./ui/AudioRender";
import CallController from "./ui/CallController";

const CallReceiverContainer = () => {
  const { acceptedCall, showVideoRequest, setShowVideoRequest } =
    userCallStore();
  const { socket, authUser } = authUserStore();

  const hasRun = useRef(null);

  const [allowMedia, _setAllowMedia] = useState({
    video: acceptedCall?.video,
    audio: acceptedCall?.audio,
  });
  const rawStreamRef = useRef(null);
  const RTCRef = useRef(null);
  const [_callStep, _setCallStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [negotiationType, setNegotiationType] = useState(null);
  const [negotiationOffer, setNegotiationOffer] = useState(null);
  const [isVideo, SetIsVideo] = useState(
    allowMedia.video === true && allowMedia.audio === true
  );
  const [videoCam, setVideoCam] = useState(allowMedia.video);
  const [audioMic, setAudioMic] = useState(allowMedia.audio);

  const [remoteVideoStream, setRemoteVideoStream] = useState(null);

  const myViewRef = useRef(null);
  const [remoteAudioStream, setRemoteAudioStream] = useState(null);

  const iceServers = [
    { urls: ["stun:fr-turn7.xirsys.com"] },
    {
      username:
        "2YWalJMR2O774zrjY82Ph-NqUY6p6o1xsLDgAVjgQ6oNaqJElTuLSOsVq5-k-vUCAAAAAGjFLhBJbXBlcmlhbGtpbmc=",
      credential: "58e86112-907d-11f0-833c-0275b10a6b4a",
      urls: [
        "turn:fr-turn7.xirsys.com:80?transport=udp",
        "turn:fr-turn7.xirsys.com:3478?transport=udp",
        "turn:fr-turn7.xirsys.com:80?transport=tcp",
        "turn:fr-turn7.xirsys.com:3478?transport=tcp",
        "turns:fr-turn7.xirsys.com:443?transport=tcp",
        "turns:fr-turn7.xirsys.com:5349?transport=tcp",
      ],
    },
  ];

  const ids = {
    offerer: authUser?._id,
    answerer: acceptedCall.senderId,
  };

  const beginAccept = async () => {
    try {
      if (!isVideo) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: allowMedia?.audio,
          video: allowMedia?.video,
        });
        rawStreamRef.current = stream;
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        rawStreamRef.current = stream;
        if (isVideo) myViewRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Error on Media Fetch", error);
      return;
    }

    try {
      const RTC = new RTCPeerConnection({
        iceServers: iceServers,
      });
      RTC.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("call:server:ice", { ice: event.candidate, ...ids });
        }
      };

      RTC.ontrack = (e) => {
        isVideo
          ? setRemoteVideoStream(e.streams[0])
          : setRemoteAudioStream(e.streams[0]);
      };

      rawStreamRef.current.getTracks().forEach((track) => {
        RTC.addTrack(track, rawStreamRef.current);
      });
      RTC.onconnectionstatechange = () => {
        if (RTC.connectionState === "connected") {
          setIsConnected(true);
        }
      };

      RTC.onnegotiationneeded = handleOnNegotiationNeeded;
      const offer = await RTC.createOffer();
      await RTC.setLocalDescription(offer);
      socket.emit("call:server:offer", { offer: RTC.localDescription, ...ids });

  _setCallStep(1);

      RTCRef.current = RTC;
    } catch (error) {
      console.error("Error on WebRTC Catch Block", error);
    }
  };

  const receiveSDPAnswer = async (args) => {
    console.log("Received answer from Peer1");
    await RTCRef.current.setRemoteDescription(args.answer);
  };

  const receiveIceCandidates = async (args) => {
    console.log("Received Ice from Peer 1");
    await RTCRef.current.addIceCandidate(args.ice);
  };

  const videoRequestHandler = (args) => {
    setShowVideoRequest(args);
  };

  const handleAcceptVideoRequest = async () => {
    try {
      const newTrack = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      rawStreamRef.current = newTrack;
      setNegotiationType("offer");
      newTrack
        .getVideoTracks()
        .forEach((track) => RTCRef.current.addTrack(track, newTrack));
      setShowVideoRequest(null);
    } catch (error) {
      // Notice Catch Block
      console.error("Camera Refused", error);
    }
  };

  const handleOnNegotiationNeeded = async () => {
    if (negotiationType === "offer") {
      const offer = await RTCRef.current.createOffer();
      await RTCRef.current.setLocalDescription(offer);
      const socketData = {
        from: authUser._id,
        offer: offer,
        to: acceptedCall.senderId,
      };
      socket.emit("call:negotiation:offer:server", socketData);
      return;
    }

    if (negotiationType === "answer") {
      await RTCRef.current.setRemoteDescription(negotiationOffer);
      const answer = await RTCRef.current.createAnswer();
      await RTCRef.current.setLocalDescription(answer);
      setNegotiationOffer(null);
      const socketData = {
        answer,
        from: authUser._id,
        to: acceptedCall.senderId,
      };
      socket.emit("call:negotiation:answer:server", socketData);

      return;
    }
  };

  const receiveNegotiationOffer = async (args) => {
    console.log(args);
    try {
      setNegotiationType("answer");
      setNegotiationOffer(args.offer);
      console.log("OfferSDP Received for negotiation");
      const newTrack = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      newTrack.getVideoTracks().forEach((track) => {
        RTCRef.current.addTrack(track, newTrack);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const receiveNegotiationAnswer = async (args) => {
    console.log("answerSDP Received for negotiation");
    RTCRef.current.setRemoteDescription(args.answer);
  };

  const handleRequestVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: allowMedia?.video,
        audio: allowMedia?.audio,
      });

      rawStreamRef.current = stream;

      const socketData = {
        to: acceptedCall.senderId,
        from: authUser._id,
        name: authUser.name,
      };

      socket.emit("call:request:video:server", socketData);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    beginAccept();
    hasRun.current = true;
  }, []);

  // Listener  for ice
  useEffect(() => {
    socket.on("call:client:ice", receiveIceCandidates);
    return () => {
      socket.off("call:client:ice", receiveIceCandidates);
    };
  }, []);

  // Listener  for SDP answers
  useEffect(() => {
    socket.on("call:client:answer", receiveSDPAnswer);
    return () => {
      socket.off("call:client:answer", receiveSDPAnswer);
    };
  }, []);

  //listener for Video show Request
  useEffect(() => {
    socket.on("call:request:video", videoRequestHandler);
    return () => {
      socket.off("call:request:video");
    };
  }, []);

  //Listener for OnNegotiation offer
  useEffect(() => {
    socket.on("call:negotiation:offer:client", receiveNegotiationOffer);
    return () => socket.off("call:negotiation:offer:client");
  }, []);

  //Listener for OnNegotiation answer
  useEffect(() => {
    socket.on("call:negotiation:answer:client", receiveNegotiationAnswer);
    return () => socket.off("call:negotiation:answer:client");
  }, []);

  return (
    <Box
      mdDown={{
        h: "100%",
        position: "fixed",
      }}
      bg="black"
      w="full"
      h="100%"
      pos="absolute"
      top="0"
    >
      <Flex w="full" h="full">
        {isVideo ? (
          <VideoRender
            stream={remoteVideoStream}
            isConnected={isConnected}
            myViewRef={myViewRef}
          />
        ) : (
          <AudioRender
            myStream={rawStreamRef.current}
            RTCStream={remoteAudioStream}
            isConnected={isConnected}
          />
        )}
      </Flex>
      {showVideoRequest && (
        <RequestVideo acceptFunc={handleAcceptVideoRequest} />
      )}

      <CallController
        audioMic={audioMic}
        videoCam={videoCam}
        browserStream={rawStreamRef}
        isVideo={isVideo}
        setVideoCam={setVideoCam}
        setAudioMic={setAudioMic}
        requestVideoFunc={handleRequestVideo}
      />
    </Box>
  );
};

export default CallReceiverContainer;
