import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { pool } from "../../config/db";

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
  console.log(email, password);

  const result = await pool.query(
    `
        SELECT * FROM users WHERE email = $1;
      `,
    [email]
  );

  const user = result.rows[0];

  console.log(user);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  console.log(isPasswordValid);

  const token = jwt.sign(
    {id: user.id ,name: user.name, email: user.email, role: user.role },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );

  const bearerToken = `Bearer ${token}`;

  return { token: bearerToken, user };
};
export const AuthService = {
  createUser,
  signInUser,
};
