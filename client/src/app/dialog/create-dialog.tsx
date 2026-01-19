import { CloseButton, createOverlay, Dialog, Portal } from "@chakra-ui/react";

interface DialogProps {
  title: string;
  description?: string;
  content?: React.ReactNode;
}

export const createDialog = createOverlay<DialogProps>((props) => {
  const { title, description, content, ...rest } = props;
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Positioner boxShadow="md" >
          <Dialog.Content >
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>

                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Header>
            )}
            <Dialog.Body spaceY="4">
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
              {content}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
