import { DataTypes, Model } from "sequelize";
import sequelize from "../db/init";

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public mfaEnabled?: boolean;
  public mfaSecret?: string | null;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mfaSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
