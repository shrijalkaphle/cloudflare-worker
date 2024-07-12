import { connect } from "../../lib/mongodb";
import { HonoContext } from "../types/main";
import * as Realm from 'realm-web';
import dropboxController from "./dropbox.controller";
import dropboxService from "../services/dropbox.service";

const ObjectId = Realm.BSON.ObjectID;


async function listProjects(ctx: HonoContext) {

    const { limit } = ctx.req.query();
    const { db } = await connect()

    const projects = await db?.collection('projects').find({}, {
        limit: limit ? parseInt(limit) : 10
    })

    if(!projects) return ctx.json({
        message: "Something went wrong",
        status: false
    })

    await Promise.all(projects.map(async project => {
        project.thumbnail = (await dropboxService.generateTemporaryLink(project.image[0].path)).link
    }));

    return ctx.json({ projects })
}

async function getProjectById(ctx: HonoContext) {

    const { db } = await connect()

    const id = ctx.req.param('id')
    const project = await db?.collection('projects').findOne({ _id: new ObjectId(id) })

    if(!project) return ctx.json({
        message: "Project not found",
        status: false
    }, 401)

    return ctx.json({ project })
}
async function createProject(ctx: HonoContext) {

    const { db } = await connect()
    const projectCollection = db?.collection('projects')

    const body = await ctx.req.json()
    let slug = body.title
            .toString()              // Convert to string (in case it's not)
            .toLowerCase()           // Convert to lowercase
            .trim()                  // Trim whitespace from both ends
            .replace(/\s+/g, '-')    // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-');
    body.slug =`${Math.random().toString(36).substr(2, 15)}-${slug}`

    const inserted = await projectCollection?.insertOne(body)

    if(!inserted) return ctx.json({
        message: "Something went wrong",
        status: false
    }, 401)

    const project = await projectCollection?.findOne({ _id: new ObjectId(inserted.insertedId) })

    return ctx.json({ project, message: "Project created successfully", status: true })

}

async function updateProject(ctx: HonoContext) {
    const { db } = await connect()
    const projectCollection = db?.collection('projects')

    const body = await ctx.req.json()
    delete body._id
    const id = ctx.req.param('id')

    const project = await projectCollection?.updateOne({ _id: new ObjectId(id) }, { $set: body })

    return ctx.json({ project, message: "Project updated successfully", status: true })
}

async function deleteProject(ctx: HonoContext) {

    const { db } = await connect()
    const projectCollection = db?.collection('projects')

    const id = ctx.req.param('id')

    const project = await projectCollection?.findOne({ _id: new ObjectId(id) })

    // delete all images
    project.image.forEach(async (image: any) => {
        await dropboxController.removeFile(image.path)
    })

    const deleted = await projectCollection?.deleteOne({ _id: new ObjectId(id) })

    return ctx.json({ deleted, message: "Project deleted successfully", status: true })
}


export default {
    listProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
}