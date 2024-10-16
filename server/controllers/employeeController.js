import Leave from '../models/leave.js';

export const createLeaveRequest = async (req, res) => {
    try {
        const {leave_from, leave_to, reason } = req.body;
        const {  id: e_id, name: e_name } = req.user;

        if (!leave_from || !leave_to || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newLeave = await Leave.create({
            e_id,
            e_name,
            leave_from,
            leave_to,
            reason,
            status: 'pending',
        });

        res.status(201).json(newLeave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const modifyLeaveRequest = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const e_id  = req.user.id;
        const updates = req.body;
        const leave = await Leave.findByPk(leave_id);

        if (!leave || leave.status !== 'pending' || leave.e_id !== e_id) {
            return res.status(404).json({ message: 'Leave request not found or cannot be modified.' });
        }

        await leave.update(updates);
        res.status(200).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteLeaveRequest = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const e_id  = req.user.id;

        const leave = await Leave.findByPk(leave_id);

        if (!leave || leave.status !== 'pending' || leave.e_id !== e_id) {
            return res.status(404).json({ message: 'Leave request not found or cannot be deleted' });
        }

        await leave.destroy();
        res.status(200).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getLeaveRequests = async (req, res) => {
    try {
        const { id: e_id } = req.user;
        const leaves = await Leave.findAll({ where: { e_id } });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};