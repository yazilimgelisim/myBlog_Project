const nowTime = ()=>{
   const date = new Date()
   const day = date.getDate()
   const month = date.getMonth()
   const year = date.getFullYear()
   const allDate = `${day}.${month+1}.${year}`
   return allDate
}


module.exports = nowTime