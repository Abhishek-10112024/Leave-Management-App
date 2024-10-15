import Leave from '../models/leave.js';
import User from '../models/user.js'

export const updateLeaveStatus = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const { status } = req.body; 

        const leave = await Leave.findByPk(leave_id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;

        if (status === 'approved') {
            leave.remaining_leaves -= 1; 
        } else if (status === 'rejected') {
            leave.remaining_leaves += 1; 
        }

        await leave.save();

        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.findAll();
        return res.status(200).json(leaves);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
