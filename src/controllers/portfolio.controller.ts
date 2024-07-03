import { connect } from "../../lib/mongodb";
import { HonoContext } from "../types/main";
import * as Realm from 'realm-web';

const ObjectId = Realm.BSON.ObjectID;

async function getAll(ctx: HonoContext) {

    let response = {}
    const { db } = await connect()


    // about details
    const about = await db?.collection('about').findOne();
    const education = await db?.collection('education').find();
    const experience = await db?.collection('experience').find();
    const skills = await db?.collection('skills').find();
    const services = await db?.collection('services').find();
    const projects = await db?.collection('projects').find();
    response = { ...response, ...about, education, experience, skills, services, projects }

    return ctx.json({
        portfolio: response,
        status: true
    })
}

async function updateDetail(ctx: HonoContext) {

    const { value, column } = await ctx.req.json();

    const { db } = await connect()
    await db?.collection('about').updateOne({}, { $set: { [column]: value } })

    return ctx.json({
        message: "success",
        status: true
    })
}

async function addEducation(ctx: HonoContext) {
    let body = await ctx.req.json();
    const { db } = await connect()

    const inserted = await db?.collection('education').insertOne(body);

    if (!inserted) return ctx.json({
        message: "Something went wrong",
        status: false
    }, 401)
    const education = await db?.collection('education').findOne({ _id: new ObjectId(inserted.insertedId) });
    return ctx.json({
        education,
        message: "Education added successfully",
        status: true
    })
}

async function updateEducation(ctx: HonoContext) {
    const { db } = await connect()
    let body = await ctx.req.json();

    delete body._id
    const id = ctx.req.param('id');

    const education = await db?.collection('education').updateOne({ _id: new ObjectId(id) }, { $set: body });

    return ctx.json({
        education,
        message: "Education updated successfully",
        status: true
    })
}

async function deleteEducation(ctx: HonoContext) {
    const { db } = await connect()
    const id = ctx.req.param('id');

    const education = await db?.collection('education').deleteOne({ _id: new ObjectId(id) });

    return ctx.json({
        education,
        message: "Education deleted successfully",
        status: true
    })
}

async function addExperience(ctx: HonoContext) {
    let body = await ctx.req.json();
    const { db } = await connect()

    const inserted = await db?.collection('experience').insertOne(body);

    if (!inserted) return ctx.json({
        message: "Something went wrong",
        status: false
    }, 401)
    const experience = await db?.collection('experience').findOne({ _id: new ObjectId(inserted.insertedId) });
    return ctx.json({
        experience,
        message: "Experience added successfully",
        status: true
    })
}

async function updateExperience(ctx: HonoContext) {
    const { db } = await connect()
    let body = await ctx.req.json();

    delete body._id
    const id = ctx.req.param('id');

    const experience = await db?.collection('experience').updateOne({ _id: new ObjectId(id) }, { $set: body });

    return ctx.json({
        experience,
        message: "Experience updated successfully",
        status: true
    })
}

async function deleteExperience(ctx: HonoContext) {
    const { db } = await connect()
    const id = ctx.req.param('id');

    const experience = await db?.collection('experience').deleteOne({ _id: new ObjectId(id) });

    return ctx.json({
        experience,
        message: "Experience deleted successfully",
        status: true
    })
}

async function addSkill(ctx: HonoContext) {
    const { db } = await connect()
    const body = await ctx.req.json();

    const inserted = await db?.collection('skills').insertOne(body)

    if (!inserted) return ctx.json({
        message: "Something went wrong",
        status: false
    }, 401)
    const skills = await db?.collection('skills').findOne({ _id: new ObjectId(inserted.insertedId) });
    return ctx.json({
        skills,
        message: "Skills added successfully",
        status: true
    })
}

async function updateSkill(ctx: HonoContext) {
    const { db } = await connect()

    let body = await ctx.req.json();

    delete body._id
    const id = ctx.req.param('id');

    const skills = await db?.collection('skills').updateOne({ _id: new ObjectId(id) }, { $set: body });

    return ctx.json({
        skills,
        message: "Skill updated successfully",
        status: true
    })
}

async function deleteSkill(ctx: HonoContext) {
    const { db } = await connect()
    const id = ctx.req.param('id');

    const skills = await db?.collection('skills').deleteOne({ _id: new ObjectId(id) });

    return ctx.json({
        skills,
        message: "Skill deleted successfully",
        status: true
    })
}

async function addServices(ctx: HonoContext) {
    const { db } = await connect()
    const body = await ctx.req.json();

    const inserted = await db?.collection('services').insertOne(body)

    if (!inserted) return ctx.json({
        message: "Something went wrong",
        status: false
    }, 401)
    const services = await db?.collection('services').findOne({ _id: new ObjectId(inserted.insertedId) });
    return ctx.json({
        services,
        message: "Services added successfully",
        status: true
    })
}

async function updateServices(ctx: HonoContext) {
    const { db } = await connect()
    const body = await ctx.req.json();

    delete body._id
    const id = ctx.req.param('id');

    const services = await db?.collection('services').updateOne({ _id: new ObjectId(id) }, { $set: body });

    return ctx.json({
        services,
        message: "Services updated successfully",
        status: true
    })
}

async function deleteServices(ctx: HonoContext) {

    const { db } = await connect()
    const id = ctx.req.param('id');

    const services = await db?.collection('services').deleteOne({ _id: new ObjectId(id) });

    return ctx.json({
        services,
        message: "Services deleted successfully",
        status: true
    })
}

export default {
    getAll,
    updateDetail,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addSkill,
    updateSkill,
    deleteSkill,
    addServices,
    updateServices,
    deleteServices
}