import Leave from '../models/leave.js';
import User from '../models/user.js';

export const updateLeaveStatus = async (req, res) => { // asyn function with two paramters, req and res, data sent by client and response sent by server
    try {
        const { leave_id } = req.params; //this is getting the leave_id from path parameter in variable leave_id
        const { status } = req.body; // this is getting the status from req body in variable named status

// This snippet of code performs validation on a status variable to ensure it contains a valid value. 
        const validStatuses = ['accepted', 'rejected']; //This line defines an array called validStatuses that contains two acceptable values: 'accepted' and 'rejected'.
        if (!validStatuses.includes(status)) { //The includes method returns true if the array contains the specified value.
            return res.status(400).json({ message: 'Invalid status provided' }); //The json method is used to send a JSON response containing an error message: 'Invalid status provided'.
        }

// This code snippet is used to retrieve a leave request from a database and handle the case where the leave request does not exist. 
        const leave = await Leave.findByPk(leave_id); // Leave.findByPk(leave_id) is a method that queries the database for a record in the Leave table with the specified leave_id.
        if (!leave) {                                 // The await keyword is used to pause execution until the promise returned by findByPk resolves.
            return res.status(404).json({ message: 'Leave request not found' });
        }

// This code snippet retrieves a user associated with a leave request and handles the case where the user does not exist.        
        const user = await User.findByPk(leave.e_id); // The User.findByPk(leave.e_id) method looks for a record in the User table with the specified e_id that we got corrsponding to leave_id in leave variable.
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.user.role !== 'admin') { // checks of the user role for admin access, it it is not admin, this will return true, and then the response will be send as defined below.
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (leave.status === 'accepted') {
            return res.status(409).json({ message: 'Leave request is already accepted' }); // 409 - conflict
        }
        if (leave.status === 'rejected') {
            return res.status().json({ message: 'Leave request is already rejected' });
        }

        leave.status = status; // If all is good, leave.status will be updated to the status which is being passed in req.body 

        if (status === 'accepted') { // if req body has status value set to accepted
            if (user.remaining_leaves <= 0) { // if in user table the remaining leaves is less than or equal to zero, then throw below given error
                return res.status(400).json({ message: 'Not enough remaining leaves to accept this request' });
            }
            user.remaining_leaves -= 1; // if all good, update remaining leaves by subtracting 1
        }
        else if (status === 'rejected') { // if req body has status value set to rejected
                if (user.remaining_leaves + 1 > user.total_leaves) {  // check for the condition, if at present remaining leaves +1 > toatl leaves
                    return res.status(400).json({ message: 'Remaining leaves cannot exceed total leaves' });
            }
            user.remaining_leaves += 1; // if all good, update remaining leaves by adding 1
        } else {
            return res.status(400).json({ message: 'Invalid status provided' }); 
        }

        await leave.save(); // saves/updates the leave model, called as "const leave = await Leave.findByPk(leave_id);"
        await user.save(); // saves/updates the user model, called as "const user = await User.findByPk(leave.e_id);"

        res.status(200).json(leave); // end of try block, if all the conditions are satisfied (i.e none of the error was true), then it will return the response saved in leave variable, as json response.
    } catch (error) { // catch block is used to handle any errors that may occur within the corresponding try block. (particularly imp in asynchronous operation)
        res.status(500).json({ message: error.message && error.name }); //When an error occurs, JavaScript will normally stop and generate an error object with two properties: name and message.
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const currentPage  = parseInt(req.query.page, 10) || 1; // The parseInt function converts the string value of req.query.page to an integer. The second argument, 10, specifies that the string should be parsed as a base-10 number.
        const itemsPerPage  = parseInt(req.query.limit, 10) || 10; // Base 10: The decimal system, which uses digits from 0 to 9,  Base 2: The binary system, which uses digits 0 and 1, Base 8: The octal system, which uses digits from 0 to 7, Base 16: The hexadecimal system, which uses digits from 0 to 9 and letters A to F 
        const skip  = (currentPage - 1) * itemsPerPage; //The offset calculation is essential for implementing pagination in applications, allowing you to control which subset of records to retrieve based on the requested page and limit.

        // The destructuring assignment syntax unpack object properties into variables:
        const { rows, count } = await User.findAndCountAll({ // rows will contain the actual data (the user records), while count will hold the total number of records available in the database (before applying pagination). 
            order: [['e_id', 'ASC']], // This specifies that the results should be ordered by the e_id field in ascending order.
            limit: itemsPerPage, // It's set to control how many users are displayed per page (as determined by pagination logic).
            offset: skip // It is used to skip the particular entries/results based on itemsPerPage and currentPage
        });

        return res.status(200).json({  // sends the json response (The object passed to json will be serialized into a JSON string) with status code 200. The return keyword is used to exit the function immediately after sending the response.
            employees: rows, // key:value pair {assignee:assigned , kind of vessel:substance}
            totalPages: Math.ceil(count / limit), // Math.ceil function ensures that if there are any remaining employees that don’t fill an entire page, they will still count as an additional page. [math.ceil - grater than or eaqual to , math.floor - less than or equal to]
            currentPage: currentPage,
            totalCount: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllLeaveRequests = async (req, res) => {  // asnnc funtion with two input objects req and res
    try {
        const page = parseInt(req.query.page, 10) || 1; 
        const limit = parseInt(req.query.limit, 10) || 10; 
        const offset = (page - 1) * limit;
        const status = req.query.status; // get the status value being passed in query parameter as string value and saves in status variable

        const where = {}; // This initializes an empty object named where. This object will be used to build the conditions for filtering the data in a database query.
        if (status && ['pending', 'accepted', 'rejected'].includes(status)) {  //The includes method checks if the status string exists within the array of valid statuses.
            // This line checks two things:
            //Whether the status variable is defined (not null or undefined).
            //Whether the value of status is one of the valid statuses: 'pending', 'accepted', or 'rejected'.
            where.status = status; // If both conditions in the if statement are met, this line adds a property to the where object, setting where.status to the value of status.
        }

        const { rows, count } = await Leave.findAndCountAll({
            where, // This is an object that contains filtering criteria. It include properties like status, which is set up earlier in the code, allowing for dynamic filtering based on user input.
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
