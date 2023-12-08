const router = require("express").Router();

const Transaction = require("../controllers/transactionController");
const authenticate = require("../middlewares/authenticate");

router.get("/", Transaction.getAllTransaction);
router.post("/", authenticate, Transaction.createTransaction);
router.post("/finalize", Transaction.paymentFinalize);

module.exports = router;
