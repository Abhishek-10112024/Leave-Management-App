import Leave from '../models/leave.js';
import User from '../models/user.js';

export const updateLeaveStatus = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const { status } = req.body; 

        const validStatuses = ['accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const leave = await Leave.findByPk(leave_id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        const user = await User.findByPk(leave.e_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (leave.status === 'accepted') {
            return res.status(409).json({ message: 'Leave request is already accepted' }); // 409 - conflict
        }
        if (leave.status === 'rejected') {
            return res.status().json({ message: 'Leave request is already rejected' });
        }

        leave.status = status;

        if (status === 'accepted') {
            if (user.remaining_leaves <= 0) {
                return res.status(400).json({ message: 'Not enough remaining leaves to accept this request' });
            }
            user.remaining_leaves -= 1; 
        } else if (status === 'rejected') {
            if (req.user.role !== 'admin') {
                const totalLeaves = user.total_leaves; 
                if (user.remaining_leaves + 1 > totalLeaves) {
                    return res.status(400).json({ message: 'Remaining leaves cannot exceed total leaves' });
                }
                user.remaining_leaves += 1; 
            }
        } else {
            return res.status(400).json({ message: 'Invalid status provided' }); 
        }409

        await leave.save();
        await user.save();

        res.status(200).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit;

        const { rows, count } = await User.findAndCountAll({
            order: [['e_id', 'ASC']],
            limit,
            offset
        });

        return res.status(200).json({
            employees: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllLeaveRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit;
        const status = req.query.status;

        const where = {}; // Define a where clause for filtering
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
            where.status = status; // Add status filter if provided and valid
        }

        const { rows, count } = await Leave.findAndCountAll({
            where, // Use the where clause for filtering
            order: [['leave_id', 'ASC']], 
            limit,
            offset
        });

        return res.status(200).json({
            leaves: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
