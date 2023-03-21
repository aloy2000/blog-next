const { default: BaseModel } = require("./BaseModel");
const { default: UserModel } = require("./UserModel");

class RoleModel extends BaseModel {
    static tableName = "roles"

    static relationMappings() {
        return {
            users: {
                relation: BaseModel.HasManyRelation,
                modelClass: UserModel,
                join: {
                    from: "roles.id",
                    to: "users.roleId",
                },

            }
        }
    }
}

export default  RoleModel