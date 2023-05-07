"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authControllers = __importStar(require("../controllers/auth"));
const is_auth_1 = __importDefault(require("../middlewares/is-auth"));
const router = express_1.Router();
router.post("/login", [
    express_validator_1.check('email').trim().isEmail().isLength({ min: 7, max: 30 }),
    express_validator_1.check('password').trim().isLength({ min: 6, max: 20 })
], authControllers.login);
router.post("/register", [
    express_validator_1.check('first_name').trim().isLength({ min: 3, max: 15 }),
    express_validator_1.check('last_name').trim().isLength({ min: 3, max: 15 }),
    express_validator_1.check('email').trim().isEmail().isLength({ min: 7, max: 30 }),
    express_validator_1.check('password').trim().isLength({ min: 6, max: 20 })
], authControllers.register);
router.get("/usernames", is_auth_1.default, authControllers.getUsersInfo);
exports.default = router;
