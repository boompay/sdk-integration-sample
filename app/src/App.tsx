import { useState } from "react";
import { View } from "./types";
import { BoomSDKView } from "./views/boom-sdk-view";
import { HomeView } from "./views/home-view";
import { PlaidView } from "./views/plaid-view";

function App() {
  // Ideally obtained from your backend
  const [token, setToken] = useState("");
  const [toPage, setToPage] = useState<string>("");
  const [awaitPlaidLink, setAwaitPlaidLink] = useState<boolean>(false);

  const [view, setView] = useState<View>(View.Home);

  if (view === View.Home)
    return <HomeView setView={setView} setToken={setToken} token={token} />;
  if (view === View.Plaid)
    return (
      <PlaidView
        onSuccess={() => {
          setAwaitPlaidLink(true);
          setView(View.SDK);
        }}
        token={token}
      />
    );

  return (
    <BoomSDKView
      setView={setView}
      token={token}
      toPage={toPage}
      setToPage={setToPage}
      awaitPlaidLink={awaitPlaidLink}
      setAwaitPlaidLink={setAwaitPlaidLink}
    />
  );
}

export default App;
