import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// Define the attributes for the Blog model
interface BlogAttributes {
    id: number;
    title: string;
    blogdetail: string;
    image: string;
}

// Optional attributes for creation
interface BlogCreationAttributes extends Optional<BlogAttributes, 'id'> {}

// Define the Blog model
class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
    public id!: number;
    public title!: string;
    public blogdetail!: string;
    public image!: string;

    // timestamps can be added here if you decide to include them later
    // public readonly createdAt!: Date;
    // public readonly updatedAt!: Date;
}

// Initialize the Blog model
Blog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        blogdetail: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize, // passing the `sequelize` instance is required
        tableName: 'blog',
        timestamps: false,
    }
);

export default Blog;
