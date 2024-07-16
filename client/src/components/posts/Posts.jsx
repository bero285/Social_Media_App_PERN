import { Post } from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
export const Posts = ({ userId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get(`/posts?userId=${userId}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="posts">
      {error
        ? "something went wromg"
        : isPending
        ? "...Loading"
        : data.map((post) => {
            return <Post post={post} key={post.id} />;
          })}
    </div>
  );
};
