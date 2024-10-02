import { Router, Request, Response } from 'express';
import { authentication, authorisation } from '../middlewares/authMiddleware'
// import logger from "../middlewares/LogginTool";
import { Op } from 'sequelize';
import Blog from '../models/blogModel';

const BlogRouter = Router();

// http://localhost:8000/api/blog?page=1&limit=3&sortBy=title&order=DESC



BlogRouter.get('/blog', async (req: Request, res: Response): Promise<void> => {
    try {
        // logger.info("Request received on /blog route");
        const { page = 1, limit = 1, sortBy = 'title', order = 'ASC', search = '' } = req.query;

        // Convert page and limit to integers
        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        // Set offset for pagination (skip records)
        const offset = (pageNumber - 1) * limitNumber;

        // Build search condition (if search query is provided)
        const searchCondition = search ? {
            title: {
                [Op.iLike]: `%${search}%`  // Using iLike for case-insensitive search
            }
        } : {};

        const sortOrder = typeof order === 'string' ? order.toUpperCase() : 'ASC'; // Default to 'ASC' if not a string
        const sortField = typeof sortBy === 'string' ? sortBy : 'title'; // Default to 'title' if not a string

        // Fetch blogs with pagination, sorting, and search
        const blogs = await Blog.findAndCountAll({
            where: searchCondition,  // Search filter
            limit: limitNumber,      // Pagination: limit number of records
            offset: offset,          // Pagination: skip number of records
            order: [[sortField, sortOrder]],  // Sorting
        });

        // Response with blogs and pagination details
        res.status(200).json({
            totalBlogs: blogs.count,             // Total blogs
            currentPage: pageNumber,             // Current page
            totalPages: Math.ceil(blogs.count / limitNumber),  // Total pages
            blogs: blogs.rows                    // Blogs data
        });
    } catch (error) {
        // logger.error("Error while fetching data from /blog", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "Error while fetching blogs" });
    }
});

BlogRouter.post('/blog/add', authentication, authorisation(['admin']), async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, blogdetail, image } = req.body;
        const blogCreated = await Blog.create({ title, blogdetail, image });
        res.status(201).json({ blogCreated });
    } catch (error) {
        // logger.error("Error while adding blog", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "Error while adding blog" });
    }
});

BlogRouter.delete('/blog/:id', authentication, authorisation(['admin']), async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        // Find the blog by primary key (id)
        const blog = await Blog.findByPk(id);
        // Check if the blog exists
        if (!blog) {
            res.status(404).json({ error: "Blog not found" });
            return;
        }
        // Delete the blog
        await blog.destroy();
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        // logger.error("Error while deleting blog", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "Error while deleting blog" });
    }
});

BlogRouter.put('/blog/:id', authentication, authorisation(['admin']), async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, blogdetail, image } = req.body;
    try {
        // Find the blog by primary key (id)
        const blog = await Blog.findByPk(id);
        // Check if the blog exists
        if (!blog) {
            res.status(404).json({ error: "Blog not found" });
            return;
        }
        // Update the blog
        await blog.update({ title, blogdetail, image });
        res.status(200).json({ message: "Blog updated successfully" });
    } catch (error) {
        // logger.error("Error while updating blog", error instanceof Error ? error.message : "Unknown error");
        res.status(500).json({ error: "Error while updating blog" });
    }
});

export default BlogRouter;
