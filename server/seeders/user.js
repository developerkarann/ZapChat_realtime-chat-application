const User = require('../models/userModel')
const { faker } = require('@faker-js/faker')

const createUser = async (numOfUser) => {
    try {
        const usersPromise = []

        for (let i = 0; i < numOfUser; i++) {
            const tempUser = User.create({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(),
                password: 'password',
                avatar: {
                    url: faker.image.avatar(),
                    public_id: faker.system.fileName(),
                }
            })
            usersPromise.push(tempUser)
        }
        await Promise.all(usersPromise)
       
        console.log('Users created', numOfUser)
        process.exit(1)

    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

createUser(10)

module.exports= createUser