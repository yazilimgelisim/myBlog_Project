const express = require('express')
const router = express.Router()
const {join} = require('path')
const Users = require(join(__dirname, '..', 'model', 'users.js'))

// render login page
router.get('/', (req, res) => {
   if(res.locals.userLink){
      res.redirect('/error')
   }
   else{
      res.render('site/login')
   }
})



// login process
router.post('/', async(req, res) => {
   if(res.locals.userLink){
      res.redirect('/error')
   }
   else{
      if (res.locals.userLink) {
         res.json({
            message:'Giriş yapılmış kişi istek atamaz', 
            case:false
         })
      }
      else {
         if (!req.body) {
            res.json({
               message:'Bilgiler gönderilemedi', 
               case:false
            })
         }
         else{
            const {username, password} = req.body
            if(!username || !password){
               return res.json({
                  message:'Bilgiler gönderilemedi', 
                  case:false
               })
            }
   
            const user = await Users.find({username, password});
            if(user.length !== 1){
               return res.json({
                  message:'Kullanıcı bulunamadı', 
                  case:false
               })
            }
            const id = user[0]._id
            req.session.userID = String(id)
            return res.json({
               message:'Giriş işlemi başarılı', 
               case:true
            })
         }
      }
   }
})


// logout process
router.get('/logout', async(req, res)=>{
   if(res.locals.userLink){
      req.session.destroy()
      res.redirect('/')
   }
   else{
      res.redirect('/error')
   }
})


module.exports = router