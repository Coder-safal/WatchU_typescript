import { body, param, query } from "express-validator";
import { validate } from "../utils/validate.utils";

export const authValidation = {
    register:
        [
            body('email').isEmail().withMessage('Invalid email'),
            body('password')
                .isLength({ min: 8 }).withMessage('Password must contain at least 8 character')
                .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
                .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
            body('fullName').notEmpty()
                .withMessage('Name is required field')
                .isLength({ min: 3 })
                .withMessage("name must contain at least 3 character"),
            body('companyName').notEmpty().withMessage('Company Name is required!'),
            validate
        ],

    resetPassword: [
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('token').isLength({ min: 6 }).withMessage("Invalid token or token is Expiry"),
        validate,
    ],

    login: [
        body('email').isEmail().withMessage('Invalid email'),
        body('password', 'password is requied').exists(),
        validate,
    ],
    forgetPassword: [
        body('email').isEmail().withMessage('Invalid Email'),
    ],

    // update: [
    //     body('name').optional().notEmpty(),
    //     body('settings').optional().isObject(),
    //     validate
    // ],


    changePassword: [
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('new Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirm Password cannot be empty.')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('new-Passwords and confirm-password do not match.');
                }
                return true;
            }),
        body('oldPassword').isLength({ min: 8 }).withMessage(""),
        validate
    ],
    verifyEmail: [],
    validInvite: [
        body('email').isEmail().withMessage("Invalid Email"),
        body('role').notEmpty().withMessage('role is required').isIn(['employee'])
            .withMessage('Invalid role,must be either manager or employee'),
        body('fullName').notEmpty()
            .withMessage("name is required")
            .isLength({ min: 3 }).withMessage("Name must contain at least 3 character"),
        body('position').notEmpty().withMessage("position is required!"),
        validate
    ],
    refreshToken: [],
}

export const departmentValidation = {
    create: [
        body('name').notEmpty().withMessage("name is required"),
        body('description').notEmpty().withMessage("description is required"),
        validate
    ],
    addEmployee: [
        param('departmentId').isMongoId().withMessage('Invalid departmentId'),
        param('userId').isMongoId().withMessage('Invalid userId'),
        validate

    ]
}


export const projectValidation = {
    create: [

    ],
    addEmployee: [
        param('employeeId').isMongoId().withMessage("Invalid EmployeeId"),
        param('projectId').isMongoId().withMessage("Invalid projectId"),
        validate,
    ],
    projectEmployee: [
        param('projectId').isMongoId().withMessage("Invalid ProjectID"),
        param("departmentId").isMongoId().withMessage("Invalid DepartmentId"),
        validate
    ]
}

export const inviteValidation = {
    invite: [
        body('email').isEmail().withMessage('Invalid email'),
        body('role').isIn(['employee']).withMessage("Invalid role"),
        param('organizationId').isMongoId().withMessage("Invalid Organization Id"),

    ]
}


export const timeSheetValidation = {

    start: [
        param('projectId').optional().isMongoId().withMessage("Invalid ProjectId"),
        validate
    ],
    stop: [
        param('timeId').isMongoId().withMessage("Invalid timeId"),
        validate
    ],
    resume: [
        param('timeId').isMongoId().withMessage("Invalid timeId"),
        validate

    ],
    pause: [
        param('timeId').isMongoId().withMessage("Invalid timeId"),
        validate
    ]

}
