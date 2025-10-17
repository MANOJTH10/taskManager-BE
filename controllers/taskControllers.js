const Task = require("../models/Task");

// @desc  Get all tasks (Admin: all, User: assigned tasks)
//@route  GET /api/tasks/
//@access Private
const getTasks = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: 'server error', error: error.message});
  }  
};

// @desc  Get task by Id 
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {};

// @desc. Create new task (Admin only
// @route POST /api/tasks/
// @access Private (Admin)
const createTask = async (req, res) =>{};

// @desc Update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {};

// @desc Delete a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private (Admin)
const deleteTask = async (req, res) => {};

//@desc Update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {};

//@desc Update task checklist
//@route PUT /api/tasks/:id/todo
//@access Private
const updateTaskChecklist = async (req, res) => {};

// @desc Dashboard Data (Admin only)
// @route GET /api/tasks/dashboard-data
// @access Private (Admin)
const getDashboardData = async (req, res) => {};

// @desc. Dashboard Data (User-specific)
// @route GET /api/tasks/user-dashboard-data
// @access private
const getUserDashboardData = async (req, res) => {};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
