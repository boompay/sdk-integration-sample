import { View } from "../../types";
import { CreateCustomerView } from "./create-customer-view";

export const HomeView = ({
  setView,
  setToken,
  token,
}: {
  setView: React.Dispatch<React.SetStateAction<View>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  token: string;
}) => {
  return (
    <div
      style={{
        padding: "20px",
        height: "100vh",
      }}
    >
      <div>
        <h1>Boom SDK playground </h1>

        <p>
          <a
            href="https://docs.boompay.app/api-reference"
            target="_blank"
            rel="noreferrer"
          >
            SDK Documentation
          </a>
        </p>
        <CreateCustomerView
          onSuccess={(accessKey) => {
            setToken(accessKey);
            setView(View.SDK);
          }}
        />
        <p>
          This is a playground to test the Boom SDK. Enter the token you
          received from your backend to open the SDK or create a customer above
        </p>
        <input
          className="form-control"
          type="text"
          value={token}
          placeholder="Token"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
        <br />
        <button
          className="btn btn-primary mt-2"
          onClick={() => {
            setView(View.SDK);
          }}
        >
          Open SDK
        </button>
      </div>
    </div>
  );
};
