const fs = require('fs')

const names = (files)=>{
   let extension = files.mimetype.split('/')[1];
   let uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}`;
   let allName = `${uniqueName}.${extension}`;
   return allName
}

const sizeAndType = (res, files, callBack)=>{
   let size = files.size;
   let types = files.mimetype;
   if(size > 1024 * 1024 * 5){
      return res.json({
         message:'Dosya boyutu istenilen boyutta değil!',
         case:false
      })
   }
   else{
      if(types === 'image/jpg' || types === 'image/jpeg' || types === 'image/png' || types === 'image/gif'){
         callBack()
      }
      else{
         return res.json({
            message:'Dosya türü sadece resim olmalıdır!',
            case:false
         })
      }
   }
}

const isThereFile = (filePath)=>{
   try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return true
   } catch{
      return false
   }
}




module.exports = {names, sizeAndType, isThereFile}