import { DataTypes, Model } from "sequelize";
import sequelize from "../db/init";

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tokenVersion: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public tokenVersion!: number;
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Default token version is 0
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

export default User;
