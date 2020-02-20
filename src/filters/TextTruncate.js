 const text_truncate = function (str, length = 35) {
   const ending = '...';
   if (str.length > length) {
     return str.substring(0, length) + ending;
   } else {
     return str;
   }
 };

 export default text_truncate;