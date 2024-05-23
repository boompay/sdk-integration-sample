import { useEffect } from "react";
import { EmittedEvent, View } from "../types";

const root = process.env.REACT_APP_BOOM_SDK_URL || "";

export const BoomSDKView = ({
  setView,
  token,
  toPage,
}: {
  setView: React.Dispatch<React.SetStateAction<View>>;
  token: string;
  toPage: string;
}) => {
  useEffect(() => {
    const listener = (event: MessageEvent<string>) => {
      if (event.origin === root) {
        const data = (
          typeof event.data === "string" ? JSON.parse(event.data) : event.data
        ) as EmittedEvent;

        // Handle events from SDK
        if (data?.action) {
          switch (data.action) {
            // Handle close event
            // Triggered when user closes iframe
            case "close":
              setView(View.Home);
              break;
            // Handle auth error
            // Triggered when token in url is invalid
            case "auth-error":
              // This is optional
              // setView(View.Home);
              break;
            // Handle plaid link handoff
            // If integrate is enabled, this event is triggered
            case "plaid_link_handoff":
              setView(View.Plaid);
              break;
            // Analytics events
            // Pageviews, clicks
            default:
              console.log(event.data);
          }
        }
      }
    };

    window.addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return (
    <div className="position-absolute top-0 end-0 bottom-0 start-0">
      <iframe
        title="Boom SDK"
        height="100%"
        width="100%"
        allow="fullscreen; clipboard-write *"
        src={`${root}${toPage || "/"}?token=${token}&has_close=true`}
      />
    </div>
  );
};
