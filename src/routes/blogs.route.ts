import { Hono } from "hono";
import blogController from "../controllers/blog.controller";

const blogRoute = new Hono();

blogRoute.get("/", blogController.getAllBlogs)
blogRoute.get("/:slug", blogController.getOneBySlug )
blogRoute.post("/", blogController.createBlog)
blogRoute.delete("/:id", blogController.deleteBlogById)

export default blogRoute