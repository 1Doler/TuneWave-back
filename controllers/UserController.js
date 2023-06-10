import { param, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel.js";

export const register = async (req, res) => {
  try {
    //* Проверка на валидность
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const validationEmail = await UserModel.findOne({ email: req.body.email });
    if (validationEmail) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }
    //* Шифрование пароля
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //* Хранение данных пользователя
    const doc = new UserModel({
      email: req.body.email,
      firstName: req.body.firstName,
      secondName: req.body.secondName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    //* Создание пользователя
    const user = await doc.save();

    //* Создание токена в которой будет храниться _id
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "status",
      {
        expiresIn: "30d",
      }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });
    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }
    const token = jwt.sign({ _id: user._id }, "status", { expiresIn: "30d" });
    const { passwordHash, ...userData } = user._doc;
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 900000),
      httpOnly: false,
    });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, ...userData } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        ...userData,
      }
    );
    const { passwordHash, ...userInfo } = user;
    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messgae: "Не обновить данные",
    });
  }
};

export const allUsers = async (req, res) => {
  const user = await UserModel.find({});
  res.status(200).json({
    user,
  });
};
