import { Hono } from "hono";
import dropboxController from "../controllers/dropbox.controller";

const dropboxRoute = new Hono();

dropboxRoute.get("/authenticate", dropboxController.authenticate)
dropboxRoute.get("/callback", dropboxController.callback)
dropboxRoute.get("/refreshToken", dropboxController.refreshToken)
dropboxRoute.post("/generate-upload-url", dropboxController.generateUploadUrl)
dropboxRoute.post("/remove-file-from-dropbox", dropboxController.removeFileFromDropbox)
dropboxRoute.post("/generate-tmp-url", dropboxController.generateTemporaryLink)

export default dropboxRoute