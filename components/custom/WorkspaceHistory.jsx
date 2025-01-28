"use client";
import { userDetailContext } from "@/app/Context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";

function WorkspaceHistory() {
  const { userDetail } = useContext(userDetailContext);
  const convex = useConvex();
const [workspacesList, setWorkspaceList]= useState()
const {toggleSidebar}= useSidebar()
  useEffect(() => {
    if (userDetail && userDetail._id) {
      console.log("User ID available in context:", userDetail._id);
    } else {
      console.log("User ID is missing or undefined");
    }
  }, [userDetail]);
  
  // Debugging the userDetail context
  useEffect(() => {
    
    if (userDetail && userDetail._id) {
      console.log("User ID available:", userDetail._id);
      GetAllWorkspace();
    } else {
      console.log("User ID is not available yet");
    }
  }, [userDetail]);  // Runs when userDetail changes

  const GetAllWorkspace = async () => {
    try {
      if (!userDetail?._id) {
        console.error("User ID is missing");
        return;
      }

      // Perform the query
      const result = await convex.query(api.Workspace.GetAllWorkspace, {
        userId: userDetail._id, // Pass the user ID here
      });

      // Log the result to check if it's empty or has data
      console.log("Fetched workspaces:", result);
      setWorkspaceList(result);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Your Chats</h2>
      {
  workspacesList &&
  workspacesList.map((workspace, index) => (
    <Link key={index} href={"/workspace/"+ workspace?._id}>
    <h2 onClick={toggleSidebar} className="text-sm text-gray-400 py-1 font-light hover:text-white cursor-pointer" key={index}>
      {workspace.message[0].content}
    </h2>
    </Link>
  ))
}

    </div>
  );
}

export default WorkspaceHistory;
