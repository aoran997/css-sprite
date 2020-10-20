let s = '###ab##c'
function checkHav(s) {
  s = s.replace(/\w{1}#/g, '')
  if (s[0] === '#') {
    s = s.substring(1)
  }
  if (s.includes('#')) {
    return checkHav(s)
  } else {
    return s
  }
}
console.log(checkHav("du###vu##v#fbtu"))
