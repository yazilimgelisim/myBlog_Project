const express = require('express')
const router = express.Router()
const {join} = require('path')
const Contents = require(join(__dirname, '..', 'model', 'content.js'))


router.get('/:id', async(req, res)=>{
   const {id} = req.params
   const data = await Contents.findById(id);
   res.render('site/single', {
      data: !data ? [] : data.toJSON()
   })
})



module.exports = router