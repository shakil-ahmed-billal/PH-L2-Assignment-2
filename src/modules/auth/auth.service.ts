import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config/config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);
  console.log(hashedPass);

  const result = await pool.query(
    `
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `,
    [name, email, hashedPass, phone, role]
  );

  return result.rows[0];
};

const signInUser = async (email: string, password: string) => {

    const result = await pool.query(
      `
        SELECT * FROM users WHERE email = $1;
      `,
      [email]
    );
  
    const user = result.rows[0];
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt_secret as string,
      { expiresIn: "1h" }
    );

    return {user, token};
};
export const AuthService = {
  createUser,
  signInUser,
};
