export class UserDTO {
    constructor(user){
        this.full_name = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
        this.documents = user.documents
        this.imageProfile = user.imageProfile
    }
}

export class UserListDTO {
    constructor(users) {
      this.users = users.map((user) => ({
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        last_connection: user.last_connection,
        _id: user._id
      }))
    }
  }
  

/*
export default class UserDB {
    static getUserTokenFrom = (user) => {
        return {
            full_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            documents: user.documents,
            imageProfile: user.imageProfile
        }
    }
}*/