// use : node ./utils/fakers.js to 10 users


const fakerApp = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const knex = require('knex');
const knexConfig = require('../knexfile');


const generateRole = () => {
    return [
        {
            name: "administrateur",
            autorisation: "CRUD"
        },
        {
            name: "gestionnaire",
            autorisation: "CRU"
        },
        {
            name: "editeur",
            autorisation: "R"
        }
    ]
}

const generateUsers = async (count, roleIds) => {
    let users = []
    for (let i = 0; i < count; i++) {
        const randomUserIdIndex = Math.floor(Math.random() * roleIds.length);
        const password = fakerApp.faker.internet.password()
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = {
            name: fakerApp.faker.name.firstName(),
            lastName: fakerApp.faker.name.lastName(),
            email: fakerApp.faker.internet.email(),
            password: hashedPassword.toString(),
            roleId: roleIds[randomUserIdIndex]
        };

        users.push(user)
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
            publishedAt: new Date(),
            slug_url: fakerApp.faker.lorem.text(),
            status: Math.random() < 0.5 ? 0 : 1,
            userId: userIds[randomUserIdIndex]
        }

        posts.push(post)
    }

    return posts


}

const insertData = async () => {

    const db = knex(knexConfig);
    const roles = generateRole()
    // console.log("database config:", users)


    try {
        const rolesRows = await db("roles").insert(roles).returning('id')
        const rolesIds = rolesRows.map((row) => row.id);
        const users = await generateUsers(10, rolesIds)
        const usersRows = await db("users").insert(users).returning('id')
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