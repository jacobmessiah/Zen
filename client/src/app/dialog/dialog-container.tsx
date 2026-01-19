import { AnimatePresence, motion as Motion } from "framer-motion";
import { lazy, Suspense } from "react";
import type { userDialogType } from "../../store/user-dialog-store";
import userDialogStore from "../../store/user-dialog-store";

const FileLimitUI = lazy(() => import("./ui/file-limit-modal"));
const InvalidFileUI = lazy(() => import("./ui/invalid-file-modal"));

const DialogContainer = ({
  showDialogOf,
}: {
  showDialogOf: userDialogType["showDialogOf"];
}) => {
  const removeDailog = (arg: userDialogType["showDialogOf"]) => {
    userDialogStore.setState({ showDialogOf: arg });
  };

  function renderDialog(showDialogOf: userDialogType["showDialogOf"]) {
    switch (showDialogOf) {
      case "fileLimit":
        return <FileLimitUI removeDialog={removeDailog} />;

      case "invalidFile":
        return <InvalidFileUI removeDialog={removeDailog} />;

      default:
        return null;
    }
  }

  const isOpen = showDialogOf !== "";

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Suspense fallback={null}>
          <Motion.div
            onClick={() => userDialogStore.setState({ showDialogOf: "" })}
            key={showDialogOf}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              zIndex: 999
            }}
          >
            {renderDialog(showDialogOf)}
          </Motion.div>
        </Suspense>
      )}
    </AnimatePresence>
  );
};

export default DialogContainer;
