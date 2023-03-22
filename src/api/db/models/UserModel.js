import hashPassword from "@/api/db/hashPassword.js"
import BaseModel from "@/api/db/models/BaseModel.js"
import PostModel from "@/api/db/models/PostModel.js"
import RoleModel from "./RoleModel"
import comparePassword from "../comparePassword"

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
      roles: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel
      }
    }
  }

  checkPassword = async (password, passwordHash, salt) => {
    const isMatched = await comparePassword(password, passwordHash, salt)
    console.log("isMatched", isMatched)
    return isMatched
  }
}

export default UserModel
