const usersStorage = require('../storages/usersStorage');
const {body,validationResult} = require('express-validator');

const alphaError = "must only contain latter";
const lengthError = "must be between 1 and 10 characters";
const ageError = "must be between 18 and 120";
const bioError = "must be less than 200 characters";

const validateUser = [
    body('firstName').
    trim().
    isAlpha().withMessage(`First name ${alphaError}!`).
    isLength({min:1,max:10}).withMessage(`First name ${lengthError}!`),
    body('lastName').
    trim().
    isAlpha().withMessage(`Last name ${alphaError}!`).
    isLength().withMessage(`Last name ${lengthError}`),
    body('age').
    isInt({min:18,max:120}).withMessage(`Age ${ageError}`),
    body('bio').
    isLength({min:0,max:200}).withMessage(`BIo ${bioError}`),
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
        const errors = validationResult(req);//validationResult(req) is used for getting the result of the validateUser 
        if(!errors.isEmpty()){
            return res.status(404).render('createUser',{
                   title:"Create User",
                   errors:errors.array(),
            })
        }

        const {firstName,lastName,email,age,bio} = req.body;
        usersStorage.addUser({firstName,lastName,email,age,bio});
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
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect("/");
    }
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
};
//This method is used for getting the search results
exports.searchUserGet = (req,res) => {
    const {searchItem} = req.query;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//Regular expression for checking email
    const data = usersStorage.getUsers();
    if(emailRegex.test(searchItem)){
        const resultArray = [];
        data.map((item)=> {
            if(searchItem === item.email ){
                resultArray.push(item);
            }
        })
        if(resultArray.length>0){
            return res.render('search',{
                title: "Search Result",
                resultArray: resultArray,
            });
        }
        return res.render('search',{
            title: "Search Result",
            item: "No matching email"
        })
    }
    else{
        const resultArray = [];
        data.map((item)=>{
            if(searchItem.toLowerCase() === item.firstName.toLowerCase() ||
               searchItem.toLowerCase() === item.lastName.toLowerCase() ||
               searchItem.toLowerCase() === item.firstName.toLowerCase()+" "+item.lastName.toLowerCase()){

                resultArray.push(item);
            }
        });
        if(resultArray.length>0){
            return res.render('search',{
                title: "Search Result",
                resultArray: resultArray,
            });
        }
        return res.render('search',{
            title: "Search Result",
            item: "No matching email"
        })
    }
}
  
  
