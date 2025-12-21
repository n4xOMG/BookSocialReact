import { useState, useEffect } from "react";
import { apiEvents } from "../api/api";

/**
 * Custom hook for handling account restriction alerts (banned/suspended)
 * Listens to API account restriction events and manages alert state
 */
export const useAccountRestrictionAlert = () => {
  const [accountRestrictionAlert, setAccountRestrictionAlert] = useState({
    open: false,
    message: "",
    isBanned: false,
    isSuspended: false,
  });

  useEffect(() => {
    const handleAccountRestriction = (data) => {
      setAccountRestrictionAlert({
        open: true,
        message: data.message,
        isBanned: data.isBanned,
        isSuspended: data.isSuspended,
      });
    };

    apiEvents.on("accountRestricted", handleAccountRestriction);

    return () => {
      apiEvents.off("accountRestricted", handleAccountRestriction);
    };
  }, []);

  const handleClose = () => {
    setAccountRestrictionAlert((prev) => ({
      ...prev,
      open: false,
    }));
    // Redirect to sign-in after closing
    if (window.location.pathname !== "/sign-in") {
      window.location.href = "/sign-in";
    }
  };

  return {
    accountRestrictionAlert,
    handleCloseAccountRestrictionAlert: handleClose,
  };
};
