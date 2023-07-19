export default class UserDB {
    constructor(user){
        this.full_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.password = user.password
        this.role = user.role
    }
}