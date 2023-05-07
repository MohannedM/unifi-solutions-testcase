"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_auth_1 = __importDefault(require("../middlewares/is-auth"));
const tasksController = __importStar(require("../controllers/tasks"));
const router = express_1.Router();
router.post("/", [
    express_validator_1.check('title').trim().isLength({ min: 5, max: 50 }),
    express_validator_1.check('description').trim().isLength({ min: 20, max: 250 }),
    express_validator_1.check('due_date').trim().isLength({ min: 3, max: 25 }),
    express_validator_1.check('assigned_to').trim().isLength({ min: 1, max: 50 })
], is_auth_1.default, tasksController.createTask);
router.get("/created", is_auth_1.default, tasksController.getTasksCreated);
router.get("/assigned", is_auth_1.default, tasksController.getMyTasks);
router.get("/:task_id", is_auth_1.default, tasksController.getTask);
router.delete("/:task_id", is_auth_1.default, tasksController.deleteTask);
exports.default = router;
