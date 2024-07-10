import pool from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLikes = async (req, res) => {
  const q = `SELECT userId FROM likes WHERE postId = $1`;
  pool.query(q, [req.query.postId], (error, results) => {
    if (error) throw error;

    res.status(200).json(results.rows.map((like) => like.userid));
  });
};
export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q = "INSERT INTO likes (postId,userId) VALUES ($1,$2)";
    const values = [req.body.postId, userInfo.id];

    pool.query(q, values, (error, results) => {
      if (error) throw error;
      res.status(200).json("like has been created successfully");
    });
  });
};
export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q = "DELETE FROM likes WHERE userId = $1 AND postId = $2";
    const values = [userInfo.id, req.query.postId];

    pool.query(q, values, (error, results) => {
      if (error) throw error;
      res.status(200).json("like has been deleted successfully");
    });
  });
};
