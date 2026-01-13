import express from 'express';

const router = express.Router()

router.post('/register',async (req, res) => {
    try {
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'})
        }
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long'})
        }
        if(username.length < 3){
            return res.status(400).json({message: 'Username must be at least 3 characters long'})
        }


        
    } catch (error) {
        
    }

})
router.post('/login',async (req, res) => {
    res.send('Login')
})

export default router;