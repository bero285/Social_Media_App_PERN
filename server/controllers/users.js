import pool from "../db.js";
import jwt from "jsonwebtoken";
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=$1";

  pool.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.rows[0]) {
      const { password, ...info } = data.rows[0];
      return res.json(info);
    } else {
      return res.status(404).json("User not found");
    }
  });
};
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q =
      "UPDATE users SET name=$1,city=$2,website=$3,profilePic=$4,coverPic=$5 WHERE id=$6";

    pool.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.rowCount > 0) {
          console.log("data effected here");
          return res.status(200).json("User has been updated");
        }
        return res.status(403).json("you can update only your user");
      }
    );
  });
};
