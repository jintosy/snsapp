const router = require("express").Router();
const Post = require("../models/Post");


// 投稿を作成する
// api/posts/
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// 投稿を更新する
// /api/posts/:id
router.put("/:id", async (req, res) => {
  try {
    // 更新対象の投稿情報を取得
    const post = await Post.findById(req.params.id);

    // 投稿したユーザのみが編集可能なのでチェック
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body
      });
      return res.status(200).json("投稿の更新に成功しました");
    } else {
      return res.status(403).json("自分の投稿のみ更新可能です");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});


// 投稿を削除する
// /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    // 削除対象の投稿情報を取得
    const post = await Post.findById(req.params.id);

    // 投稿を行ったユーザのみが削除実行可能
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿の削除に成功しました");
    } else {
      return res.status(403).json("自分の投稿のみ削除可能です");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


// 指定の投稿の情報を取得する
// /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    // 返す特定の投稿を取得
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});


module.exports = router;