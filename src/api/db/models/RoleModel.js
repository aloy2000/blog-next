import BaseModel from '@/api/db/models/BaseModel.js'
import UserModel from '@/api/db/models/UserModel'

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