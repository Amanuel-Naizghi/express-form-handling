const usersStorage = require('../storages/usersStorage');
const {body,validationResult} = require('express-validator');

const alphaError = "must only contain latter";
const lengthError = "must be between 1 and 10 characters";

const validateUser = [
    body('firstName').
    trim().
    isAlpha().withMessage(`First name ${alphaError}!`).
    isLength({min:1,max:10}).withMessage(`First name ${lengthError}!`),
    body('lastName').
    trim().
    isAlpha().withMessage(`Last name ${alphaError}!`).
    isLength().withMessage(`Last name ${lengthError}`)
]

exports.usersListGet = (req,res)=>{
    res.render('index',{
        title: "Users List",
        users: usersStorage.getUsers(),
    });
}

exports.usersCreateGet = (req,res)=>{
    res.render('createUser',{
        title: "Create User",
    })
}

exports.usersCreatePost = [
    validateUser,
    (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(404).render('createUser',{
                   title:"Create User",
                   errors:errors.array(),
            })
        }

        const {firstName,lastName} = req.body;
        usersStorage.addUser({firstName,lastName});
        res.redirect('/');
    }
];
