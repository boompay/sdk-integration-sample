import axios from "axios";
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
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/plaid/create_link_token`,
          undefined,
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data)
        .then((data) => {
          setPlaidToken(data.link_token);
        });
    }
  }, [token]);

  const { open } = usePlaidLink({
    token: plaidToken,
    onSuccess: (...args) => {
      console.log(args);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/plaid/exchange_public_token`,
          {
            publicToken: args[0],
            // @ts-ignore -- it actually does have account
            accountId: args[1].account.id,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data)
        .then((res) => {
          // TODO: maybe handle something here
          onSuccess();
        })
        .catch((err) => {
          alert(
            "Failed to exchange public token. Error has been logged to console."
          );
          console.log(err);
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
