import { Tooltip } from "@/components/ui/tooltip";
import { Button, Flex } from "@chakra-ui/react";
import { FaMicrophone, FaVideo, FaVideoSlash } from "react-icons/fa6";
import { IoMdMicOff } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { toast } from "sonner";

const CallController = ({
  browserStream,
  isVideo,
  videoCam,
  setVideoCam,
  audioMic,
  setAudioMic,
  requestVideoFunc,
}) => {
  const handleMicClick = () => {
    const audioTracks = browserStream.current.getAudioTracks();

    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setAudioMic(audioTracks[0].enabled);
  };
  const handleCamClick = async () => {
    if (isVideo) {
      const videoTracks = browserStream.current.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !track.enabled));
      setVideoCam(videoTracks[0].enabled);
    } else {
      requestVideoFunc();
    }
  };

  return (
    <Flex
      position="absolute"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      w="40%"
      justify="center"
      bg="gray.900"
      p="8px"
      gap="30px"
      rounded="full"
      mdDown={{
        bottom: "10px",
        w: "80%",
      }}
    >
      <Tooltip
        openDelay={100}
        closeDelay={100}
        content={audioMic ? "Mute Mic" : "Unmute Mic"}
        contentProps={{
          css: { "--tooltip-bg": "#2c2c2c", color: "white", padding: "8px" },
        }}
      >
        <Button
          rounded="full"
          transition="all"
          colorPalette={audioMic ? "green" : "gray"}
          onClick={handleMicClick}
        >
          {audioMic ? <FaMicrophone /> : <IoMdMicOff />}
        </Button>
      </Tooltip>

      <Tooltip
        openDelay={100}
        closeDelay={100}
        positioning={{ placement: "top-center" }}
        contentProps={{
          css: { "--tooltip-bg": "#2c2c2c", color: "white", padding: "8px" },
        }}
        content={videoCam ? "Turn off Camera" : "Turn on Camera"}
      >
        <Button
          rounded="full"
          transition="all"
          colorPalette={videoCam ? "green" : "gray"}
          onClick={handleCamClick}
        >
          {videoCam ? <FaVideo /> : <FaVideoSlash />}
        </Button>
      </Tooltip>

      <Tooltip
        positioning={{ placement: "top-center" }}
        contentProps={{ css: { "--tooltip-bg": "red", padding: "8px" } }}
        openDelay={100}
        closeDelay={100}
        content="End Call"
      >
        <Button rounded="full" colorPalette="red" bg="red">
          <MdCallEnd />
        </Button>
      </Tooltip>
    </Flex>
  );
};

export default CallController;
