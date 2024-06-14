import pool from "../db.js";
import jwt from "jsonwebtoken";
export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q = `SELECT p.*, u.id as userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
    LEFT JOIN relationships AS r ON (p.userID = r.followedUserId) WHERE r.followerUserId = $1 OR p.userId = $1 OREDR BY p.createdAT DESC
    `;

    pool.query(q, [userInfo.id], (error, results) => {
      if (error) throw error;
      res.status(200).json(results.rows);
    });
  });
};
