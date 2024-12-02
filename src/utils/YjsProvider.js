import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const createYjsProvider = (roomId) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider("ws://localhost:80/yjs-websocket", roomId, ydoc);

  provider.on("status", (event) => {
    console.log(event.status); // connected/disconnected
  });

  return { ydoc, provider };
};
