import pool from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRelationship = async (req, res) => {
  const q = `SELECT followerUserId FROM relationships WHERE followedUserId = $1`;
  pool.query(q, [req.query.followedUserId], (error, results) => {
    if (error) throw error;

    res
      .status(200)
      .json(results.rows.map((relationship) => relationship.followeruserid));
  });
};
export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q =
      "INSERT INTO relationships (followerUserId,followedUserId) VALUES ($1,$2)";
    const values = [userInfo.id, req.body.userId];
    pool.query(q, values, (error, results) => {
      if (error) throw error;
      res.status(200).json("following added");
    });
  });
};
export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Unauthenticated");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const q =
      "DELETE FROM relationships WHERE followerUserId = $1 AND followedUserId = $2";
    const values = [userInfo.id, req.query.userId];

    pool.query(q, values, (error, results) => {
      if (error) throw error;
      res.status(200).json("like has been deleted successfully");
    });
  });
};
