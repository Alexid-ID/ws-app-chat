const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/home.controller");

router.get("/chat", async (req, res) => {
    return await HomeController.index(req, res);
});



module.exports = router;