import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "8sdf67df78df7dfsd98f7dsa9";


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
    });

    res.json({ message, user });
  } catch (err) {
    res.status(400).json({ error});
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error});

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error});

  const token = jwt.sign({ id}, JWT_SECRET, { expiresIn});

  res.json({ message, token });
});

export { router };