import { useEffect, useState } from "react";
import "./update.scss";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
export default function Update({ setOpenUpdate, user }) {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [text, setText] = useState({
    name: "",
    city: "",
    website: "",
  });
  useEffect(() => {
    setText({
      name: user.name,
      city: user.city,
      website: user.website,
    });
  }, []);
  const handleChange = (e) => {
    const value = e.target.value;
    setText({
      ...text,
      [e.target.name]: value,
    });
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl = user.coverPic;
    let profileUrl = user.profilePic;
    coverUrl = cover ? await upload(cover) : user.coverpic;
    profileUrl = profile ? await upload(profile) : user.profilepic;
    mutation.mutate({ ...text, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };
  return (
    <div className="update">
      <h2>Update</h2>
      <form>
        <div className="inputContainer">
          <span>Cover Picture: </span>
          <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        </div>
        <div className="inputContainer">
          <span>Profile Picture: </span>
          <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        </div>
        <div className="inputContainer">
          <span>Name: </span>
          <input
            type="text"
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={text.name}
          />
        </div>
        <div className="inputContainer">
          <span>City: </span>
          <input
            type="text"
            name="city"
            onChange={handleChange}
            value={text.city}
          />
        </div>
        <div className="inputContainer">
          <span>Website: </span>
          <input
            type="text"
            name="website"
            onChange={handleChange}
            value={text.website}
          />
        </div>

        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}>Close</button>
    </div>
  );
}
