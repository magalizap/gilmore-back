export default class UserResponse {
    constructor(user){
        this.first_name = user.full_name.split(' ')[0]
        this.last_name = user.full_name.split(' ')[1]
        this.email = user.email
        this.role = user.role
        this.documents = user.documents
    }
}