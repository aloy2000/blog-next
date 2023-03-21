// use : node ./utils/fakers.js to 10 users


const fakerApp = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const knex = require('knex');
const knexConfig = require('../knexfile');


const generateUsers = async (count) => {
    let users = []
    for (let i = 0; i < count; i++) {
        const password = fakerApp.faker.internet.password()
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const post = {
            displayName: fakerApp.faker.name.firstName(),
            email: fakerApp.faker.internet.email(),
            passwordHash: hashedPassword.toString(),
            passwordSalt: salt.toString()

        };

        users.push(post)
    }

    return users;
}

const generatePosts = async (count, userIds) => {
    let posts = []
    for (let i = 0; i < count; i++) {
        const randomUserIdIndex = Math.floor(Math.random() * userIds.length);
        const post = {
            title: fakerApp.faker.lorem.sentence().toString(),
            content: fakerApp.faker.lorem.paragraphs(),
            userId: userIds[randomUserIdIndex]
        }

        posts.push(post)
    }

    return posts


}

const insertData = async () => {

    const db = knex(knexConfig);
    const users = await generateUsers(10)
    // console.log("database config:", users)


    try {
        const usersRows = await db("users").insert(users).returning('id');
        const userIds = usersRows.map((row) => row.id);

        const posts = await generatePosts(10, userIds)
        await db("posts").insert(posts)
        console.log(" users inserted successfully")
    } catch (error) {
        console.log("error on insert data in database:", error);
    }
    finally {
        db.destroy();
    }

}

insertData();