import Vue from 'vue'

function formatDate(date){
  return date > 9 ? date : ('0'+ date)
}

Vue.filter('time-format', function(time){
  let standard = new Date(time);
  return `${standard.getFullYear()}-${formatDate(standard.getMonth() + 1)}-${formatDate(standard.getDate())}`
})
