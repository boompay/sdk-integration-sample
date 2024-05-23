export const CreateCustomerView = ({
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
        };

        fetch(`${process.env.REACT_APP_API_URL}/partner/v1/authenticate`, {
          body: JSON.stringify({
            access_key: data.access_key,
            secret_key: data.secret_key,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.auth_token) {
              return fetch(
                `${process.env.REACT_APP_API_URL}/partner/v1/customers`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${res.auth_token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    ssn: data.ssn,
                    dob: data.dob,
                  }),
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  onSuccess(res.access_key);
                });
            }
          });
      }}
      id="create-customer-form"
    >
      {/* access key */}
      <div className="form-group">
        <label htmlFor="access_key">Access Key</label>
        <input
          type="text"
          required
          className="form-control"
          id="access_key"
          name="access_key"
          placeholder="Access Key"
        />
      </div>

      {/* Secret */}
      <div className="form-group">
        <label htmlFor="secret_key">Secret</label>
        <input
          type="password"
          required
          className="form-control"
          id="secret_key"
          name="secret_key"
          placeholder="Secret"
        />
      </div>

      {/* firstName input */}
      <div className="form-group">
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          className="form-control"
          required
          id="first_name"
          name="first_name"
          placeholder="First Name"
        />
      </div>

      {/* lastName input */}
      <div className="form-group">
        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          className="form-control"
          required
          id="last_name"
          name="last_name"
          placeholder="Last Name"
        />
      </div>

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

      {/* phoneNumber input */}
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          id="phone"
          name="phone"
          required
          maxLength={10}
          minLength={10}
          placeholder="Phone Number"
        />
      </div>

      {/* ssn input */}
      <div className="form-group">
        <label htmlFor="ssn">SSN</label>
        <input
          type="text"
          className="form-control"
          id="ssn"
          name="ssn"
          placeholder="SSN"
          maxLength={9}
          minLength={9}
        />
      </div>

      {/* dob input */}
      <div className="form-group">
        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          className="form-control"
          id="dob"
          name="dob"
          placeholder="Date of Birth"
        />
      </div>

      {/* Submit*/}
      <button
        type="submit"
        form="create-customer-form"
        className="btn btn-primary mt-2"
      >
        Create Customer
      </button>
    </form>
  );
};
