import Image from "next/image";
import React, { useContext } from "react";
import { FaBolt } from "react-icons/fa";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { userDetailContext } from "@/app/Context/UserDetailContext";

function Header() {
const {userDetail, setUserDetail} = useContext(userDetailContext);
  return (
    <div className="p-4 flex justify-between items-center">
      <FaBolt className="w-10 h-10 "  />
      
      {!userDetail && <div className=" flex gap-5">
        <Button variant="ghost">Sign In</Button>
        <Button className="text-white" style={{
            backgroundColor:Colors.BLUE
        }}>Log In</Button>
        </div>}
    </div>
  );
}

export default Header;
