import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { makeRequest } from "../../axios";
export const Comments = ({ postId }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState("");
  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const handleComment = () => {
    mutation.mutate({ description: comments, postId: postId });
    setComments("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button onClick={handleComment}>send</button>
      </div>
      {data.map((comment, index) => {
        return (
          <div className="comment" key={index}>
            <img src={comment.profilePicture} alt="" className="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.description}</p>
            </div>
            <span className="date">{moment(comment.createdat).fromNow()}</span>
          </div>
        );
      })}
    </div>
  );
};
