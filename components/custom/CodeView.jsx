"use client"
import { MessagesContext } from '@/app/Context/MessagesContext'
import { api } from '@/convex/_generated/api'
import Lookup from '@/data/Lookup'
import Prompts from '@/data/Prompts'
import { SandpackCodeEditor, SandpackFileExplorer, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import axios from 'axios'
import { useConvex, useMutation } from 'convex/react'
import { Loader2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { use, useContext, useEffect, useState } from 'react'

function CodeView() {
  const [activeTab, setActiveTab] = useState('code')
const [files,setFiles] = useState(Lookup.DEFAULT_FILE)
const {id}= useParams()
const {messages,setMessages}= useContext(MessagesContext)
const UpdateFiles =useMutation(api.Workspace.UpdateFiles)
const convex = useConvex()
const [loading, setLoading]= useState(false)


const GetFiles = async ()=>{
  setLoading(true)
  const result = await convex.query(api.Workspace.GetWorkspace,{
    workspacesId:id,
  })
  const mergeFiles={...Lookup.DEFAULT_FILE,...result?.fileData}
  setFiles(mergeFiles)
  setLoading(false)
}
useEffect(()=>{
id && GetFiles()
},[id])

 useEffect(() => {
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const role = messages[messages.length - 1].role;

      if (role === "user") {
        GenerateAiCode();
      }
    }
  }, [messages]); 


  const GenerateAiCode = async () => {
    setLoading(true);
  
    const PROMPT = JSON.stringify(messages) + " " + Prompts.CODE_GEN_PROMPT;
    
    try {
      // Set a timeout for 30 seconds (30000 ms)
      const result = await axios.post('/api/gen-ai-code', {
        prompt: PROMPT
      }, {
        timeout: 30000  // Set the timeout duration here (in ms)
      });
  
      const aiResp = JSON.parse(result.data.response.candidates[0].content.parts[0].text);
      
      const mergeFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      console.log(aiResp.files);
      setFiles(mergeFiles);
  
      await UpdateFiles({
        workspacesId: id,
        files: aiResp?.files
      });
  
    } catch (error) {
      // Handle errors, such as timeout or other issues
      if (error.code === 'ECONNABORTED') {
        console.error('API request timed out');
        alert('The request took too long. Please try again later.');
      } else {
        console.error('Error generating code:', error);
        alert('There was an issue generating the code.');
      }
    } finally {
      setLoading(false);
    }
  }
  


  return (
    <div className='relative'> 
      <div className="bg-[#181818] w-full p-2  border">
        <div className="flex gap-3 items-center flex-wrap justify-center rounded-full shrink-0 bg-black w-[140px]">
          <h2 
            onClick={() => setActiveTab("code")} // Pass a function reference here
            className={`text-sm cursor-pointer ${
              activeTab === 'code' ? 'text-bold text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full' : ''
            }`}
          >
            Code
          </h2>
          <h2 
            onClick={() => setActiveTab("preview")} // Same here
            className={`text-sm cursor-pointer ${
              activeTab === 'preview' ? 'text-bold text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full' : ''
            }`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider template="react" theme="dark"
      files={files}
      customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources: ['https://unpkg.com/@tailwindcss/browser@4']
      }}
    
      >
        <SandpackLayout>
          
         { activeTab =="code" ? <>
          <SandpackFileExplorer style={{ height: '80vh' }} />
          <SandpackCodeEditor style={{ height: '80vh' }} />
          </>:
          <>
          <SandpackPreview style={{ height: '80vh' }} showNavigator={true} />
          </> 
          }
        </SandpackLayout>
      </SandpackProvider>

   {loading &&   <div className=" flex p-10 bg-gray-900 opacity-80 absolute
       top-0 rounded-lg w-full h-full items-center justify-center">
        <Loader2Icon className='animate-spin h-10 w-10 text-white'/>
        <h2 className='text-white'>Generating Your Files....</h2>
      </div>}
    </div>
  
  )
}

export default CodeView
