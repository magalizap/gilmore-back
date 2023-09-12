/*export default class UserDB {
    constructor(user){
        this.full_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
    }
}*/

export default class UserDB {
    static getUserTokenFrom = (user) => {
        return {
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            documents: user.documents
        }
    }
}