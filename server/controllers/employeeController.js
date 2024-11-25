import Leave from '../models/leave.js';
import { Op } from 'sequelize';
import User from '../models/user.js';

export const createLeaveRequest = async (req, res) => {
    try {
        const { leave_from, leave_to, reason } = req.body;
        const { id: e_id, name: e_name } = req.user;
        // req.user: This object contains information about the authenticated user. It is populated by authentication middleware after a user successfully logs in.
        // The id property is being renamed to e_id, and the name property is being renamed to e_name which are being extracted from a req.user object.

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'employee') {
            return res.status(403).json({ message: "Only employee can apply for leave." });
        }

        if (!leave_from || !leave_to || !reason) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const leaveDays = Math.ceil((new Date(leave_to) - new Date(leave_from)) / (1000 * 60 * 60 * 24)) + 1;
        // ceil: Returns the smallest integer greater than or equal to its numeric argument.
        // new Date(leave_from) and new Date(leave_to): These expressions convert the leave_from and leave_to values into JavaScript Date objects. This allows for date manipulation and calculations.
        // (new Date(leave_to) - new Date(leave_from)): This subtraction calculates the difference between the two dates in milliseconds. The result is a number representing the total milliseconds between the two dates.
        // /(1000 * 60 * 60 * 24): This division converts the millisecond difference into days.
        // + 1: This addition accounts for the fact that both the start and end days are typically considered full leave days.
        const user = await User.findByPk(e_id);
        if (!user || user.remaining_leaves < leaveDays) {
            return res.status(400).json({ message: 'Not enough remaining leaves to apply for this request.' });
        }

        const existingLeaves = await Leave.findAll({
            where: { // The where clause defines the conditions for the query, specifying which records to retrieve.
                e_id, // e_id: This condition filters the results to only include leaves associated with the specific employee ID.
                status: { [Op.or]: ['accepted', 'rejected'] }, // This condition uses Sequelize’s operator (Op.or) to filter leaves that have a status of either "accepted" or "rejected".
                [Op.or]: [ // The query checks for overlaps with the given leave period (leave_from to leave_to)
                    { leave_from: { [Op.between]: [leave_from, leave_to] } }, // Checks if the leave_from date of existing leaves falls within the new leave period.
                    { leave_to: { [Op.between]: [leave_from, leave_to] } }, // Checks if the leave_to date of existing leaves falls within the new leave period.
                    { leave_from: { [Op.lte]: leave_from }, leave_to: { [Op.gte]: leave_to } } // Checks if the existing leave fully encompasses the new leave period (i.e., the existing leave starts before or on the new start date and ends after or on the new end date).
                ]
            }
        });

        if (existingLeaves.length > 0) { // This condition checks if the existingLeaves array has any entries. If its length is greater than 0, it indicates that there are one or more existing leave requests that overlap with the new leave request being submitted.
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
        user.remaining_leaves -= 1; // if all good, update remaining leaves by subtracting 1
        await user.save(); // saves/updates the user model, called as "const user = await User.findByPk(e_id);"

        res.status(201).json(newLeave);
    } catch (error) {
        console.error("Error creating leave request:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const modifyLeaveRequest = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const e_id = req.user.id;
        const { leave_from, leave_to, reason } = req.body;

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'employee') {
            return res.status(403).json({ message: "Only employee can edit leave." });
        }

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

        await leave.update({ leave_from, leave_to, reason });
        res.status(200).json(leave);
    } catch (error) {
        console.error("Error modifying leave request:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const deleteLeaveRequest = async (req, res) => {
    try {
        const { leave_id } = req.params;
        const e_id = req.user.id;

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'employee') {
            return res.status(403).json({ message: "Only employee can delete leave." });
        }

        const leave = await Leave.findByPk(leave_id);

        if (!leave || leave.status !== 'pending' || leave.e_id !== e_id) {
            return res.status(404).json({ message: 'Leave request not found or cannot be deleted' });
        }

        await leave.destroy(); // If the validation checks pass, this line deletes the leave request from the database using the destroy method.
        res.status(200).send(); // After successfully deleting the leave request, the send method can be used without any content if no additional information is needed in the response.
    } catch (error) {
        console.error("Error deleting leave request:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getLeaveRequests = async (req, res) => {
    try {
        const { id: e_id } = req.user;

        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit; 

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'employee') {
            return res.status(403).json({ message: "Only employee can get their leaves." });
        }

        const status = req.query.status; // get the status value being passed in query parameter as string value and saves in status variable
        const where = {e_id}; // This initializes an object named where. This object will be used to build the conditions for filtering the data in a database query. It already contains a condition to check the required id which it got from req.user object
        if (['pending', 'accepted', 'rejected'].includes(status)) {  //The includes method checks if the status string exists within the array of valid statuses.
            // This line checks two things:
            //Whether the status variable is defined (not null or undefined).
            //Whether the value of status is one of the valid statuses: 'pending', 'accepted', or 'rejected'.
            where.status = status; // If both conditions in the if statement are met, this line adds a property to the where object, setting where.status to the value of status.
        }
        else if (status === null || undefined || ''){
            const { count, rows } = await Leave.findAndCountAll({
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
        }
        const { count, rows } = await Leave.findAndCountAll({
            order: [['leave_id', 'ASC']],
            where,
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
        console.error("Error fetching leave requests:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const getProfile = async (req, res) => {
    try {
        const { id: e_id } = req.user;
        // The destructuring assignment syntax unpack object properties into variables:
        const profile = await User.findByPk(e_id); // rows will contain the actual data (the user records), while count will hold the total number of records available in the database (before applying pagination). 
        return res.status(200).json({
            profile});  // sends the json response (The object passed to json will be serialized into a JSON string) with status code 200. The return keyword is used to exit the function immediately after sending the response.
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};