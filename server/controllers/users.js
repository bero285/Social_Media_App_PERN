import pool from "../db.js";

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
