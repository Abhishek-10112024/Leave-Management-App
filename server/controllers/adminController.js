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

        const user = await User.findByPk(leave.e_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (leave.status === 'accepted') {
            return res.status(400).json({ message: 'Leave request is already accepted' });
        }
        if (leave.status === 'rejected') {
            return res.status(400).json({ message: 'Leave request is already rejected' });
        }

        leave.status = status;

        if (status === 'accepted') {
            user.remaining_leaves -= 1; 
        } else if (status === 'rejected') {
            user.remaining_leaves += 1; 
        }

        await leave.save();
        await user.save();

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
