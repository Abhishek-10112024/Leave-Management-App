import User from '../models/user.js';


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


export const getAllEmployees = async (req, res) => {
    try {
        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'admin') {
            return res.status(403).json({ message: "Only admins can access all employees" });
        }

        const page  = parseInt(req.query.page, 10) || 1; // The parseInt function converts the string value of req.query.page to an integer. The second argument, 10, specifies that the string should be parsed as a base-10 number.
        const limit  = parseInt(req.query.limit, 10) || 10; // Base 10: The decimal system, which uses digits from 0 to 9,  Base 2: The binary system, which uses digits 0 and 1, Base 8: The octal system, which uses digits from 0 to 7, Base 16: The hexadecimal system, which uses digits from 0 to 9 and letters A to F 
        const offset  = (page - 1) * limit; //The offset calculation is essential for implementing pagination in applications, allowing you to control which subset of records to retrieve based on the requested page and limit.

        // The destructuring assignment syntax unpack object properties into variables:
        const { rows, count } = await User.findAndCountAll({ // rows will contain the actual data (the user records), while count will hold the total number of records available in the database (before applying pagination). 
            order: [['e_id', 'ASC']], // This specifies that the results should be ordered by the e_id field in ascending order.
            limit, // It's set to control how many users are displayed per page (as determined by pagination logic).
            offset // It is used to skip the particular entries/results based on itemsPerPage and currentPage
        });

        return res.status(200).json({  // sends the json response (The object passed to json will be serialized into a JSON string) with status code 200. The return keyword is used to exit the function immediately after sending the response.
            employees: rows, // key:value pair {assignee:assigned , kind of vessel:substance}
            totalPages: Math.ceil(count / limit), // Math.ceil function ensures that if there are any remaining employees that don’t fill an entire page, they will still count as an additional page. [math.ceil - grater than or eaqual to , math.floor - less than or equal to]
            currentPage: page,
            totalCount: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { e_id } = req.params;

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'admin') {
            return res.status(403).json({ message: "Only admin can delete user." });
        }

        const employee = await User.findByPk(e_id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.destroy(); // If the validation checks pass, this line deletes the user from the database using the destroy method.
        res.status(200).send(); // After successfully deleting the user, the send method can be used without any content if no additional information is needed in the response.
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
