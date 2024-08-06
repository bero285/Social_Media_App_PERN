import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Posts } from "../../components/posts/Posts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Update from "../../components/update/Update";

export const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const queryClient = useQueryClient();
  const { data: relationshipData, isPending: relationshipIsLoading } = useQuery(
    {
      queryKey: ["relationship", userId],
      queryFn: () =>
        makeRequest
          .get(`/relationship?followedUserId=${userId}`)
          .then((res) => res.data),
    }
  );
  const { isPending, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get(`/users/find/${userId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) {
        return makeRequest.delete(`/relationship?userId=${userId}`);
      } else {
        return makeRequest.post("/relationship", { userId: userId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship", userId] });
    },
  });
  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };
  if (isPending) return <h1>Loading...</h1>;

  return (
    <div className="profile">
      <div className="images">
        <img
          // src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          src={
            data.coverpic
              ? `/upload/${data?.coverpic}`
              : `/upload/default-cover.jpg`
          }
          alt=""
          className="cover"
        />
        <img
          // src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"

          src={
            data.coverpic ? `/upload/${data?.profilepic}` : `/upload/person.jpg`
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>

          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {relationshipIsLoading ? (
              "Loading"
            ) : userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData.includes(currentUser.id)
                  ? "unfollow"
                  : "follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};
