// vlt. auslagern in extra datei
export const inputStyle = "w-full border-2 rounded focus:outline-none text-black"

export const buttonStyle = "bg-green-200  text-slate-700 p-2 rounded w-full dark:text-slate-600 mt-2  font-light hover:font-medium"

const UserRegister = () => {
  const submitHandler = async (event) => {
    event.preventDefault();
    const el = event.target.elements;
    const body = {
      firstName: el.firstName.value,
      lastName: el.lastName.value,
      email: el.email.value,
      password: el.password.value,
      username: el.username.value,
      plz: parseInt(el.plz.value),
    };
    const response = await fetch("http://localhost:5500/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);
    event.target.reset();
  };
  return (
    <form 
      className="h-96 flex flex-col justify-center gap-2 bg-white dark:bg-slate-800    ring-slate-900/5  "
      onSubmit={submitHandler}
    >
      <div className="p-3 bg-slate-500/15 shadow-lg rounded  ">
        <div>
          <label htmlFor="firstName" className="border-b-2 ">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            className={inputStyle}
          />
        </div>
        <div className="pt-3">
          <label htmlFor="lastName" className="border-b-2 w-80">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            className={inputStyle}
          />
        </div>
        <div className="pt-3">
          <label htmlFor="username" className="border-b-2 w-80">
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className={inputStyle}
          />
        </div>
        <div className="pt-3">
          <label htmlFor="plz" className="border-b-2 w-80">
            PLZ.:
          </label>
          <input
            type="text"
            name="plz"
            id="plz"
            className={inputStyle}
          />
        </div>
        <div className="pt-3">
          <label htmlFor="email" className="border-b-2 w-80">
            E-Mail:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={inputStyle}
          />
        </div>
       {/*  <div className="w-full">
          <label htmlFor="email" className="border-b-2">
            E-Mail:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className=" border-2 rounded focus:outline-none text-black"
          />
        </div> */}
        <div className="pt-3">
          <label htmlFor="password" className="border-b-2 w-80">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className= {inputStyle}
          />
        </div>
      </div>
      <button className= {buttonStyle}>
        Submit
      </button>
    </form>
  );
};

export default UserRegister;
