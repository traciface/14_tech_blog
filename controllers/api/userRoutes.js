const router = require("express").Router();
const { User, Post, Comment } = require("../../models");


//C- Create- Checks user into the website
router.post("/", (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
    })
      // stores user data
      .then((userInfo) => {
        req.session.save(() => {
          req.session.user_id = userInfo.id;
          req.session.username = userInfo.username;
          req.session.loggedIn = true;
  
          res.json(userInfo);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
//C- Verifies and checks for user in system
router.post("/login", (req, res) => {
    console.log("logged in")
    console.log(req.session)
    User.findOne({
      where: {
        username: req.body.username,
      },
    })
      .then((userInfo) => {
        if (!userInfo) {
          res.status(400).json({ message: "Username doesn't exist!" });
          return;
        }
        // verify user
        const validPassword = userInfo.checkPassword(req.body.password);
  
        if (!validPassword) {
          res.status(400).json({ message: "Incorrect password!" });
          return;
        }
        req.session.save(() => {
          req.session.user_id = userInfo.id;
          req.session.username = userInfo.username;
          req.session.loggedIn = true;
  
          res.json({ user: userInfo, message: "Login complete! Welcome!" });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

// R- gets the API users
router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((userInfo) => res.json(userInfo))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// R- gets a single user
router.get("/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "date_created"],
      },
      //  Comment model here:
      {
        model: Comment,
        attributes: ["id", "commentContent", "date_created"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
      {
        model: Post,
        attributes: ["title"],
      },
    ],
  })
    .then((userInfo) => {
      if (!userInfo) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// U- update users
router.put("/:id", (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((userInfo) => {
      if (!userInfo[0]) {
        res.status(404).json({ message: "User not Found" });
        return;
      }
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// D- Delete a user
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userInfo) => {
      if (!userInfo) {
        res.status(404).json({ message: "No such user ID" });
        return;
      }
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;