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

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };
  
exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
            title: "Update user",
            user: user,
            errors: errors.array(),
        });
        }
        const { firstName, lastName } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName });
        res.redirect("/");
    }
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
};
  
  
