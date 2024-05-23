import { useEffect, useState } from "react";
import { PlaidEmbeddedLink, usePlaidLink } from "react-plaid-link";

export const PlaidView = ({
  onSuccess,
  token,
}: {
  onSuccess: () => void;
  token: string;
}) => {
  const [plaidToken, setPlaidToken] = useState<string | null>(null);

  // For local setup only
  const [xApiKey, setXApiKey] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      // for local setup only
      fetch(`${process.env.REACT_APP_API_URL}/v1/auth/via_link`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json().then((data) => {
            return [data.id, res.headers?.get("x-api-key")];
          });
        })
        .then(([id, xApiKey]) => {
          setXApiKey(xApiKey);
          setCustomerId(id);

          //   post<{
          // link_token: string;
          //   }>("/v1/plaid/tokens/link"),
          return fetch(
            `${process.env.REACT_APP_API_URL}/v1/plaid/tokens/link`,
            {
              method: "POST",
              body: JSON.stringify({ customerId: id }),
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + xApiKey,
              },
            }
          ).then((res) => {
            return res.json().then((data) => {
              setPlaidToken(data.link_token);
            });
          });
        });
    }
  }, [token]);

  const { open } = usePlaidLink({
    token: plaidToken,
    onSuccess: (...args) => {
      fetch(`${process.env.REACT_APP_API_URL}/v1/plaid/tokens/exchange`, {
        method: "POST",
        body: JSON.stringify({
          ...args[1],
          customer_token: customerId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + xApiKey,
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
