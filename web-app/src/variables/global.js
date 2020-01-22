var global_temp
try{
    global_temp = JSON.parse(localStorage.getItem('global'));
}catch{
    global_temp = null
}
const global = global_temp
export default global
