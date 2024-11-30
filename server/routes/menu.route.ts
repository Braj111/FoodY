import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";
import { addMenu, editMenu } from "../controller/menu.controller";
 

const router = express.Router();

router.route("/").post(isAuthenticated as any, upload.single("image") as any, addMenu as any);
router.route("/:id").put(isAuthenticated as any, upload.single("image") as any, editMenu as any);

export default router;
 