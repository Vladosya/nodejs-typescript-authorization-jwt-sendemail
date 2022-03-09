import express from "express";
import { body } from "express-validator";

import UserController from "../controllers/user-controller";
import AuthMiddleware from "../middleware/auth-middleware";

const router: express.Router = express.Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  UserController.registration,
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  UserController.login,
);

router.post("/logout", UserController.logout);

router.get("/activate/:link", UserController.activate);

router.get("/refresh", UserController.refresh);

router.get("/users", AuthMiddleware, UserController.getUsers);

export default router;
