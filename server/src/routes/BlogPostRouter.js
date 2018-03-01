var router = require("express").Router();
const BlogPost = require("../Entity").BlogPost;

router.get("/", async function(req, res) {
  const blogPosts = await BlogPost.listBlogPostDetails();
  res.json(blogPosts);
});

router.get("/:id", async function(req, res) {
  const id = req.params.id;
  const blogPost = await BlogPost.getBlogPostDetails(id);
  res.json(blogPost);
});

router.post("/", async function(req, res) {
  const blogpostData = { ...req.body };
  const blogPost = new BlogPost(blogpostData);
  await blogPost.save();
  res.json(blogPost);
});

router.put("/:id", async function(req, res) {
  const blogpostData = { ...req.body };
  const blogPost = new BlogPost(blogpostData);
  await blogPost.save();
  res.sendStatus(200);
});

module.exports = router;
