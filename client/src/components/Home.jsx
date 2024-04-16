import { useOutletContext } from 'react-router-dom';

const Home = () => {
  const [loggedIn] = useOutletContext();

  return <p>Hallo! Du bist {loggedIn ? '' : 'nicht'} eingeloggt.</p>;
};

export default Home;