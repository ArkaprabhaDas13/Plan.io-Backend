import validator from 'email-validator';

const validationMiddleware = (req, res, next) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password)
    {
        throw new Error("Name, email and password are required!");
    }
    //validate email
        let isEmailValid = validator.validate(email);
        if(!isEmailValid)
        {
            return res.status(400).json({
                message: "Valid email is required!"
            });
        }
    //validate password
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be min 6 letters, include uppercase, lowercase, a number, and a special character!"
            })
        }
    next();
}

export default validationMiddleware;