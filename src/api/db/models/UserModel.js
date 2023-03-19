import hashPassword from "@/api/db/hashPassword.js"
import BaseModel from "@/api/db/models/BaseModel.js"
import PostModel from "@/api/db/models/PostModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.userId",
        },
      },
      drafts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.userId",
          modify: (query) => query.whereNull("publishedAt"),
        },
      },
      publishedPosts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.userId",
          modify: (query) => query.whereNotNull("publishedAt"),
        },
      },
    }
  }

  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.passwordSalt)

    return passwordHash === this.passwordHash
  }
}

export default UserModel
