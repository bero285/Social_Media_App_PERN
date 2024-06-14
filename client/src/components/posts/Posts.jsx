import { Post } from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
export const Posts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });
  console.log(data);
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  // const posts = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "lorem ipsum dolor sit amet consectetur.",
  //     img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
  //   },
  //   {
  //     id: 2,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600",
  //     desc: "lorem ipsum dolor sit amet consectetur.",
  //     img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
  //   },
  //   {
  //     id: 3,
  //     name: "John Doe",
  //     userId: 1,
  //     profilePic:
  //       "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600  ",
  //     desc: "lorem ipsum dolor sit amet consectetur.",
  //     img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
  //   },
  // ];
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
