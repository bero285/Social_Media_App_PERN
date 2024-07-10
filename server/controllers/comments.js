import pool from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  const q = `SELECT c.*, u.id as userId,name,profilePic FROM comments AS c JOIN users AS u ON (u.id = c.commentUserId) 
  WHERE c.postId = $1 ORDER BY c.createdAt DESC
    `;
  pool.query(q, [req.query.postId], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q =
      "INSERT INTO comments (description,createdAt,commentUserId,postId) VALUES ($1,$2,$3,$4)";
    const values = [
      req.body.description,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];

    pool.query(q, values, (error, results) => {
      // if (error) return res.status(500).json("Server error");
      if (error) throw error;
      res.status(200).json("comment has been created successfully");
    });
  });
};
