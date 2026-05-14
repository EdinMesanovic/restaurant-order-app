import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user || !user.isActive || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    res.status(200).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || !user.isActive) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { loginUser, getCurrentUser };
