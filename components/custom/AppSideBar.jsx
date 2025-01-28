import React from 'react'
import { FaBolt } from "react-icons/fa";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { Button } from '../ui/button';
import { MessageCircleCode } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import SideBarFooter from './SideBarFooter';
function AppSideBar() {
  return (
    <Sidebar>
    <SidebarHeader className="p-5" >
              <FaBolt className="w-10 h-10 "  />
        <Button className="mt-5 bg-white text-black"> <MessageCircleCode/>Start New Chat </Button>
        
    </SidebarHeader>
    <SidebarContent className="p-5  ">
      <SidebarGroup >
        <WorkspaceHistory/>
      </SidebarGroup>
      {/* <SidebarGroup /> */}
    </SidebarContent>
    <SidebarFooter >
        <SideBarFooter/>
    </SidebarFooter>
  </Sidebar>
  )
}

export default AppSideBar