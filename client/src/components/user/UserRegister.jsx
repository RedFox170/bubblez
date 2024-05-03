import "../reuseable/styles/reusableFormComponents.css";
import "../reuseable/styles/reusableGlobal.css";

const UserRegister = () => {
  const submitHandler = async (event) => {
    console.log("submitHandler Btn in userRegister löst aus");
    event.preventDefault();
    const el = event.target.elements;

    const body = {
      userName: el.userName.value,
      email: el.email.value,
      password: el.password.value,
      confirmPassword: el.confirmPassword.value,
    };
    console.log(body);

    // Passwort überprüfung
    if (body.password !== body.confirmPassword) {
      console.error("Passwords do not match!");

      return; // abbrechen, wenn die Passwörter nicht übereinstimmen
    }

    try {
      const response = await fetch("http://localhost:5500/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        event.target.reset(); // Zurücksetzen des Formulars bei erfolgreicher Registrierung
      } else {
        const error = await response.text();
        console.error("Registration failed:", error);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <section className="flex  justify-center items-center mt-32 w-full">
      <div className="reusableGlobalBackground absolute"></div>
      <div className="reusableGlobalBackground absolute"></div>
      <div className="reusableGlobalBackground absolute"></div>
      <div className="relative">
        <div className="reusableSquare absolute" style={{ "--i": 0 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 1 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 2 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 3 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 4 }}></div>
        <div className="reusableContainer reusableBorder mt-12 shadow-md">
          <form className="reusableForm" onSubmit={submitHandler}>
            <div>
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-800"
                >
                  User Name:
                </label>
                <input
                  type="text"
                  name="userName"
                  id="userName"
                  className="reusableInput mt-1  p-2 text-gray-800 block w-full border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="pt-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800"
                >
                  E-Mail:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="reusableInput mt-1  p-2 text-gray-800 block w-full border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="pt-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800"
                >
                  Passwort:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="reusableInput mt-1  p-2 text-gray-800 block w-full border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="pt-3">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-800"
                >
                  Passwort bestätigen:
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="reusableInput mt-1  p-2 text-gray-800 block w-full border-gray-500 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button className="reusableFormBtn ">Abschicken</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserRegister;
