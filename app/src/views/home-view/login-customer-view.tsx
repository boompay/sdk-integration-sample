import axios from "axios";

export const LoginCustomerView = ({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) => {
  return (
    <form
      className="container mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        // @ts-ignore
        const data = Array.from(new FormData(e.target).entries()).reduce(
          (acc: Record<string, unknown>, [key, value]: [string, unknown]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, unknown>
        ) as {
          access_key: string;
          secret_key: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          ssn: string;
          dob: string;
          password: string;
        };

        axios
          .post(
            `${process.env.REACT_APP_API_URL}/login`,
            {
              email: data.email,
              password: data.password,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => res.data)
          .then((res) => {
            onSuccess(res.access_key);
          });
      }}
      id="login-customer-form"
    >
      {/* email input */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          required
          id="email"
          name="email"
          placeholder="Email"
        />
      </div>

      {/* password input */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          required
          placeholder="Password"
        />
      </div>

      {/* Submit*/}
      <button
        type="submit"
        form="login-customer-form"
        className="btn btn-primary mt-2"
      >
        Login
      </button>
    </form>
  );
};
