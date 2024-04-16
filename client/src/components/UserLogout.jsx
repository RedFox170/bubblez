import { useOutletContext } from 'react-router-dom';

const UserLogout = () => {
  const [, setLoggedIn] = useOutletContext();

  const logout = async () => {
    const response = await fetch('http://localhost:5500/logout', {
      method: 'POST',
      credentials: 'include',
      withCredentials: true
    });
    console.log(response);
    setLoggedIn(false);
  };
  return <button onClick={logout}>Log Out</button>;
};

export default UserLogout;