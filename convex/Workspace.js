import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createWorkspace = mutation({
  args: {
    message: v.any(),
    user: v.optional(v.id('users'))  // Ensure this field is passed with a valid user ID
  },
  handler: async (ctx, args) => {
    const workspacesId = await ctx.db.insert('workspaces', {
      message: args.message,
      user: args.user
    });
    return workspacesId;
  }
});


export const GetWorkspace = query({
  args:{
    workspacesId:v.id('workspaces')
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspacesId)
    return workspace;
  }
});


export const UpdateMessage = mutation({
  args:{
    workspacesId: v.id('workspaces'),
    message: v.any()
  },
  handler:async (ctx, args) => {
    const result= await ctx.db.patch(args.workspacesId,{
      message:args.message
    });
    return result;
  }
})
export const UpdateFiles = mutation({
  args:{
    workspacesId: v.id('workspaces'),
    files:v.any()
  },
  handler:async (ctx, args) => {
    const result= await ctx.db.patch(args.workspacesId,{
      fileData:args.files
    });
    return result;
  }
})

export const GetAllWorkspace = query({
  args: {
    userId: v.optional(v.id("users")), // Ensure it matches DB type
  },
  handler: async (ctx, args) => {
    console.log("Received userId in query:", args.userId);

    if (!args.userId) {
      console.error("User ID is missing in the query");
      return [];
    }

    try {
      // // Fetch all workspaces without filtering
      // const allWorkspaces = await ctx.db.query('workspaces').collect();
      // console.log("All workspaces in DB:", allWorkspaces);

      // Check userId type
      console.log("Type of userId:", typeof args.userId);

      // Fetch workspaces with filter
      const result = await ctx.db
        .query('workspaces')
        .filter(q => q.eq(q.field('user'), args.userId)) // Ensure field names match DB schema
        .collect();
      // console.log("Filtered workspaces for user:", result);

      return result;
    } catch (error) {
      console.error("Error querying database:", error);
      return [];
    }
  },
});



