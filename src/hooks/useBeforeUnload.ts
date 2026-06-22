import { useEffect } from "react";

const DEFAULT_BEFORE_UNLOAD_MESSAGE = "Your changes may not be saved.";

const useBeforeUnload = (enabled: boolean, message = DEFAULT_BEFORE_UNLOAD_MESSAGE) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, message]);
};

export default useBeforeUnload;
