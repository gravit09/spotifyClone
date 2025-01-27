import zod from "zod";
import { User } from "../models/user.models.js";

const userSchema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

const userSignUpHandler = async (req, res) => {
  const userData = req.body;
  const isValidData = userSchema.safeParse(userData);
  if (!isValidData.success) {
    return res
      .status(401)
      .json({ error: "Invalid data sent", details: isValidData.error.errors });
  }
  const isUserExsist = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.email }],
  });

  if (isUserExsist) {
    return res
      .status(400)
      .json({ error: "User With this credentials already exsist" });
  }
  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    return res
      .status(400)
      .json({ error: "Something went wrong while creating user" });
  }
  return res.status(200).json({
    message: "User created Succesfully",
    success: true,
    createdUser,
  });
};

const loginUserHandler = async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.status(200).json({
      success: false,
      message: "Invalid email",
    });
  }

  const isPassValid = await checkUser.isPasswordCorrect(password);

  if (!isPassValid) {
    return res.status(200).json({
      success: false,
      message: "invalid pass",
    });
  }

  const token = await checkUser.generateJWT(checkUser._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).cookie("AccessToken", token, options).json({
    success: true,
    role: checkUser.role,
    message: "User logged in",
    token,
  });
};

const isAllowed = async (req, res) => {
  const { role } = req;
  if (role !== "admin") {
    return res.status(200).json({
      message: "valid",
      role: false,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "valid",
      role: true,
      success: true,
    });
  }
};

const adminMiddleWare = async (req, res, next) => {
  const { role } = req;
  if (role !== "admin") {
    res.status(402).json({
      message: "Unauthorised admin route access",
    });
    return;
  } else {
    next();
  }
};

export { userSignUpHandler, loginUserHandler, isAllowed, adminMiddleWare };
