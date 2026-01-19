const router = require("express").Router();

// middleware (nếu cần bảo vệ sau này)
// const verifyToken = require("../middleware/verifyToken");

// vocab controller
const addVocab = require("../controller/vocab/add");
const retrieveVocab = require("../controller/vocab/retrieve");
const updateVocab = require("../controller/vocab/update");
const deleteVocab = require("../controller/vocab/delete");
const register = require("../controller/auth/register");
const login = require("../controller/auth/login");


// đăng ký
router.post("/register", register);

// đăng nhập
router.post("/login", login);
// ------------------------ route begin ------------------------

// create vocab
router.post("/vocab", /* verifyToken, */ addVocab);

// get all vocab
router.get("/vocab", retrieveVocab.getAll);

// get vocab by id
router.get("/vocab/:id", retrieveVocab.getById);

// update vocab
router.patch("/vocab/:id", /* verifyToken, */ updateVocab);

// delete vocab
router.delete("/vocab/:id", /* verifyToken, */ deleteVocab);

module.exports = router;
