import authUserStore from "@/store/authUserStore";
import userChatStore from "@/store/userChatStore";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import replacerImage from "@/assets/default.jpg";

const AudioRender = ({ RTCStream, myStream, isConnected }) => {
  const { authUser } = authUserStore();
  const { convoSelected } = userChatStore();
  const playerAudioRef = useRef(null);

  const [IamSpeaking, setIamSpeaking] = useState(null);
  const [peerIsSpeaking, setPeerIsSpeaking] = useState(null);

  useEffect(() => {
    if (RTCStream) {
      playerAudioRef.current.srcObject = RTCStream;
    }
  }, [RTCStream]);

  useEffect(() => {
    let frameId;
    let audioContext;

    if (myStream) {
      audioContext = new AudioContext();
      const analyzer = audioContext.createAnalyser();

      const source = audioContext.createMediaStreamSource(myStream);
      source.connect(analyzer);

      const bufferLength = analyzer.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      function getArrayOnFrame() {
        analyzer.getByteTimeDomainData(dataArray);

        let sumOfDistances = 0;
        for (const amplitude of dataArray) {
          const distanceFromSilence = Math.abs(amplitude - 128);

          sumOfDistances += distanceFromSilence;
        }

        const averageVolume = Math.floor(sumOfDistances / dataArray.length);

        setIamSpeaking(averageVolume >= 2);

        frameId = requestAnimationFrame(getArrayOnFrame);
      }

      getArrayOnFrame();
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [myStream]);

  useEffect(() => {
    let frameId;
    let audioContext;

    if (RTCStream && isConnected) {
      audioContext = new AudioContext();
      const analyzer = audioContext.createAnalyser();

      const source = audioContext.createMediaStreamSource(RTCStream);
      source.connect(analyzer);

      const bufferLength = analyzer.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      function getArrayOnFrame() {
        analyzer.getByteTimeDomainData(dataArray);

        let sumOfDistances = 0;
        for (const amplitude of dataArray) {
          const distanceFromSilence = Math.abs(amplitude - 128);

          sumOfDistances += distanceFromSilence;
        }

        const averageVolume = Math.floor(sumOfDistances / dataArray.length);

        setPeerIsSpeaking(averageVolume >= 2);

        frameId = requestAnimationFrame(getArrayOnFrame);
      }

      getArrayOnFrame();
    }

    return () => {
      cancelAnimationFrame(frameId);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [RTCStream, isConnected]);

  return (
    <Flex
      mdDown={{
        flexDirection: "column",
        gap: "25px",
      }}
      gap="50px"
      justify="center"
      alignItems="center"
      w="full"
      h="full"
    >
      <audio hidden autoPlay ref={playerAudioRef} />

      <Flex
        mdDown={{
          minH: "35%",
          w: "65%",
        }}
        minH="60%"
        bg={IamSpeaking ? "blue.600" : "none"}
        rounded="10px"
        p="2px"
        w="30%"
        transition="all"
      >
        <Flex
          rounded="10px"
          bg="gray.900"
          minH="full"
          minW="full"
          justifyContent="center"
          alignItems="center"
          pos="relative"
        >
          <Image
            rounded="full"
            src={authUser.profile?.profilePic || replacerImage}
            w="80px"
            pointerEvents="none"
            userSelect="none"
            h="80px"
          />
          <Flex
            bg="#000000b7"
            left="2%"
            p="5px"
            pos="absolute"
            bottom="1"
            w="120px"
            userSelect="none"
            rounded="8px"
            mdDown={{
              fontSize: "md",
            }}
          >
            {authUser?.name}
          </Flex>
        </Flex>
      </Flex>

      <Flex
        mdDown={{
          minH: "35%",
          w: "65%",
        }}
        minH="60%"
        bg={IamSpeaking ? "blue.600" : "none"}
        rounded="10px"
        p="2px"
        w="30%"
        transition="all"
      >
        <Flex
          rounded="10px"
          bg="gray.900"
          minH="full"
          minW="full"
          justifyContent="center"
          alignItems="center"
          pos="relative"
        >
          <Image
            rounded="full"
            src={
              convoSelected?.otherParticipant?.profile?.profilePic ||
              replacerImage
            }
            w="80px"
            pointerEvents="none"
            userSelect="none"
            h="80px"
          />
          <Flex
            bg="#000000b7"
            left="2%"
            p="5px"
            pos="absolute"
            bottom="1"
            w="120px"
            userSelect="none"
            rounded="8px"
          >
            {convoSelected?.otherParticipant?.name}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AudioRender;
