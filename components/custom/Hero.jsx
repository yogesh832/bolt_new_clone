"use client"
import { useState, useContext } from "react";
import { MessagesContext } from "@/app/Context/MessagesContext";
import { userDetailContext } from "@/app/Context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(userDetailContext);
  const router = useRouter();
  const createWorkspace = useMutation(api.Workspace.createWorkspace);

  const onGenerate = async (input) => {
    if (!userDetail) {
      setOpenDialog(true);
      return;
    }
    const msg = {
      role: "user",
      content: input,
    };
    setMessages(msg);

    const workspaceId = await createWorkspace({
      user: userDetail._id,
      message: [msg],
    });
    console.log(workspaceId);
    router.push("/workspace/" + workspaceId);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16 xl:mt-20 gap-4 px-4 w-full">
      <h2 className="font-bold text-4xl text-center">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-300 font-medium text-center">{Lookup.HERO_DESC}</p>

      <div
        className="p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            onChange={(e) => setUserInput(e.target.value)}
            className="bg-transparent resize-none w-full h-32 max-h-56"
            placeholder={Lookup.INPUT_PLACEHOLDER}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div className="">
          <Link className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-4">
        {Lookup.SUGGSTIONS.map((sug, index) => (
          <h2
            onClick={() => onGenerate(sug)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
          >
            {sug}
          </h2>
        ))}
      </div>

      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  );
};

export default Hero;
