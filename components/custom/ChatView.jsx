"use client";
import { MessagesContext } from "@/app/Context/MessagesContext";
import { userDetailContext } from "@/app/Context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompts from "@/data/Prompts";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown"; 
import { useSidebar } from "../ui/sidebar";
import { UpdateToken } from "@/convex/Users"; // Check the correct path to your Users module


export const countToken =(inputText)=>{
  return  inputText.trim().split(/\s+/).filter(word=>word).length;
}

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();

  // Correct usage of useContext to get messages and setMessages
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(userDetailContext);
  const [userInput, setUserInput] = useState();
  const UpdateMutation = useMutation(api.Workspace.UpdateMessage)
const [loading,setLoading] = useState(false)
const {toggleSidebar}= useSidebar()
// const UpdateToken = useMutation(api.Users.UpdateToken)


  // Fetch data on id change
  useEffect(() => {
    if (id) {
      GetWorkspaceData();
    }
  }, [id]);


  // Fetch workspace data
  const GetWorkspaceData = async () => {
    try {
      const result = await convex.query(api.Workspace.GetWorkspace, {
        workspacesId: id,
      });
      
      if (result && result.message) {
        setMessages(result.message);
      } else {
        console.error("No valid messages found in API response");
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  // Function to get AI response based on messages
  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompts.CHAT_PROMPT;
    try {
      const result = await axios.post("/api/ai-chat", {
        prompt: PROMPT,
      });
      console.log(userDetail._id);
  
      const AiResponse = result.data.result.candidates[0].content.parts[0].text;
      const aiResp = {
        role: "ai",
        content: AiResponse,
      };
      setMessages((prev) => [
        ...prev,
        aiResp,
      ]);
  
      await UpdateMutation({
        message: [...messages, aiResp],
        workspacesId: id,
      });
  
      // Update the token
      const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
  
      // Add debugging logs to check values before mutation
      console.log('User ID:', userDetail?._id);
      console.log('Current token:', userDetail?.token);
      console.log('Updated token:', token);
  
      // Properly await the mutation result
      const updateTokenResult = await UpdateToken({
        userId: userDetail?._id,
        token: token,
      });
  
      console.log('Token updated in database:', updateTokenResult);
  
      setLoading(false);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setLoading(false);
    }
  };
  

  // Effect to trigger AI response when new message is added
  useEffect(() => {
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const role = messages[messages.length - 1].role;

      if (role === "user") {
        GetAiResponse();
      }
    }
  }, [messages]); 
// console.log(messages);/


return (
    <div className="relative h-[80vh]  flex flex-col ">
    <div className="flex-1 scrollbar-hide  pl-5 overflow-y-scroll">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              className="p-3 flex gap-3 mb-3 justify-center items-center rounded-lg"
              key={index}
              style={{
                backgroundColor: Colors.CHAT_BACKGROUND,
              }}
            >
              {/* {console.log(message.role)} */}
              {message.role=="user" && (
                <Image
                  src={userDetail?.picture || "default-placeholder.png"} // Use a fallback image
                  alt="user image"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              {/* Render message.content */}
              <ReactMarkdown className="flex flex-col">{message.content}</ReactMarkdown>
           
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
           {
              loading &&<div className="p-3 flex gap-3 mb-3 justify-center items-center rounded-lg"
              style={{
                backgroundColor: Colors.BACKGROUND,
              }}>
                <Loader2Icon className="animate-spin  "
                  />
                <h2>Generating response...</h2>
              </div>
              }
      </div>
      {/* Input section */}
      <div className="flex gap-2 items-end">
    {  userDetail && <Image onClick={toggleSidebar} className="rounded-full cursor-pointer" src={userDetail?.picture} alt="picture" width={30} height={30}/>}
      <div
        className=" p-5 border rounded-xl max-w-xl w-full mt-3"
        style={{
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        <div className="flex gap-2">
          <textarea
          value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="bg-transparent resize-none w-full h-32 max-h-56"
            placeholder={Lookup.INPUT_PLACEHOLDER}
          />
          {userInput && (
            <ArrowRight
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { role: "user", content: userInput },
                ]);
                
                setUserInput(""); // Clear input after sending
              }}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div className="">
          <Link className="w-5 h-5" />
        </div>
      </div>
      </div>
    </div>
  );
}

export default ChatView;
