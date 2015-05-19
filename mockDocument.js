 var mockDocument = {
     value_: {},

     get cookie() {
         var output = [];
         for (var cookieName in this.value_) {
             output.push(cookieName + "=" + this.value_[cookieName]);
         }
         return output.join(";");
     },

     set cookie(s) {
         if (s) {
             var indexOfSeparator = s.indexOf("=");
             var key = s.substr(0, indexOfSeparator);
             var value = s.substring(indexOfSeparator + 1);
             this.value_[key] = value;
             return key + "=" + value;
         }
     }
 };
