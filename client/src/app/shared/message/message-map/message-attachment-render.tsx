import { Flex } from "@chakra-ui/react";
import type { Attachment } from "../../../../types/schema";

const MessageAttachmentRenderer = ({
  attachments,
}: {
  attachments: Attachment[];
}) => {
  // Get MediaAttachments
  const mediaAttachments = attachments.filter(
    (att) =>
      att.type === "audio" || att.type === "video" || att.type === "image",
  );

  const documentAttachments = attachments.filter(
    (att) => att.type === "document",
  );

  console.log({ mediaAttachments, documentAttachments });

  return (
    <Flex textAlign="center" minH="100px">
      Boom !! You've arrived at the attachment renderer. Watch an anime then
      come back to finish me. 😏😏😏😏
    </Flex>
  );
};

export default MessageAttachmentRenderer;
