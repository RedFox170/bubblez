import PostCard from "./PostCard";

const PostList = ({ posts }) => {
  return (
    <div className="w-full">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
