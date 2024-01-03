const express = require('express')
const router = express()
const { join } = require('path')
const fs = require('fs')
const { names, sizeAndType, isThereFile } = require(join(__dirname, '..', 'helpers', 'files.js'))
const Contents = require(join(__dirname, '..', 'model', 'content.js'))



// ? ADD PROCESS
// Add render page area
router.get('/add', (req, res) => {
   if (!res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      res.render('admin/add')
   }
})

// add post area
router.post('/add', (req, res) => {
   if (!res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      if (!req.body || !req.files) {
         return res.json({
            message: 'Veri iletilemedi',
            case: false
         })
      }
      const { title, content, author } = req.body;
      const { files } = req.files;
      if (!title || !content || !author || !files) {
         return res.json({
            message: 'Veri iletilemedi',
            case: false
         })
      }
      sizeAndType(res, files, () => {
         const uniqueName = names(files)
         files.mv(join(__dirname, '..', 'public', 'img', 'content', uniqueName), (err) => {
            if (err === undefined) {
               const newContent = Contents({
                  title: title,
                  imgURL: `/img/content/${uniqueName}`,
                  content: content,
                  author: author
               })
               newContent.save().then(() => {
                  return res.json({
                     message: 'İçerik başarılı bir şekilde oluşturuldu',
                     case: true
                  })
               }).catch(err => {
                  console.log(err)
                  return res.json({
                     message: 'Yazı kayıt edilemedi',
                     case: false
                  })
               })
            }
            else {
               return res.json({
                  message: 'Dosya kayıt edilemedi',
                  case: false
               })
            }
         })
      })
   }
})




// ? DELETE PROCESS
router.post('/delete', async (req, res) => {
   if (!res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      if (!req.body) {
         return res.json(({
            message: 'Veri bulunamadı',
            case: false
         }))
      }
      const { id } = req.body
      if (!id) {
         return res.json(({
            message: 'Veri bulunamadı',
            case: false
         }))
      }

      if (id.length !== 24) {
         return res.json(({
            message: 'Hatalı veri',
            case: false
         }))
      }

      const controlControl = await Contents.findById(id);
      if (!controlControl) {
         return res.json(({
            message: 'İçerik bulunamadı',
            case: false
         }))
      }
      const filePath = controlControl.imgURL
      if (!isThereFile(join(__dirname, '..', 'public', filePath))) {
         const deleteContent = await Contents.findByIdAndDelete(id);
         if (!deleteContent) {
            return res.json(({
               message: 'İçerik silinemedi',
               case: false
            }))
         }
         return res.json(({
            message: 'Resim bulunamadı fakat yazı başarılı bir şekilde silindi',
            case: true
         }))
      }
      else {
         fs.unlink(join(__dirname, '..', 'public', filePath), (err) => {
            console.log(err)
         })
         const deleteContent = await Contents.findByIdAndDelete(id);
         if (!deleteContent) {
            return res.json(({
               message: 'İçerik silinemedi',
               case: false
            }))
         }
         return res.json(({
            message: 'Hem içerik hem resim başarılı bir şekilde silindi',
            case: true
         }))
      }
   }
})


// ? EDIT PROCESS

// Edit page render
router.get('/edit/:id', async (req, res) => {
   if (!res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      const { id } = req.params
      if (!id) {
         return res.json({
            message: 'ID değeri bulunamadı',
            case: false
         })
      }
      if (id.length !== 24) {
         return res.json({
            message: 'ID değeri bulunamadı',
            case: false
         })
      }

      const controtContent = await Contents.findById(id);
      if (!controtContent) {
         return res.json({
            message: 'İçerik bulunamadı',
            case: false
         })
      }


      res.render('admin/edit', {
         data: controtContent.toJSON()
      })
   }
})


// Edit Post
router.post('/edit', async (req, res) => {
   if (!res.locals.userLink) {
      res.redirect('/error')
   }
   else {
      if (!req.body || !req.files) {
         return res.json({
            message: 'İçerik iletilemedi',
            case: false
         })
      }

      const { id, title, content, author } = req.body
      const { file } = req.files

      if (!id || !title || !content || !author || !file) {
         return res.json({
            message: 'İçerik iletilemedi',
            case: false
         })
      }
      if (id.length !== 24) {
         return res.json({
            message: 'İçerik id bulunamadı',
            case: false
         })
      }

      const controlContent = await Contents.findById(id);
      if (!controlContent) {
         return res.json({
            message: 'İçerik bulunamadı',
            case: false
         })
      }

      const filePath = await controlContent.imgURL
      if (isThereFile(join(__dirname, '..', 'public', filePath))) {
         fs.unlink(join(__dirname, '..', 'public', filePath), (err) => {
            console.log(err)
         })
      }
      const fileName = names(file);
      file.mv(join(__dirname, '..', 'public', 'img', 'content', fileName), (err) => {
         console.log(err)
      })
      Contents.findByIdAndUpdate(id, {
         $set: {
            title: title,
            imgURL: `/img/content/${fileName}`,
            content: content,
            author: author
         }
      }).then(() => {
         return res.json({
            message: 'Güncelleme işlemi başarılı bir şekilde gerçekleşti',
            case: true
         })
      }).catch(err => {
         console.log(err)
         return res.json({
            message: 'Güncelleme işlemi esnasında bir hata oluştu',
            case: false
         })
      })

   }
})

module.exports = router



