import RoleModel from "../models/role.model.js";
import { Op } from "sequelize";
export const createRole = async (ctx) => {
    try {
        const body = ctx.request.body;
        const newRole = await RoleModel.create(body,
            { raw: true }
        );
        ctx.status = 201;
        ctx.body = newRole;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error creating role";
        console.log(error);
    }
}

export const duplicateRole = async (ctx) => {
    try {
        const roleId = ctx.params.id;
        const roleData = await RoleModel.findOne({
            where: { id: roleId },
            raw: true
        });
        if (!roleData) {
            ctx.status = 404;
            ctx.body = "Role not found";
            return;
        }
        delete roleData.id; // remove id to avoid conflict
        roleData.name = roleData.name + "_copy_" + `${Date.now()}`; // modify name to ensure uniqueness
        const duplicatedRole = await RoleModel.create(roleData, { raw: true });
        ctx.status = 201;
        ctx.body = duplicatedRole;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error duplicating role";
        console.log(error);
    }
}

export const updateRole = async (ctx) => {
    try {
        const body = ctx.request.body;
        const roleId = ctx.params.id;
        const [result] = await RoleModel.update(body, {
            where: { id: roleId }
        });
        console.log(result);
        if (result !== 0) {
            ctx.status = 200;
            ctx.body = "Role updated successfully";
            return
        }
        ctx.status = 404;
        ctx.body = "Role not found or no changes!";
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error updating role";
        console.log(error);
    }
}

export const deleteRole = async (ctx) => {
    try {
        const roleId = ctx.params.id;
        const result = await RoleModel.destroy({
            where: { id: roleId }
        });
        if (result !== 0) {
            ctx.status = 200;
            ctx.body = "Role deleted successfully";
            return;
        }
        ctx.status = 404;
        ctx.body = "Role not found!";
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = "Error deleting role";
        console.log(error);
    }
}

export const getRolesBySearch = async (ctx) => {
    try {
        const keyword = ctx.query.name?.trim();
        console.log(keyword);

        if (!keyword) {
            ctx.status = 400;
            ctx.body = "Missing search keyword";
            return;
        }

        const roles = await RoleModel.findAll({
            where: {
                name: { [Op.like]: `%${keyword}%` }
            },
            raw: true
        });
        if (!roles.length) {
            // ctx.status = 404;
            ctx.body = [];
            return;
        }
        ctx.body = roles;
        ctx.status = 200;
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = "Error fetching role";
        console.log(error);
    }
}

export const getRoles = async (ctx) => {
    try {
        const index = Number(ctx.query.index) || 0
        const [roles, total] = await Promise.all([
            RoleModel.findAll({
                raw: true,
                limit: 10,
                offset: index * 10,    // skip index*10 records
            }),
            RoleModel.count(),        // total records
        ]);
        ctx.body = {
            roles,
            total,
        };
        ctx.status = 200;
    } catch (error) {
        ctx.status = 500;
        ctx.body = "Error fetching roles";
        console.log(error);
    }
}

export const getRole = async (ctx) => {
    try {
        const name = ctx.params.id;
        console.log("name", name);

        if (!name) {
            ctx.status = 400
            ctx.body = "Missing param important."
            return
        }
        const rule = await RoleModel.findOne({
            where: {
                name: name
            },
            raw: true
        })
        console.log(rule);

        if (!rule) {
            ctx.status = 404
            ctx.body = "Not found rule."
            return
        }
        ctx.status = 200
        ctx.body = rule
    } catch (error) {
        ctx.status = 500
        ctx.body = "Error from server."
    }

}