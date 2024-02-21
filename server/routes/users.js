const router = require(`express`).Router()

const usersModel = require(`../models/users`)

const bcrypt = require('bcryptjs')  //for password encryption

const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const multer  = require('multer')
const upload = multer({dest: `${process.env.UPLOADED_FILES_FOLDER}`})

const emptyFolder = require('empty-folder')



const checkThatUserExistsInUsersCollection = (req, res, next) =>
{
    usersModel.findOne({email:req.params.email}, (error, data) => 
    {
        if(!data)
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else 
        {
            req.data = data
            
            next()
        }
    })        
}


const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) =>
{
    usersModel.findOne({email:req.params.email}, (error, data) => 
    {
        if(data)
        { 
            res.json({errorMessage:`User is not logged in`})
        }
        else 
        {
            req.data = data
            
            next()
        }
    })        
}


const checkThatJWTPasswordIsValid = (req, res, next) =>
{    
    bcrypt.compare(req.params.password, req.data.password, (err, result) =>
    {
        if(!result)
        {  
            res.json({errorMessage:`User is not logged in`})
        }
        
        next()
    })
}


const checkThatFileIsUploaded = (req, res, next) =>
{
    if(!req.file)
    {
        res.json({errorMessage:`No file was selected to be uploaded`})
    }
    
    next()
}


const checkThatFileIsAnImageFile = (req, res, next) =>
{
    if(req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/jpeg")
    {
        fs.unlink(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, (error) => {res.json({errorMessage:`Only .png, .jpg and .jpeg format accepted`})})                
    }
    
    next()
}


const isNewUser = (req, res, next) =>
{
    // If a user with this email does not already exist, then create new user
    usersModel.findOne({email:req.params.email}, (uniqueError, uniqueData) => 
    {
        if(uniqueData)
        {
            res.json({errorMessage:`User already exists`})
        }
    })
    
    next()
}


const addNewUserToUsersCollection = (req, res) =>
{
    bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        usersModel.create({name:req.params.name, email:req.params.email, password:hash, profilePhotoFilename:req.file.filename}, (error, data) => 
        {
            if(data)
            {
                const token = jwt.sign({email: data.email, accessLevel:data.accessLevel}, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn:process.env.JWT_EXPIRY})     
                           
                fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`, 'base64', (err, fileData) => 
                {
                    res.json({name: data.name, accessLevel:data.accessLevel, profilePhoto:fileData, token:token})
                })
            }
            else
            {
                res.json({errorMessage:`User was not registered`})
            }
        }) 
    })     
}


const emptyUsersCollection = (req, res, next) =>
{
    usersModel.deleteMany({}, (error, data) => 
    {
        if(error || !data)
        {
            res.json({errorMessage:`User is not logged in`})
        }
    })
    
    next()
}


const addAdminUserToUsersCollection = (req, res) =>
{
    const adminPassword = `123!"£qweQWE`
    bcrypt.hash(adminPassword, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) =>  
    {
        usersModel.create({name:"Administrator",email:"admin@admin.com",password:hash,accessLevel:parseInt(process.env.ACCESS_LEVEL_ADMIN)}, (createError, createData) => 
        {
            if(createData)
            {    
                emptyFolder(process.env.UPLOADED_FILES_FOLDER, false, (result) =>
                {
                    res.json(createData)
                })               
            }
            else
            {
                res.json({errorMessage:`Failed to create Admin user for testing purposes`})
            }
        })
    })
}


const returnUsersDetailsAsJSON = (req, res) =>
{
    const token = jwt.sign({email: req.data.email, accessLevel:req.data.accessLevel}, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn:process.env.JWT_EXPIRY})     

    fs.readFile(`${process.env.UPLOADED_FILES_FOLDER}/${req.data.profilePhotoFilename}`, 'base64', (err, fileData) => 
    {        
        if(fileData)
        {  
            res.json({name: req.data.name, accessLevel:req.data.accessLevel, profilePhoto:fileData, token:token})                           
        }   
        else
        {
            res.json({name: req.data.name, accessLevel:req.data.accessLevel, profilePhoto:null, token:token})  
        }
    })  
}


const logout = (req, res) => 
{       
    res.json({})
}


// IMPORTANT
// Obviously, in a production release, you should never have the code below, as it allows a user to delete a database collection
// The code below is for development testing purposes only 
router.post(`/users/reset_user_collection`, emptyUsersCollection, addAdminUserToUsersCollection)

router.post(`/users/register/:name/:email/:password`, upload.single("profilePhoto"), checkThatFileIsUploaded, checkThatFileIsAnImageFile, checkThatUserIsNotAlreadyInUsersCollection, addNewUserToUsersCollection)

router.post(`/users/login/:email/:password`, checkThatUserExistsInUsersCollection, checkThatJWTPasswordIsValid, returnUsersDetailsAsJSON)

router.post(`/users/logout`, logout)


module.exports = router