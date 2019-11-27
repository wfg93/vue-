import admin from './admin'
import permission from './permission'
import curriculum from './curriculum'
import user  from "./user"
import market from './market'
import Coursetobuy from './Coursetobuy'
import PaycostApi from "./Paycost"

const api = {
    adminApi: admin,
    authApi: permission,
    curriculumApi:curriculum,
    userApi:user,
    marketApi:market,
    CourseApi:Coursetobuy,
    PaycostApi:PaycostApi
}

export default api