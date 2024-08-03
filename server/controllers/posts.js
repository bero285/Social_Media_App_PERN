import pool from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";
export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  const userId = req.query.userId;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    let q;

    if (userId && userId !== "undefined") {
      q = `SELECT p.*, u.id as userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = $1 ORDER BY p.createdAt DESC
    
      `;
      pool.query(q, [userId], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
      });
    } else {
      q = `SELECT p.*, u.id as userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      LEFT JOIN relationships AS r ON (p.userID = r.followedUserId) WHERE r.followerUserId = $1 OR p.userId = $1 ORDER BY p.createdAt DESC
      `;
      pool.query(q, [userInfo.id], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
      });
    }
  });
};
export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q =
      "INSERT INTO posts (description,img,userId,createdAt) VALUES ($1,$2,$3,$4)";
    const values = [
      req.body.description,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    pool.query(q, values, (error, results) => {
      if (error) return res.status(500).json("Server error");
      res.status(200).json("Post has been created successfully");
    });
  });
};

export const deletePost = (req, res) => {
  console.log("here");
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q = "DELETE FROM posts WHERE id=$1 AND userId=$2";

    pool.query(q, [req.query.postId, userInfo.id], (error, results) => {
      console.log(req.query.postId);
      if (error) return res.status(500).json("Server error");
      if (results.rowCount > 0) {
        return res.status(200).json("Post has been deleted successfully");
      }
      return res.status(403).json("You can delete only your post");
    });
  });
};
