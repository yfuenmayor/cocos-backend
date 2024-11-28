const boom = require('@hapi/boom');
const {isEmpty, isNil, or} = require("ramda");

class UsersService {

  constructor(models) {
    this.model = models.Users
  }


  async getAll(){
    const data = await this.model.findAll()
    return data
  }

  async getById(id){
    const data = await this.model.findByPk(id)
    if(or(isEmpty(data), isNil(data)))
      throw boom.notFound("user not found")
    return data
  }


}

module.exports = UsersService
