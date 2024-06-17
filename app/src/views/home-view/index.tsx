import { useEffect, useState } from "react";
import { View } from "../../types";
import { CreateCustomerView } from "./create-customer-view";
import { LoginCustomerView } from "./login-customer-view";
import axios from "axios";

export const HomeView = ({
  setView,
  setToken,
  token,
}: {
  setView: React.Dispatch<React.SetStateAction<View>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  token: string;
}) => {
  const [userStatus, setUserStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  const fetchUser = () => {
    setUserStatus("loading");
    return axios
      .get(process.env.REACT_APP_API_URL + "/me", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data) {
          setUserStatus("success");
          setToken(data.BoomIntegration?.authToken);
        }
      })
      .catch((err) => {
        console.log(err);
        setUserStatus("error");
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (userStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (userStatus === "error") {
    return (
      <div
        style={{
          padding: "20px",
          height: "100vh",
        }}
      >
        <div>
          <h1>Welcome to boom SDK playground</h1>

          <p>
            <a
              href="https://docs.boompay.app/api-reference"
              target="_blank"
              rel="noreferrer"
            >
              SDK Documentation
            </a>
          </p>
          <div className="row gap-3 container">
            <div className="col card gap-sm">
              <h2>Create a customer</h2>
              <CreateCustomerView
                onSuccess={(accessKey) => {
                  fetchUser();
                }}
              />
            </div>

            <div className="col card">
              <h2>or Login </h2>
              <LoginCustomerView
                onSuccess={(accessKey) => {
                  if (accessKey) {
                    setToken(accessKey);
                    setView(View.SDK);
                  }
                  fetchUser();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 row gap-3 container-sm">
      <button
        className="btn btn-danger mt-2"
        onClick={() => {
          axios
            .post(
              process.env.REACT_APP_API_URL + "/logout",
              {},
              {
                withCredentials: true,
              }
            )
            .then(() => {
              setToken("");
              fetchUser();
              setView(View.Home);
            });
        }}
      >
        Logout
      </button>

      <button
        className="btn btn-primary mt-2"
        onClick={() => {
          if (token) {
            setView(View.SDK);
          } else {
            axios
              .post(
                `${process.env.REACT_APP_API_URL}/boom/create_boom_link_token`,
                {},
                {
                  withCredentials: true,
                }
              )
              .then((res) => res.data)
              .then((res) => {
                setToken(res);
                setView(View.SDK);
              });
          }

          setView(View.SDK);
        }}
      >
        {token ? "Continue SDK" : "Start SDK"}
      </button>
    </div>
  );
};
