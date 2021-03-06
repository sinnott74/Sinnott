import { Router } from "express";
import { BlogPost } from "../entity";
import Auth from "../core/Auth";
const router = Router();

router.get("/", async function(req, res) {
  const blogPosts = await BlogPost.listBlogPostDetails();
  res.json(blogPosts);
});

router.get("/:id", async function(req, res) {
  const id = req.params.id;
  const blogPost = await BlogPost.getBlogPostDetails(id);
  res.json(blogPost);
});

router.post("/", Auth.middleware, async function(req, res) {
  const blogpostData = { ...req.body };
  const blogPost = new BlogPost(blogpostData);
  await blogPost.save();
  res.json(blogPost);
});

router.put("/:id", Auth.middleware, async function(req, res) {
  const blogpostData = { ...req.body };
  const blogPost = new BlogPost(blogpostData);
  await blogPost.save();
  res.sendStatus(200);
});

router.delete("/:id", Auth.middleware, async function(req, res) {
  const id = req.params.id;
  await BlogPost.delete({ id });
  res.sendStatus(200);
});

export default router;
