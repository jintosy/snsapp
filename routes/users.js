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


// ユーザ情報の取得



module.exports = router;