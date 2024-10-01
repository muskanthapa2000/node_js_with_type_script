import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface blogAttributes {
    id : number;
    title : string;
    blogdetail : string;
    image : string;
}

interface blogCreationAttributes extends Optional<blogAttributes, 'id'> {}

class Blog extends Model<blogAttributes , blogCreationAttributes> implements blogAttributes {
    public id!: number;
    public title!: string;  
    public blogdetail!: string;
    public image!: string;
}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blogdetail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // Passing the sequelize instance
    timestamps: false, // Disable automatic timestamp columns (createdAt, updatedAt)
  })

  export default Blog;