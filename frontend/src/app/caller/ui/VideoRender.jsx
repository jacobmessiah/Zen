import userChatStore from "@/store/userChatStore";
import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const VideoRender = ({ myViewRef, isConnected, stream }) => {
  const [swapState, setSwapState] = useState(0);

  const { convoSelected } = userChatStore();

  const RTCVideoRef = useRef(null);

  useEffect(() => {
    if (stream && RTCVideoRef.current && isConnected) {
      RTCVideoRef.current.srcObject = stream;
      console.log("Stream has been Set to RTC video");
    }
  }, [stream, RTCVideoRef, isConnected]);

  return (
    <Flex
      pos="relative"
      alignItems="center"
      justifyContent="center"
      w="full"
      h="full"
    >
      <Flex
        w={isConnected ? "180px" : "50%"}
        h={isConnected ? "120px" : "100%"}
        rounded={isConnected ? "10px" : "0px"}
        border={isConnected ? "3px solid" : "none"}
        borderColor="green.300"
        pos={isConnected ? "absolute" : "relative"}
        inset={isConnected ? " auto 5% 5% auto;" : "0"}
        zIndex={10}
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        mdDown={{
          w: `${isConnected ? "30%" : "100%"}`,
          h: `${isConnected ? "25%" : "100%"}`,
          bottom: "15%",
        }}
      >
        <video
          disablePictureInPicture
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
          muted
          autoPlay
          controls={false}
          playsInline
          ref={myViewRef}
        />
      </Flex>

      {isConnected && (
        <Flex
          mdDown={{
            w: "100%",
            rounded: "none",
            h: "100%",
            bg: "none",
            p: "0px",
          }}
          p="3px"
          justifyContent="center"
          alignItems="center"
          rounded="5px"
          w="60%"
          bg="green.300"
          h="70%"
        >
          <video
            disablePictureInPicture
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)",
              borderRadius: "5px",
            }}
            autoPlay
            muted ///Alert remove mute for video talking
            controls={false}
            playsInline
            ref={RTCVideoRef}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default VideoRender;
