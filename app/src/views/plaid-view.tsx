import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export const PlaidView = ({
  onSuccess,
  token,
}: {
  onSuccess: () => void;
  token: string;
}) => {
  const [plaidToken, setPlaidToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      // for local setup only
      fetch(`${process.env.REACT_APP_API_URL}/plaid/create_link_token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPlaidToken(data.link_token);
        });
    }
  }, [token]);

  const { open } = usePlaidLink({
    token: plaidToken,
    onSuccess: (...args) => {
      fetch(`${process.env.REACT_APP_API_URL}/plaid/exchange_public_token`, {
        method: "POST",
        body: JSON.stringify({
          publicToken: args[1].link_session_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // TODO: maybe handle something here
          onSuccess();
        });
    },
  });

  if (plaidToken) {
    return (
      <button
        type="button"
        onClick={() => {
          open();
        }}
        className="btn btn-primary"
      >
        Open plaid
      </button>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
      }}
    >
      <div>
        <h1>Plaid Link Handoff</h1>
      </div>
    </div>
  );
};
