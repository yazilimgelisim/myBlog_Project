const express = require('express')
const router = express.Router()
const { join } = require('path')
const Users = require(join(__dirname, '..', 'model', 'users.js'))

// Render page
router.get('/', (req, res) => {
   if (res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      res.render('site/register')
   }
})


// Register Control 
router.post('/', async (req, res) => {
   if (res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      if (!req.body) {
         return res.json({
            message: 'Veri iletilemedi!',
            case: false
         })
      }

      const { email, username, password } = req.body
      if (!email || !username || !password) {
         return res.json({
            message: 'Veri iletilemedi!',
            case: false
         })
      }

      const user = await Users.find({ email, password });
      if (user.length !== 0) {
         return res.json({
            message: 'Kullanıcı zaten kayıtlıdır',
            case: false
         })
      }

      const newUser = Users({
         email,
         username,
         password
      })
      newUser.save().then(() => {
         return res.json({
            message: 'Kullanıcı kaydı başarılı bir şekilde oluşturuldu!',
            case: true
         })
      }).catch(err => {
         console.log(err)
         return res.json({
            message: 'Beklenilmeyen bir hata oluştu',
            case: false
         })
      })
   }
})




module.exports = router