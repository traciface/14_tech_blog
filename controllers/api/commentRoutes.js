const router = require("express").Router();
const { Comment } = require("../../models");

//C- Create- Posting a comment
router.post("/",  (req, res) => {
    // if statement checks to see if signed in
    if (req.session) {
      Comment.create({
        commentContent: req.body.commentContent,
        post_id: req.body.post_id,
        user_id: req.session.user_id,
      })
        .then((commentData) => res.json(commentData))
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    }
  });

//R- Read- Get single comments
router.get("/:id", (req, res) => {
  Comment.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => res.json(commentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//R- Read- Get All comments
router.get("/", (req, res) => {
    Comment.findAll({})
      .then((commentData) => res.json(commentData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//U- updating comments
router.put("/:id",  (req, res) => {
  Comment.update(
    {
      commentContent: req.body.commentContent,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((commentData) => {
      if (!commentData) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//D- Delete comment
router.delete("/:id",  (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((commentData) => {
      if (!commentData) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;