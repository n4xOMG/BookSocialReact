import { useEffect, useState, useRef } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "@liveblocks/react";
import * as Y from "yjs";

/**
 * Custom hook for Yjs integration with Liveblocks
 * @param {Object} initialContent - Initial content for the document
 * @returns {Object} - Yjs provider, shared type, and connection status
 */
export const useYjs = (initialContent) => {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState(null);
  const [provider, setProvider] = useState(null);
  const yDocRef = useRef(null);

  useEffect(() => {
    if (!room || !initialContent) return;

    console.log("Initializing Yjs with content:", initialContent);

    // Create a new Y.Doc for this collaboration session
    const yDoc = new Y.Doc();
    yDocRef.current = yDoc;

    // Create the shared document
    const sharedDoc = yDoc.get("slate", Y.XmlText);

    // Create the Liveblocks <-> Yjs provider
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    // Listen for sync events
    const handleSync = (isSynced) => {
      console.log("Yjs sync status:", isSynced);
      setConnected(isSynced);
    };

    const handleStatus = (status) => {
      console.log("Yjs provider status:", status);
    };

    yProvider.on("sync", handleSync);
    yProvider.on("status", handleStatus);

    // Store shared type and provider
    setSharedType(sharedDoc);
    setProvider(yProvider);

    return () => {
      console.log("Cleaning up Yjs provider and document");

      // Remove event listeners
      yProvider.off("sync", handleSync);
      yProvider.off("status", handleStatus);

      // Cleanup provider
      if (yProvider && typeof yProvider.destroy === "function") {
        try {
          yProvider.destroy();
        } catch (e) {
          console.warn("Error destroying yProvider:", e);
        }
      }

      // Cleanup document
      if (yDoc && typeof yDoc.destroy === "function") {
        try {
          yDoc.destroy();
        } catch (e) {
          console.warn("Error destroying yDoc:", e);
        }
      }

      // Reset state
      setConnected(false);
      setSharedType(null);
      setProvider(null);
      yDocRef.current = null;
    };
  }, [room, initialContent]);

  return {
    provider,
    sharedType,
    connected,
    yDoc: yDocRef.current,
  };
};
