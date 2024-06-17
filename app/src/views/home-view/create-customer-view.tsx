import axios from "axios";

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
          password: string;
        };

        axios
          .post(
            `${process.env.REACT_APP_API_URL}/users`,
            {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              phone: data.phone,
              ssn: data.ssn,
              dob: data.dob,
              password: data.password,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => res.data)
          .then((res) => {
            onSuccess(res.BoomIntegration?.authToken);
          });
      }}
      id="create-customer-form"
    >
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
        form="create-customer-form"
        className="btn btn-primary mt-2"
      >
        Create Customer
      </button>
    </form>
  );
};
