import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  console.log("aaaaaaaaaaaa");
  const q = "SELECT * FROM users WHERE username = $1";

  pool.query(q, [req.body.username], (error, results) => {
    if (error) res.status(500).json(err);
    if (results.rows.length == 0) return res.status(404).send(`User not found`);

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      results.rows[0].password
    );
    if (!checkPassword) return res.status(400).send("Wrong password");
    const token = jwt.sign({ id: results.rows[0].id }, "secretkey");
    const { password, ...others } = results.rows[0];
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};
export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      security: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out");
};
