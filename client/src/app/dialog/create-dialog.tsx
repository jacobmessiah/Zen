import {
  Button,
  CloseButton,
  createOverlay,
  Dialog,
  Portal,
} from "@chakra-ui/react";

interface DialogProps {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  placement?: "center" | "top" | "bottom";
  showBackDrop?: boolean;
  contentWidth?: string;
  contentHeight?: string;
  bodyPadding?: string;
  showCloseButton?: boolean;
  closeButtonText?: string;
}

export const createDialog = createOverlay<DialogProps>((props) => {
  const {
    title,
    description,
    content,
    placement = "center",
    showBackDrop = false,
    contentWidth = "",
    contentHeight = "",
    bodyPadding = "10px",
    showCloseButton = true,
    closeButtonText,
    ...rest
  } = props;
  return (
    <Dialog.Root unmountOnExit lazyMount placement={placement} {...rest}>
      <Portal>
        {showBackDrop && <Dialog.Backdrop />}
        <Dialog.Positioner boxShadow="md">
          <Dialog.Content
            userSelect="none"
            h={contentHeight}
            width={contentWidth}
          >
            {title && (
              <Dialog.Header bg="red">
                <Dialog.Title>{title}</Dialog.Title>

                <Dialog.CloseTrigger asChild>
                  <CloseButton focusRing="none" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
            )}

            {showCloseButton && !title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>

                <Dialog.CloseTrigger asChild>
                  <CloseButton focusRing="none" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
            )}
            <Dialog.Body p={bodyPadding}>
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
              {content}
            </Dialog.Body>

            {showCloseButton && closeButtonText && (
              <Dialog.Footer justifyContent="center">
                <Dialog.ActionTrigger asChild>
                  <Button rounded="md" w="80%">
                    {closeButtonText}
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
