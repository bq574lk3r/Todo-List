import { body, param } from 'express-validator';

const customFunctions = {
    validatePassMsg: 'пароль должен содержать 6-16 символов, латинские буквы в верхнем и нижнем регистре и спецсимволы',
    validatePass(value:string) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z](?=.*[\W])).{6,16}$/.test(String(value));
    },
    validateUsernameMsg: 'username должен быть длинной 2-16 символов и латиницей',
    validateUsername(value:string) {
        return !/[^0-9a-zA-Z].{2,16}$/.test(String(value));
    }
};


class ValidationHelpers {
    validateDataUser = [
        body(['username', 'email', 'password']).notEmpty().withMessage('все поля должны быть заполнены'),
        body('username').custom(customFunctions.validateUsername)
            .withMessage(customFunctions.validateUsernameMsg),
        body('email').isEmail().withMessage('используйте корректный email'),
        body('password').custom(customFunctions.validatePass)
            .withMessage(customFunctions.validatePassMsg),
    ]

    validateLogin = [
        body('email').isEmail().withMessage('используйте корректный email'),
        body('password').isString().withMessage('неверный пароль'),
    ]

    validateDataTask = [
        body(['title', 'isCompleted']).notEmpty().withMessage('все поля должны быть заполнены'),
        body('isCompleted').isBoolean().withMessage('ожидается булевое значение'),
    ]

    validateTitle = [
        body('title').notEmpty().withMessage('поле title должно быть заполнено')
    ]

    validateParamId = [
        param('id').notEmpty()
    ]
};

export default new ValidationHelpers();