import {
  Box,
  Flex,
  Float,
  FormatByte,
  IconButton,
  Image,
  LocaleProvider,
  Skeleton,
  Slider,
  Text,
} from "@chakra-ui/react";
import type { Attachment } from "../../../../types/schema";
import { generateCDN_URL } from "../../../../utils/generalFunctions";
import { useRef, useState, type ChangeEvent } from "react";
import { FaFileAudio, FaPause, FaPlay } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { RiFullscreenFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { Tooltip } from "../../../../components/ui/tooltip";
import { AiOutlineLoading } from "react-icons/ai";

const getSource = (
  filePath: string | undefined,
  previewUrl: string,
  mimeType: string,
) => {
  if (previewUrl && typeof previewUrl === "string") {
    return previewUrl;
  } else {
    if (!filePath) return;
    return generateCDN_URL(filePath, mimeType);
  }
};

const LoadingMedia = () => {
  return (
    <Flex pos="relative" w="250px" h="300px">
      <Flex
        bg="rgba(26, 26, 26, 0.4)"
        color="white"
        top="10px"
        right="10px"
        pos="absolute"
        boxSize="25px"
        justifyContent="center"
        rounded="full"
      >
        <Flex animation="spin" alignItems="center" animationDuration="slower">
          <AiOutlineLoading size={18} />
        </Flex>
      </Flex>

      <Skeleton variant="shine" h="full" w="full" />
    </Flex>
  );
};

const ImageAttachment = ({ attachment }: { attachment: Attachment }) => {
  if (!attachment.filePath) return null;

  const [isLoaded, setIsLoaded] = useState(false);

  const src = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  return (
    <Flex rounded="5px" overflow="hidden" height="200px">
      <Image
        onLoad={() => setIsLoaded(true)}
        display={isLoaded ? "unset" : "none"}
        src={src}
        minH="full"
        minW="full"
        maxH="full"
        maxW="full"
      />
      {!isLoaded && <LoadingMedia />}
    </Flex>
  );
};

const VideoAttachment = ({
  attachment,
  openFullScreenText,
  showControl,
}: {
  attachment: Attachment;
  openFullScreenText: string;
  showControl: boolean;
}) => {
  const url = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  const [videoDetails, setVideoDetails] = useState({
    isPlaying: false,
    duration: 0,
    isMuted: false,
    currentTime: 0,
    volume: 100,
    isClicked: false,
    showPlayButton: true,
    isFullScreen: false,
    isLoading: true,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handlePlayVideo = () => {
    if (videoDetails.showPlayButton) {
      setVideoDetails((p) => ({ ...p, showPlayButton: !p.showPlayButton }));
    }
    if (videoRef.current) {
      const paused = videoRef.current.paused;
      if (paused) {
        videoRef.current.play();
        setVideoDetails((p) => ({ ...p, isPlaying: true }));
      } else {
        videoRef.current.pause();
        setVideoDetails((p) => ({ ...p, isPlaying: false }));
      }
    }
  };

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const time = Number(value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      if (videoDetails.isMuted) {
        setVideoDetails((p) => ({ ...p, isMuted: false }));
        videoRef.current.volume = 1.0;
        setVideoDetails((p) => ({ ...p, volume: 100 }));
      } else {
        setVideoDetails((p) => ({ ...p, isMuted: true }));
        videoRef.current.volume = 0.0;
        setVideoDetails((p) => ({ ...p, volume: 0 }));
      }
    }
  };
  const handleToggleFullscreen = () => {
    const el = document.getElementById(attachment.fileId);

    if (!el) return;
    if (document.fullscreenElement) {
      setVideoDetails((p) => ({ ...p, isFullScreen: false }));
      document.exitFullscreen();
      return;
    }

    setVideoDetails((p) => ({ ...p, isFullScreen: true }));
    el.requestFullscreen().catch((e) =>
      console.log("Error enabling full screen: ", e.message),
    );
  };

  return (
    <Flex
      id={attachment.fileId}
      maxW="300px"
      maxH="300px"
      overflow="hidden"
      rounded="5px"
      pos="relative"
      data-video-container
    >
      <Flex
        display={videoDetails.isLoading ? "none" : "flex"}
        w="full"
        h="full"
      >
        <video
          onClick={handlePlayVideo}
          ref={videoRef}
          onLoadedMetadata={(event) => {
            const duration = event.currentTarget.duration;
            if (duration && !isNaN(duration)) {
              setVideoDetails((p) => ({
                ...p,
                duration,
              }));
            }
          }}
          onTimeUpdate={(event) => {
            const currentTime = event.currentTarget.currentTime;
            if (sliderRef.current) {
              sliderRef.current.value = currentTime.toString();
            }
          }}
          onEnded={() => {
            if (sliderRef.current) {
              sliderRef.current.value = "0";
            }
            setVideoDetails((p) => ({ ...p, isPlaying: false }));
          }}
          preload="metadata"
          src={url}
          style={{
            width: "100%",
            height: "100%",
            objectFit: videoDetails.isFullScreen ? "contain" : "cover",
          }}
          onLoadedData={() => {
            setVideoDetails((p) => ({ ...p, isLoading: false }));
          }}
        />

        {showControl && (
          <Flex
            opacity={!videoDetails.showPlayButton ? 100 : 0}
            pos="absolute"
            bottom="0px"
            transition="0.1s ease"
            w="100%"
            alignItems="center"
          >
            <IconButton
              focusRing="none"
              color="whiteAlpha.800"
              _hover={{
                color: "white",
              }}
              size="md"
              rounded="full"
              variant="plain"
              onClick={handlePlayVideo}
            >
              {videoDetails.isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>
            <input
              ref={sliderRef}
              type="range"
              min={0}
              max={videoDetails.duration}
              step={1}
              onChange={handleSliderChange}
              style={{ flex: 1, accentColor: "black" }}
            />

            <IconButton
              focusRing="none"
              color="whiteAlpha.800"
              _hover={{
                color: "white",
              }}
              size="md"
              variant="plain"
              pos="relative"
              data-video-speaker
            >
              <Float placement="top-center" offsetY="-60px">
                <Slider.Root
                  onClick={(e) => e.stopPropagation()}
                  transition="0.1s ease"
                  transform="translateY(40px)"
                  opacity={0}
                  css={{
                    "[data-video-speaker]:hover &": {
                      opacity: { lg: "100" },
                      transform: "translateY(0px)",
                      h: "100px",
                    },
                    "[data-video-speaker]:focus &": {
                      opacity: { lg: "100" },
                      transform: "translateY(0px)",
                      h: "100px",
                    },
                  }}
                  onValueChange={(e) => {
                    if (videoRef.current) {
                      const volume = e.value[0] / 100;

                      if (e.value[0] === 0) {
                        setVideoDetails((p) => ({ ...p, isMuted: true }));
                      } else {
                        setVideoDetails((p) => ({ ...p, isMuted: false }));
                      }

                      videoRef.current.volume = volume;
                    }
                    setVideoDetails((p) => ({ ...p, volume: e.value[0] }));
                  }}
                  height="0px"
                  orientation="vertical"
                  value={[videoDetails.volume]}
                  max={100}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                  </Slider.Control>
                </Slider.Root>
              </Float>
              {videoDetails.isMuted ? (
                <HiSpeakerXMark
                  onClick={handleToggleMute}
                  style={{ width: "25px", height: "25px" }}
                />
              ) : (
                <HiSpeakerWave
                  onClick={handleToggleMute}
                  style={{ width: "25px", height: "25px" }}
                />
              )}
            </IconButton>

            <Tooltip
              showArrow
              positioning={{ placement: "top" }}
              content={openFullScreenText}
            >
              <IconButton
                focusRing="none"
                color="whiteAlpha.800"
                _hover={{
                  color: "white",
                }}
                size="md"
                rounded="full"
                variant="plain"
                onClick={handleToggleFullscreen}
              >
                <RiFullscreenFill style={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          </Flex>
        )}
        {videoDetails.showPlayButton && (
          <IconButton
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play();
                setVideoDetails((p) => ({ ...p, showPlayButton: false }));
              }
            }}
            rounded="full"
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <FaPlay />
          </IconButton>
        )}
      </Flex>
      {videoDetails.isLoading && <LoadingMedia />}
    </Flex>
  );
};

function formatTime(timeInSeconds: number) {
  const totalSeconds = Math.floor(timeInSeconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const AudioAttachment = ({
  attachment,
  language,
}: {
  attachment: Attachment;
  language: string;
}) => {
  const url = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  const [audioDetails, setAudioDetails] = useState({
    duration: 0,
    isPlaying: false,
    currentTime: 0,
    isMuted: false,
    volume: 100,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const time = Number(value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioDetails.isPlaying) {
      audio.pause();
      setAudioDetails((p) => ({ ...p, isPlaying: false }));
    } else {
      audio.play();
      setAudioDetails((p) => ({ ...p, isPlaying: true }));
    }
  };

  const handleDownload = () => {
    if (!attachment.filePath || attachment.filePath === "") return;

    const downloadUrl = generateCDN_URL(
      attachment.filePath!,
      attachment.mimeType,
      true,
    );
    const url = downloadUrl;
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.name;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      if (audioDetails.isMuted) {
        setAudioDetails((p) => ({ ...p, isMuted: false }));
        audioRef.current.volume = 1.0;
        setAudioDetails((p) => ({ ...p, volume: 100 }));
      } else {
        setAudioDetails((p) => ({ ...p, isMuted: true }));
        audioRef.current.volume = 0.0;
        setAudioDetails((p) => ({ ...p, volume: 0 }));
      }
    }
  };

  return (
    <Flex
      h="100px"
      border="1px solid"
      borderColor="bg.emphasized"
      px="10px"
      justifyContent="center"
      minW="300px"
      maxW="300px"
      rounded="md"
      direction="column"
      userSelect="none"
    >
      <audio
        onTimeUpdate={(e) => {
          const currentTime = e.currentTarget.currentTime;
          setAudioDetails((p) => ({ ...p, currentTime }));
          if (sliderRef.current) {
            sliderRef.current.value = currentTime.toString();
          }
        }}
        onLoadedMetadata={(e) => {
          const duration = e.currentTarget.duration;
          setAudioDetails((p) => ({ ...p, duration: duration }));
        }}
        onEnded={() => {
          setAudioDetails((p) => ({ ...p, isPlaying: false, currentTime: 0 }));
        }}
        ref={audioRef}
        src={url}
      />
      <Flex alignItems="center" gap="10px">
        <FaFileAudio size={30} />
        <Flex
          direction="column"
          maxW="100%"
          minW={0}
          color="fg.muted"
          fontSize="sm"
        >
          <Text
            onClick={handleDownload}
            _hover={{
              textDecoration: attachment.filePath ? "underline" : "none",
            }}
            maxW="100%"
            minW={0}
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {attachment.name}
          </Text>

          <Flex maxW="100%" minW={0} overflow="hidden">
            <Text overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
              <LocaleProvider locale={language}>
                <FormatByte value={attachment.size} />
              </LocaleProvider>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        rounded="md"
        bg="bg.emphasized"
        p="2px"
        w="full"
        alignItems="center"
        gap="5px"
      >
        <Flex
          onClick={handleTogglePlay}
          boxSize="25px"
          alignItems="center"
          justifyContent="center"
          color="whiteAlpha.800"
          _hover={{
            color: "white",
          }}
        >
          {audioDetails.isPlaying ? <FaPause /> : <FaPlay />}
        </Flex>

        <Flex gap="3px" color="fg.muted" alignItems="center" fontSize="sm">
          <Text>{formatTime(audioDetails.currentTime)}</Text>/
          <Text>{formatTime(audioDetails.duration)}</Text>
        </Flex>

        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={audioDetails.duration}
          step={1}
          onChange={handleSliderChange}
          style={{ flex: 1, accentColor: "black" }}
        />

        <Flex
          focusRing="none"
          color="whiteAlpha.800"
          _hover={{
            color: "white",
          }}
          boxSize="25px"
          alignItems="center"
          justifyContent="center"
          pos="relative"
          data-audio-speaker
        >
          <Float placement="top-center" offsetY="-60px">
            <Slider.Root
              size="sm"
              onClick={(e) => e.stopPropagation()}
              transition="0.1s ease"
              transform="translateY(40px)"
              opacity={0}
              css={{
                "[data-audio-speaker]:hover &": {
                  opacity: { lg: "100" },
                  transform: "translateY(0px)",
                  h: "100px",
                },
                "[data-audio-speaker]:focus &": {
                  opacity: { lg: "100" },
                  transform: "translateY(0px)",
                  h: "100px",
                },
              }}
              onValueChange={(e) => {
                if (audioRef.current) {
                  const volume = e.value[0] / 100;

                  if (e.value[0] === 0) {
                    setAudioDetails((p) => ({ ...p, isMuted: true }));
                  } else {
                    setAudioDetails((p) => ({ ...p, isMuted: false }));
                  }

                  audioRef.current.volume = volume;
                }
                setAudioDetails((p) => ({ ...p, volume: e.value[0] }));
              }}
              height="0px"
              orientation="vertical"
              value={[audioDetails.volume]}
              max={100}
            >
              <Slider.Control>
                <Slider.Track>
                  <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
              </Slider.Control>
            </Slider.Root>
          </Float>
          {audioDetails.isMuted ? (
            <HiSpeakerXMark
              onClick={handleToggleMute}
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <HiSpeakerWave
              onClick={handleToggleMute}
              style={{ width: "20px", height: "20px" }}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const MessageAttachmentRenderer = ({
  attachments,
}: {
  attachments: Attachment[];
}) => {
  // Get attachments that can be rendered and viewed directly
  const visualAttachments = attachments.filter(
    (att) => att.type === "video" || att.type === "image",
  );

  // Get audioAttachments
  const audioAttachments = attachments.filter((att) => att.type === "audio");

  // Get documentAttachments
  const documentAttachments = attachments.filter(
    (att) => att.type === "document",
  );

  const { t: translate, i18n } = useTranslation(["chat"]);
  const openFullScreenText = translate("openFullScreenText");

  const displayAttachmentFullscreen = (att: Attachment) => {};

  return (
    <Flex maxW={{ lg: "90%" }} pb="10px" textAlign="center">
      {Array.isArray(visualAttachments) && visualAttachments.length > 0 && (
        <Box className={`gallery count-${visualAttachments.length}`}>
          {visualAttachments.map((att) => {
            if (att.type === "image") {
              return <ImageAttachment key={att.fileId} attachment={att} />;
            }

            if (att.type === "video") {
              return (
                <VideoAttachment
                  showControl={visualAttachments.length === 1}
                  openFullScreenText={openFullScreenText}
                  key={att.fileId}
                  attachment={att}
                />
              );
            }
          })}
        </Box>
      )}
      {Array.isArray(audioAttachments) && audioAttachments.length > 0 && (
        <Flex w="full" direction="column" gap="10px">
          {audioAttachments.map((att) => (
            <AudioAttachment
              language={i18n.language}
              key={att.fileId}
              attachment={att}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default MessageAttachmentRenderer;
