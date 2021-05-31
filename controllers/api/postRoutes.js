const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");

// C- Create a post
router.post("/", withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    })
      .then((postContent) => res.json(postContent))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  // R- Read- get a single post
router.get("/:id", (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "content", "title", "date_created"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_content", "post_id", "user_id", "date_created"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    })
      .then((postContent) => {
        if (!postContent) {
          res.status(404).json({ message: "Post not found" });
          return;
        }
        res.json(postContent);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // R- Read- get all posts
  router.get("/", (req, res) => {
  console.log("======================");
  Post.findAll({
    attributes: ["id", "title", "content", "date_created"],
    order: [["date_created", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
      {
        model: Comment,
        attributes: ["id", "comment_content", "post_id", "user_id", "date_created"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
    ],
  })
    .then((postContent) => res.json(postContent.reverse()))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// U- update post title
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((postContent) => {
      if (!postContent) {
        res.status(404).json({ message: "Post not Found" });
        return;
      }
      res.json(postContent);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// D- delete a post
router.delete("/:id", withAuth, (req, res) => {
  //dont forget to also delete comments or else the foreign key constraints will mess things up
  Post.findOne({
    where: {id: req.params.id},
    include: [Comment]
  })
  .then(post => {
    post.comments.forEach(comment => {
      comment.destroy();
    })
    post.destroy();
    res.end();
  })
});

module.exports = router;