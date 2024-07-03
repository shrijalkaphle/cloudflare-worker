import { connect } from "../../lib/mongodb";
import * as Realm from 'realm-web';
import { HonoContext } from "../types/main";
import dropboxController from "./dropbox.controller";

const ObjectId = Realm.BSON.ObjectID;

async function getAllBlogs(ctx: HonoContext) { 

    const { db } = await connect()
    const blogCollection = db?.collection('blogs')

    let {perPage, page} = ctx.req.query()
    if(!perPage) perPage = '10'
    if(!page) page = '1'

    const blogs = await blogCollection?.aggregate([
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $sort: { _id: -1 } },
                    { $skip: (parseInt(perPage) * (parseInt(page) - 1)) },
                    { $limit: parseInt(perPage) }
                ]
            }
        }
    ])
    return ctx.json(blogs)
}

async function getOneBySlug(ctx: HonoContext) {
    const { db } = await connect()
    const blogCollection = db?.collection('blogs')

    const slug = ctx.req.param('slug')
    const blog = await blogCollection?.findOne({ slug })
    return ctx.json({ blog, slug })
}

async function createBlog(ctx: HonoContext) {
    const { db } = await connect()
    const blogCollection = db?.collection('blogs')

    const body = await ctx.req.json()
    const blog = await blogCollection?.insertOne(body)
    return ctx.json({ blog })
}

async function deleteBlogById(ctx: HonoContext) {
    const { db } = await connect()
    const blogCollection = db?.collection('blogs')

    const id = ctx.req.param('id')

    const project = await blogCollection?.findOne({ _id: new ObjectId(id) })

    await dropboxController.removeFile(project.featured_image)

    const deleted = await blogCollection?.deleteOne({ _id: new ObjectId(id) })

    return ctx.json({deleted, message: "Blog deleted successfully", status: true })
}

export default {
    getAllBlogs,
    getOneBySlug,
    createBlog,
    deleteBlogById
}