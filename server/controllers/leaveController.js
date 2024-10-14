import Leave from '../models/leave.js';

export const createLeaveRequest = async (req, res) => {
    try {
        const { id, name, leave_from, leave_to, reason } = req.body;

        const newLeave = await Leave.create({
            id,
            name,
            leave_from,
            leave_to,
            reason,
            status: 'pending',
            total_leaves: 0,
            remaining_leaves: 0 
        });

        res.status(201).json(newLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getLeaveRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const leaves = await Leave.findAll({ where: { id } });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateLeaveRequest = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const { status } = req.body;

        const leave = await Leave.findByPk(leave_id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
