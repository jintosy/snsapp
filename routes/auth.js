const router = require("express").Router();
const User = require("../models/User");


// ユーザ登録
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// ログイン
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("ユーザが見つかりません");
    }

    // 入力されたパスがUser
    const isCorrectPass = req.body.password === user.password;
    if (!isCorrectPass) {
      return res.status(400).json("パスワードが違います");
    } else {
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

module.exports = router;