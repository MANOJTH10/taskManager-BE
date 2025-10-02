const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
        dueDate: { type: Date, required: true },
        assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],  // Reference to user model
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Reference to user model
        attachments: [{ type: String }], // Array of file paths or URLs
        todoChecklist: [todoSchema], // Subdocument array for checklist items
        progress: { type: Number, default:0 } // Progress percentage (0-100)
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
