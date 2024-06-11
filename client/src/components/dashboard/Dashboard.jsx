import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/getUserData`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userRes.json();
        setUserData(userData);

        const feedRes = await fetch(`${API_URL}/feed`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!feedRes.ok) {
          throw new Error("Failed to fetch feed");
        }

        const feedData = await feedRes.json();
        console.log("Fetched posts:", feedData);

        // Verhindern doppelter Einträge
        /*  Ein Set ist eine Sammlung von Werten, bei der jeder Wert nur einmal vorkommen kann. Durch die Übergabe des Arrays mit den IDs an new Set([...]) werden doppelte IDs entfernt */
        const uniquePosts = Array.from(
          new Set(feedData.map((post) => post._id))
        ).map((id) => {
          return feedData.find((post) => post._id === id);
        });

        setPosts(uniquePosts);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    return <p>Failed to load user data.</p>;
  }

  return (
    <section className="relative mt-20 flex flex-col min-h-screen">
      <div className="reusableBlur w-full h-full overflow-auto min-h-screen">
        <div className="mx-auto flex flex-col items-center w-full max-w-4xl">
          <div className="reusableContainer w-full p-4">
            <PostForm setPosts={setPosts} user={userData} />
          </div>
          <PostList posts={posts} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
