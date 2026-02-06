import {
  Box,
  Flex,
  Float,
  FormatByte,
  IconButton,
  Image,
  LocaleProvider,
  Slider,
  Text,
} from "@chakra-ui/react";
import type { Attachment } from "../../../../types/schema";
import { generateCDN_URL } from "../../../../utils/generalFunctions";
import { forwardRef, useRef, useState, type ChangeEvent } from "react";
import { FaFileAudio, FaPause, FaPlay } from "react-icons/fa";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import { useTranslation } from "react-i18next";
import { AiOutlineLoading } from "react-icons/ai";
import { getDocumentIcon } from "../message-input-ui";
import { RiFullscreenExitLine, RiFullscreenFill } from "react-icons/ri";

import { HiDownload } from "react-icons/hi";
import MediaLoadErrorUI from "../media-load-error-ui";
import { Tooltip } from "@/components/ui/tooltip";

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

const VideoPlayerButton = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <Flex
      color="whiteAlpha.600"
      _hover={{
        color: "white",
      }}
      justifyContent="center"
      p="5px"
      alignItems="center"
      fontSize="22px"
      ref={ref}
      {...rest}
    >
      {children}
    </Flex>
  );
});

VideoPlayerButton.displayName = "VideoPlayerButton";

const ImageAttachment = ({
  attachment,
  displayAttachmentFullscreen,
}: {
  attachment: Extract<Attachment, { type: "image" }>;
  displayAttachmentFullscreen: (fileId: string) => void;
}) => {
  if (!attachment.filePath) return null;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadError, setisLoadError] = useState(false);

  const src = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  return (
    <Flex
      onClick={() => displayAttachmentFullscreen(attachment.fileId)}
      rounded="5px"
      overflow="hidden"
      className={isLoaded ? "" : "isLoading"}
      pos="relative"
    >
      {!isLoadError && (
        <Image
          onLoad={() => setIsLoaded(true)}
          style={{ visibility: isLoaded ? "visible" : "hidden" }}
          onError={() => setisLoadError(true)}
          src={src}
          h="full"
          w="full"
          objectFit="cover"
        />
      )}

      {!isLoaded && !isLoadError && (
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
      )}

      {isLoadError && <MediaLoadErrorUI />}
    </Flex>
  );
};

const VideoAttachment = ({
  attachment,
  openFullScreenText,
  isAlone,
  displayAttachmentFullscreen,
}: {
  attachment: Extract<Attachment, { type: "video" }>;
  openFullScreenText: string;
  isAlone: boolean;
  displayAttachmentFullscreen: (fileId: string) => void;
}) => {
  const url = getSource(
    attachment.filePath,
    attachment.previewUrl,
    attachment.mimeType,
  );

  const [videoDetails, setVideoDetails] = useState({
    duration: 0,
    currentTime: 0,
    isFinishedPlay: false,
    isPlaying: false,
    isMuted: false,
    isFullScreen: false,
    showControls: false,
    buttonFocused: false,
    isClicked: false,
    isLoaded: false,
    isLoadError: false,
  });

  const [showControlsTimer, setShowControlsTimer] = useState<number | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const volumeSliderRef = useRef<HTMLInputElement>(null);

  const isMobile = !window.matchMedia("(hover: hover)").matches;

  const handleToggleFullscreen = () => {
    const el = containerRef.current;

    if (!el) return;
    if (document.fullscreenElement) {
      setVideoDetails((p) => ({ ...p, isFullScreen: false }));
      document.exitFullscreen();
      return;
    }

    el.requestFullscreen().catch((e) =>
      console.log("Error enabling full screen: ", e.message),
    );
    setVideoDetails((p) => ({ ...p, isFullScreen: true }));
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
          if (volumeSliderRef.current) {
            volumeSliderRef.current.value = "100";
          }
        } else {
          videoRef.current.volume = 0.0;
          setVideoDetails((p) => ({ ...p, isMuted: true, volume: 0 }));
          if (volumeSliderRef.current) {
            volumeSliderRef.current.value = "0";
          }
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (isAlone) {
      setVideoDetails((p) => ({ ...p, showControls: false }));
    }
  };

  const handleMouseEnter = () => {
    if (isAlone) {
      if (showControlsTimer && typeof showControlsTimer === "number") {
        clearTimeout(showControlsTimer);
      }
      const timer = setTimeout(() => {
        setVideoDetails((p) => ({ ...p, showControls: false }));
      }, 4000);
      setVideoDetails((p) => ({ ...p, showControls: true }));
      setShowControlsTimer(timer);
    }
  };
  const handleTogglePlay = () => {
    if (isAlone) {
      if (videoRef.current) {
        handleMouseEnter();
        if (videoDetails.isPlaying) {
          videoRef.current.pause();
          setVideoDetails((p) => ({ ...p, isPlaying: false }));
        } else {
          videoRef.current.play();
          setVideoDetails((p) => ({ ...p, isPlaying: true }));
          if (!videoDetails.isClicked) {
            if (!videoDetails.isClicked) {
              setVideoDetails((p) => ({ ...p, isClicked: true }));
            }
          }
        }
      }
    } else {
      displayAttachmentFullscreen(attachment.fileId);
    }
  };

  return (
    <Flex
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTogglePlay}
      ref={containerRef}
      overflow="hidden"
      rounded="5px"
      pos="relative"
      data-video-container
      bg={
        videoDetails.isLoaded
          ? videoDetails.isFullScreen
            ? "gray.900"
            : "bg"
          : ""
      }
      className={videoDetails.isLoaded ? "" : "isLoading"}
    >
      {videoDetails.isLoadError ? (
        <MediaLoadErrorUI />
      ) : (
        <>
          <video
            onClick={handleTogglePlay}
            preload="metadata"
            style={{
              visibility: videoDetails.isLoaded ? "visible" : "hidden",
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              objectFit: isAlone
                ? videoDetails.isFullScreen
                  ? "contain"
                  : "cover"
                : "cover",
            }}
            onLoadedData={() => {
              setVideoDetails((p) => ({
                ...p,
                isLoaded: true,
                isLoadError: false,
              }));
            }}
            src={url}
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              setVideoDetails((p) => ({ ...p, duration }));
            }}
            onError={() =>
              setVideoDetails((p) => ({ ...p, isLoadError: true }))
            }
            onTimeUpdate={(e) => {
              const currentTime = e.currentTarget.currentTime;
              if (sliderRef.current) {
                sliderRef.current.value = currentTime.toString();
              }
            }}
            onEnded={() => {
              setVideoDetails((p) => ({
                ...p,
                currentTime: 0,
                isFinishedPlay: true,
                isPlaying: false,
              }));
              if (sliderRef.current) {
                sliderRef.current.value = "0";
              }
            }}
            ref={videoRef}
          />

          {videoDetails.isLoaded && isAlone && videoDetails.isClicked && (
            <Flex
              bg="blackAlpha.500"
              w="full"
              pos="absolute"
              transition="0.5s ease"
              bottom={videoDetails.showControls ? "0px" : "-50px"}
            >
              <VideoPlayerButton
                onClick={handleTogglePlay}
                style={{ fontSize: "18px" }}
              >
                {!videoDetails.isPlaying ? <FaPlay /> : <FaPause />}
              </VideoPlayerButton>

              <input
                ref={sliderRef}
                max={videoDetails.duration}
                defaultValue={videoDetails.currentTime}
                type="range"
                style={{ flex: 1 }}
              />

              {videoDetails.showControls && (
                <VideoPlayerButton
                  onFocus={(e) => {
                    e.stopPropagation();
                    setVideoDetails((p) => ({ ...p, buttonFocused: true }));
                  }}
                  onBlur={() => {
                    setVideoDetails((p) => ({ ...p, buttonFocused: false }));
                  }}
                  onClick={handleToggleMute}
                  style={{ position: "relative" }}
                  data-volume-change
                >
                  {!videoDetails.isMuted ? (
                    <HiSpeakerWave />
                  ) : (
                    <HiSpeakerXMark />
                  )}

                  <Flex
                    pos="absolute"
                    bottom="65px"
                    opacity={videoDetails.buttonFocused ? 100 : 0}
                    transform="rotate(-90deg)"
                    transformOrigin="center"
                    css={{
                      "[data-volume-change]:hover &": {
                        opacity: { lg: "100" },
                      },
                    }}
                    bg="gray.700"
                    px="2px"
                    rounded="10px"
                  >
                    <input
                      onClick={(e) => e.stopPropagation()}
                      ref={volumeSliderRef}
                      className="no-focus"
                      type="range"
                      style={{
                        height: "15px",
                        width: "75px",
                      }}
                      defaultValue={100}
                      onChange={(e) => {
                        const volume = Number(e.currentTarget.value);

                        setVideoDetails((p) => ({
                          ...p,
                          volume,
                          isMuted: volume === 0 ? true : false,
                        }));

                        if (videoRef.current) {
                          videoRef.current.volume = volume / 100;

                          if (volume === 0) {
                            videoRef.current.muted = true;
                          } else if (volume > 0) {
                            videoRef.current.muted = false;
                          }
                        }
                      }}
                      max={100}
                    />
                  </Flex>
                </VideoPlayerButton>
              )}

              {/*Full Screen Toggler */}
              {videoDetails.isFullScreen ? (
                <VideoPlayerButton onClick={handleToggleFullscreen}>
                  <RiFullscreenExitLine />
                </VideoPlayerButton>
              ) : (
                <Tooltip
                  positioning={{ placement: "top" }}
                  showArrow
                  contentProps={{
                    padding: "8px",
                    rounded: "lg",
                    border: "1px solid",
                    borderColor: "whiteAlpha.100",
                    css: {
                      "--tooltip-bg": "colors.gray.900",
                      color: "white",
                    },
                  }}
                  content={openFullScreenText}
                >
                  <VideoPlayerButton onClick={handleToggleFullscreen}>
                    <RiFullscreenFill />
                  </VideoPlayerButton>
                </Tooltip>
              )}
            </Flex>
          )}

          {videoDetails.isLoaded && !videoDetails.isPlaying && (
            <VideoPlayerButton
              onClick={handleTogglePlay}
              style={{
                background: "rgba(24, 23, 23, 0.89)",
                position: "absolute",
                padding: "10px",
                borderRadius: "100px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <FaPlay style={{ width: "20px", height: "20px" }} />
            </VideoPlayerButton>
          )}

          {!videoDetails.isLoaded && (
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
              <Flex
                animation="spin"
                alignItems="center"
                animationDuration="slower"
              >
                <AiOutlineLoading size={18} />
              </Flex>
            </Flex>
          )}
        </>
      )}
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

const DownloadButton = ({
  filePath,
  downloadText,
  mimeType,
  name,
}: {
  filePath: string;
  mimeType: string;
  downloadText: string;
  name: string;
}) => {
  const handleDownload = () => {
    if (!filePath || filePath === "") return;

    const downloadUrl = generateCDN_URL(filePath, mimeType, true);
    const url = downloadUrl;
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Float
      opacity={0}
      _groupHover={{
        opacity: 100,
      }}
      bg="bg"
      rounded="3px"
      p="1px"
    >
      <Tooltip
        showArrow
        positioning={{
          placement: "top",
        }}
        contentProps={{
          padding: "8px",
          boxShadow: "xs",
          css: { "--tooltip-bg": "colors.bg", color: "fg.muted" },
        }}
        content={downloadText}
      >
        <IconButton
          unstyled
          onClick={handleDownload}
          boxSize="30px"
          justifyContent="center"
          alignItems="center"
          rounded="3px"
          display="flex"
          _hover={{
            bg: "bg.muted",
          }}
          fontSize="18px"
        >
          <HiDownload />
        </IconButton>
      </Tooltip>
    </Float>
  );
};

const AudioAttachment = ({
  attachment,
  language,
  downloadText,
}: {
  attachment: Attachment;
  language: string;
  downloadText: string;
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
      pos="relative"
      className="group"
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
          onClick={(e) => e.stopPropagation()}
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

      {attachment.filePath && (
        <DownloadButton
          downloadText={downloadText}
          filePath={attachment.filePath}
          name={attachment.name}
          mimeType={attachment.mimeType}
        />
      )}
    </Flex>
  );
};

const DocumentAttachmnet = ({
  attachment,
  lang,
  downloadText,
}: {
  attachment: Extract<Attachment, { type: "document" }>;
  lang: string;
  downloadText: string;
}) => {
  const handleDownload = () => {
    if (!attachment.filePath) return;

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
      className="group"
      pos="relative"
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
          textAlign="left"
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

      {attachment.filePath && (
        <DownloadButton
          downloadText={downloadText}
          filePath={attachment.filePath}
          name={attachment.name}
          mimeType={attachment.mimeType}
        />
      )}
    </Flex>
  );
};

const MessageAttachmentRenderer = ({
  attachments,
  displayAttachmentFullscreen,
}: {
  attachments: Attachment[];
  displayAttachmentFullscreen: (fileId: string) => void;
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
  const downloadText = translate("downloadText");

  return (
    <Flex mb="5px" maxW={{ lg: "60%" }} textAlign="center">
      {Array.isArray(visualAttachments) && visualAttachments.length > 0 && (
        <Box w="full" className={`gallery count-${visualAttachments.length}`}>
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
                  isAlone={visualAttachments.length === 1}
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
              downloadText={downloadText}
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
              downloadText={downloadText}
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
