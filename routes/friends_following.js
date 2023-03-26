const express = require("express");
const router = express.Router();

const requireLogin = require("../middleware/requireLogin");
router.get('/following/:id', requireLogin, (req, res) => {
  User.findById(req.params.id)
    .populate('following', '_id name')
    .exec((err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ following: user.following });
    });
});

module.exports = router;
