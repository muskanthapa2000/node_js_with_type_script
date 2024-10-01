import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db'; // Import sequelize instance from your config

// Interface for the attributes in the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  otp: number;
  role: string;
}

// Optional properties for model creation (id and otp can be optional when creating)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'otp'> {}

// Define the User class which extends the Sequelize Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public mobile!: string;
  public otp!: number;
  public role!: string;
}

// Initialize the User model
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  sequelize, // Passing the sequelize instance
//   tableName: 'users',
  timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
});

export default User;
