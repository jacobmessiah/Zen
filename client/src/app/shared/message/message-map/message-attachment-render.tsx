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
import type { Attachment, IUser } from "../../../../types/schema";
import { generateCDN_URL } from "../../../../utils/generalFunctions";
import { Suspense, useRef, useState, type ChangeEvent } from "react";
import { FaFileAudio, FaPause, FaPlay } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { RiFullscreenFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { Tooltip } from "../../../../components/ui/tooltip";
import { AiOutlineLoading } from "react-icons/ai";
import { getDocumentIcon } from "../message-input-ui";
import userChatStore from "../../../../store/user-chat-store";
import { createDialog } from "../../../dialog/create-dialog";
import AttachmentFullScreenUI from "../../../dialog/ui/attachment-preview/attachment-fullscreen-renderer";

export const getSource = (
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

const ImageAttachment = ({
  attachment,
  displayAttachmentFullscreen,
}: {
  attachment: Extract<Attachment, { type: "image" }>;
  displayAttachmentFullscreen: (
    att: Extract<Attachment, { type: "image" }>,
  ) => void;
}) => {
  if (!attachment.filePath) return null;

  const [isLoaded, setIsLoaded] = useState(false);

  const src = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  return (
    <Flex
      onClick={() => displayAttachmentFullscreen(attachment)}
      rounded="5px"
      overflow="hidden"
      height="200px"
    >
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
  displayAttachmentFullscreen,
}: {
  attachment: Extract<Attachment, { type: "video" }>;
  openFullScreenText: string;
  showControl: boolean;
  displayAttachmentFullscreen: (
    att: Extract<Attachment, { type: "video" }>,
  ) => void;
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
    buttonFocused: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const isMobile = !window.matchMedia("(hover: hover)").matches;

  const handlePlayVideo = () => {
    if (!showControl) {
      displayAttachmentFullscreen(attachment);
      return;
    }

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

  const handleToggleMute = (event: React.MouseEvent<HTMLDivElement>) => {
    const currentTarget = event.currentTarget;

    if (isMobile) {
      if (!videoDetails.buttonFocused) {
        currentTarget.focus();
        return;
      }

      if (videoRef.current) {
        if (videoDetails.isMuted) {
          videoRef.current.volume = 1.0;
          setVideoDetails((p) => ({ ...p, isMuted: false, volume: 100 }));
        } else {
          videoRef.current.volume = 0.0;
          setVideoDetails((p) => ({ ...p, isMuted: true, volume: 0 }));
        }
      }
    } else {
      if (videoRef.current) {
        if (videoDetails.isMuted) {
          videoRef.current.volume = 1.0;
          setVideoDetails((p) => ({ ...p, isMuted: false, volume: 100 }));
        } else {
          videoRef.current.volume = 0.0;
          setVideoDetails((p) => ({ ...p, isMuted: true, volume: 0 }));
        }
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
      maxH="350px"
      h="350px"
      w="250px"
      overflow="hidden"
      rounded="5px"
      pos="relative"
      data-video-container
    >
      <Flex
        display={videoDetails.isLoading ? "none" : "flex"}
        w="full"
        h="full"
        direction="column"
      >
        <Flex w="full" overflow="hidden">
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
        </Flex>

        {showControl && !videoDetails.showPlayButton && (
          <Flex
            bg="fg.muted"
            opacity={!videoDetails.showPlayButton ? 100 : 0}
            zIndex={88}
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

            <Flex
              tabIndex={0}
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
              className="group"
              onClick={handleToggleMute}
              onFocus={(e) => {
                e.stopPropagation();
                setVideoDetails((p) => ({ ...p, buttonFocused: true }));
              }}
              onBlur={() => {
                setVideoDetails((p) => ({ ...p, buttonFocused: false }));
              }}
            >
              <Float placement="top-center" offsetY="-60px">
                <Slider.Root
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  size="sm"
                  transition="0.1s ease"
                  transform={
                    videoDetails.buttonFocused
                      ? "translateY(0px)"
                      : "translateY(40px)"
                  }
                  opacity={videoDetails.buttonFocused ? 100 : 0}
                  css={{
                    "[data-audio-speaker]:hover &": {
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
                  height={videoDetails.buttonFocused ? "100px" : "0px"}
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
                <HiSpeakerXMark style={{ width: "20px", height: "20px" }} />
              ) : (
                <HiSpeakerWave style={{ width: "20px", height: "20px" }} />
              )}
            </Flex>

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
        {videoDetails.showPlayButton && !videoDetails.isLoading && (
          <IconButton
            onClick={() => {
              setVideoDetails((p) => ({ ...p, showPlayButton: false }));
              handlePlayVideo();
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
    buttonFocused: false,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const isMobile = !window.matchMedia("(hover: hover)").matches;

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
  const handleToggleMute = (event: React.MouseEvent<HTMLDivElement>) => {
    const currentTarget = event.currentTarget;

    if (isMobile) {
      if (!audioDetails.buttonFocused) {
        currentTarget.focus();
        return;
      }

      if (audioRef.current) {
        if (audioDetails.isMuted) {
          audioRef.current.volume = 1.0;
          setAudioDetails((p) => ({ ...p, isMuted: false, volume: 100 }));
        } else {
          audioRef.current.volume = 0.0;
          setAudioDetails((p) => ({ ...p, isMuted: true, volume: 0 }));
        }
      }
    } else {
      if (audioRef.current) {
        if (audioDetails.isMuted) {
          audioRef.current.volume = 1.0;
          setAudioDetails((p) => ({ ...p, isMuted: false, volume: 100 }));
        } else {
          audioRef.current.volume = 0.0;
          setAudioDetails((p) => ({ ...p, isMuted: true, volume: 0 }));
        }
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
          tabIndex={0}
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
          className="group"
          onClick={handleToggleMute}
          onFocus={(e) => {
            e.stopPropagation();
            setAudioDetails((p) => ({ ...p, buttonFocused: true }));
          }}
          onBlur={() => {
            setAudioDetails((p) => ({ ...p, buttonFocused: false }));
          }}
        >
          <Float placement="top-center" offsetY="-60px">
            <Slider.Root
              size="sm"
              transition="0.1s ease"
              transform={
                audioDetails.buttonFocused
                  ? "translateY(0px)"
                  : "translateY(40px)"
              }
              opacity={audioDetails.buttonFocused ? 100 : 0}
              css={{
                "[data-audio-speaker]:hover &": {
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
              height={audioDetails.buttonFocused ? "100px" : "0px"}
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
            <HiSpeakerXMark style={{ width: "20px", height: "20px" }} />
          ) : (
            <HiSpeakerWave style={{ width: "20px", height: "20px" }} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const DocumentAttachmnet = ({
  attachment,
  lang,
}: {
  attachment: Extract<Attachment, { type: "document" }>;
  lang: string;
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    const downloadUrl = generateCDN_URL(
      attachment.filePath!,
      attachment.mimeType,
      true,
    );
    link.href = downloadUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Flex
      h="70px"
      border="1px solid"
      borderColor="bg.emphasized"
      px="10px"
      justifyContent="center"
      minW="300px"
      maxW="300px"
      rounded="md"
      userSelect="none"
      gap="10px"
      alignItems="center"
    >
      {getDocumentIcon(attachment.mimeType, 40)}

      <Flex fontSize="sm" direction="column" flex="1" minW="0">
        <Text
          onClick={handleDownload}
          _hover={{
            textDecoration: attachment.filePath ? "underline" : "none",
          }}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {attachment.name}
        </Text>

        <Text
          color="fg.muted"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          textAlign="left"
        >
          <LocaleProvider locale={lang}>
            <FormatByte value={attachment.size} />
          </LocaleProvider>
        </Text>
      </Flex>
    </Flex>
  );
};

const MessageAttachmentRenderer = ({
  attachments,
  createdAt,
  senderProfile,
}: {
  attachments: Attachment[];
  createdAt: string;
  senderProfile: IUser | undefined;
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

  const displayAttachmentFullscreen = (
    att: Extract<Attachment, { type: "video" | "image" }>,
  ) => {
    const filtered = visualAttachments.filter((p) => p.fileId !== att.fileId);
    const newArray = [att, ...filtered];
    userChatStore.setState({
      selectedVisualAttachments: {
        attachments: newArray,
        senderProfile,
        createdAt,
      },
    });

    const dialogId = "previewAttachments";
    createDialog.open(dialogId, {
      dialogSize: "full",
      showCloseButton: false,
      showBackDrop: true,
      contentRounded: "0px",
      contentHeight: "100dvh",
      contentWidth: "100dvw",
      contentBg: "transparent",
      bodyPadding: "0px",
      backdropBg: "rgba(0, 0, 0, 0.55)",
      content: (
        <Suspense>
          <AttachmentFullScreenUI />
        </Suspense>
      ),
    });
  };

  return (
    <Flex maxW={{ lg: "90%" }} pb="10px" textAlign="center">
      {Array.isArray(visualAttachments) && visualAttachments.length > 0 && (
        <Box className={`gallery count-${visualAttachments.length}`}>
          {visualAttachments.map((att) => {
            if (att.type === "image") {
              return (
                <ImageAttachment
                  displayAttachmentFullscreen={displayAttachmentFullscreen}
                  key={att.fileId}
                  attachment={att}
                />
              );
            }

            if (att.type === "video") {
              return (
                <VideoAttachment
                  displayAttachmentFullscreen={displayAttachmentFullscreen}
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
      {Array.isArray(documentAttachments) && documentAttachments.length > 0 && (
        <Flex direction="column">
          {documentAttachments.map((att) => (
            <DocumentAttachmnet
              key={att.fileId}
              lang={i18n.language}
              attachment={att}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default MessageAttachmentRenderer;
