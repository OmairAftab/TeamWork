import "dotenv/config";
import mongoose from "mongoose";
import {connectDatabase} from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
  console.log("Seeding roles started...");


  //This file is a database seeding script. Its job is to put the predefined roles and their permissions from RolePermissions into MongoDB.
  
  try {
    await connectDatabase();

    const session = await mongoose.startSession();  //A session allows  to perform multiple database operations as one transaction.
    session.startTransaction();

    console.log("Clearing existing roles...");
    await RoleModel.deleteMany({}, { session }); //Delete all documents from the roles collection.

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;   //contains key mean if Member has permissions ["viewonly"]  then here role=Member
      const permissions = RolePermissions[role];                //RolePermissions[Member]=["viewonly"]. so now permissions=["viewonly"]

      // Check if the role already exists
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session
      );
      if (!existingRole) {
        const newRole = new RoleModel({
          name: role,
          permissions: permissions,
        });
        await newRole.save({ session });
        console.log(`Role ${role} added with permissions.`);
      } else {
        console.log(`Role ${role} already exists.`);
      }
    }

    await session.commitTransaction();   //"Everything succeeded. Permanently apply all the database changes."
    console.log("Transaction committed.");

    session.endSession();
    console.log("Session ended.");

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

seedRoles().catch((error) =>
  console.error("Error running seed script:", error)
);