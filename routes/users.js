const router = require("express").Router();
const User = require("../models/User");

// ユーザ取得の更新
router.put("/:id", async (req, res) => {
  // ユーザ自体か管理者であれば更新可能とする
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザ情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントのみ更新可能です");
  }
});

// ユーザ情報の削除
router.delete("/:id", async (req, res) => {
  // ユーザ自体か管理者であれば削除可能とする
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // 削除実行
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザ情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントのみ削除可能です");
  }
});


// ユーザ情報の取得
router.get("/:id", async (req, res) => {
  try {
    // 検索実行
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});



module.exports = router;