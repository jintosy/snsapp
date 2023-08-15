const router = require("express").Router();
const User = require("../models/User");

// ユーザ取得の更新
// PUT /api/users/:id
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
// DELETE /api/users/:id
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
// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    // 検索実行
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other} = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// ユーザのフォロー
// PUT /api/users/:id/follow
router.put("/:id/follow", async (req, res) => {
  // これからフォローするユーザのIDが等しくない
  // = 自分じゃなければフォロー処理を行う
  if (req.body.userId !== req.params.id) {
    try {
      // フォローするユーザ情報を取得
      const user = await User.findById(req.params.id);
      // 現在のユーザ情報を取得
      const currentUser = await User.findById(req.body.userId);
      // フォロワー一覧に自分がいなかったらフォロー可能
      if (!user.followers.includes(req.body.userId)) {
        // フォローするユーザのフォロワー配列にpush
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          }
        });
        // 自分のフォロー中にフォローするユーザを追加
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          }
        });
        return res.status(200).json("フォロー成功しました");
      } else {
        return res.status(403).json("あなたは既にこのユーザをフォローしています");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身はフォローできません");
  }
});


// ユーザのフォロー解除
// PUT /api/users/:id/unfollow
router.put("/:id/unfollow", async (req, res) => {
  // 自分自身でなければフォロー解除処理実行
  if (req.body.userId !== req.params.id) {
    try {
      // フォロー解除するユーザ情報を取得
      const user = await User.findById(req.params.id);
      // 自分のユーザ情報を取得
      const currentUser = await User.findById(req.body.userId);
      // フォロワー一覧に自分が含まれていれば解除可能
      if (user.followers.includes(req.body.userId)) {
        // 解除するユーザのフォロワー一覧から自分を削除
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          }
        });
        // 自分のフォロー一覧から解除ユーザを削除
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          }
        });

        return res.status(200).json("フォロー解除に成功しました");
      } else {
        return res.status(403).json("フォローしていない為解除不可です");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
});


module.exports = router;