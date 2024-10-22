import Leave from '../models/leave.js';
import { Op } from 'sequelize';
import User from '../models/user.js';

export const createLeaveRequest = async (req, res) => {
    try {
        const {leave_from, leave_to, reason } = req.body;
        const {  id: e_id, name: e_name } = req.user;

        if (!leave_from || !leave_to || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const leaveDays = Math.ceil((new Date(leave_to) - new Date(leave_from)) / (1000 * 60 * 60 * 24)) + 1;

        const user = await User.findByPk(e_id);
        if (!user || user.remaining_leaves < leaveDays) {
            return res.status(400).json({ message: 'Not enough remaining leaves to apply for this request.' });
        }

        const existingLeaves = await Leave.findAll({
            where: {
                e_id,
                status: { [Op.or]: ['accepted', 'rejected'] }, 
                [Op.or]: [
                    { leave_from: { [Op.between]: [leave_from, leave_to] } },
                    { leave_to: { [Op.between]: [leave_from, leave_to] } },
                    { leave_from: { [Op.lte]: leave_from }, leave_to: { [Op.gte]: leave_to } }
                ]
            }
        });

        if (existingLeaves.length > 0) {
            return res.status(400).json({ message: 'Leave request overlaps with an existing request.' });
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
        const e_id = req.user.id;
        const { leave_from, leave_to , reason} = req.body;
        const updates = req.body;

        const leave = await Leave.findByPk(leave_id);

        if (!leave || leave.status !== 'pending' || leave.e_id !== e_id) {
            return res.status(404).json({ message: 'Leave request not found or cannot be modified.' });
        }

        const leaveDays = Math.ceil((new Date(leave_to) - new Date(leave_from)) / (1000 * 60 * 60 * 24)) + 1;

        const user = await User.findByPk(e_id);
        if (!user || user.remaining_leaves < leaveDays) {
            return res.status(400).json({ message: 'Not enough remaining leaves to apply for this request.' });
        }

        // Check for overlapping accepted or rejected leaves
        const existingLeaves = await Leave.findAll({
            where: {
                e_id,
                status: { [Op.or]: ['accepted', 'rejected'] },
                [Op.or]: [
                    { leave_from: { [Op.between]: [leave_from, leave_to] } },
                    { leave_to: { [Op.between]: [leave_from, leave_to] } },
                    { leave_from: { [Op.lte]: leave_from }, leave_to: { [Op.gte]: leave_to } }
                ]
            }
        });

        if (existingLeaves.length > 0) {
            return res.status(400).json({ message: 'Leave request overlaps with an existing accepted or rejected request.' });
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

        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit; 

        const { count, rows: leaves } = await Leave.findAndCountAll({
            where: { e_id },
            limit, 
            offset 
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            totalItems: count,
            totalPages,
            currentPage: page,
            leaves
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};