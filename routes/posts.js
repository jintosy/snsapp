const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// 投稿を作成する
// POST api/posts/
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
// PUT /api/posts/:id
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
// DELETE /api/posts/:id
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
// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    // 返す特定の投稿を取得
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// 指定の投稿にいいねを送信する
// PUT /api/posts/:id/like
router.put("/:id/like", async (req, res) => {
  try {
    // 対象の投稿
    const post = await Post.findById(req.params.id);

    // いいね一覧に自分のidが無ければいいね送信可能なので送る
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        }
      });
      return res.status(200).json("投稿にいいねを送信しました");
    } else {
      // 一覧にidが存在する場合は既に送っているので解除を行う
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        }
      });
      return res.status(200).json("いいねを取り消しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


// タイムラインの投稿を取得する
// GET /api/posts/timeline/all
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    // 自分がフォローしているユーザの投稿内容を全て取得する
    const followPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...followPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;