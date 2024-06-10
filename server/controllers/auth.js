import pool from "../db.js";
import bcrypt from "bcryptjs";
export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE username = $1";
  pool.query(q, [req.body.username], (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rows.length)
      return res.status(409).send(`User already exists `);
    //   create new user
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const q =
      "INSERT INTO users (username,email,password,name) VALUES ($1,$2,$3,$4)";
    let values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    pool.query(q, values, (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(200).send(`User created successfully`);
    });
  });
};
export const login = (req, res) => {
  res.send("login");
};
export const logout = (req, res) => {
  res.send("logout");
};
