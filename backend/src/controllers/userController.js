import User from "../models/User.js";

const createUser = async (req, res, next) => {
  try {
    const { username, password, role, isActive } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }

    const existingUser = await User.findOne({ username: username.trim() });

    if (existingUser) {
      res.status(409);
      throw new Error("Username already exists");
    }

    const user = await User.create({
      username: username.trim(),
      password,
      role,
      isActive,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { username, password, role, isActive } = req.body;

    if (username && username.trim() !== user.username) {
      const existingUser = await User.findOne({ username: username.trim() });

      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        res.status(409);
        throw new Error("Username already exists");
      }

      user.username = username.trim();
    }

    if (password) {
      user.password = password;
    }

    if (role) {
      user.role = role;
    }

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
