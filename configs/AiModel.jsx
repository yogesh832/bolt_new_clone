const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const CodeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

   export const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  


  export const GenAiCode = model.startChat({
    generationConfig:CodeGenerationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Create ToDo App in React  Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, \nwithout any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\nalso you can use date-fns for date format and react-chartjs-2 chart, graph library\n\nReturn the response in JSON format with the following schema:\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\n\nHere’s the reformatted and improved version of your prompt:\n\nGenerate a programming code structure for a React project using Vite. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from \"lucide-react\" and use it in JSX as <Heart className=\"\" />.\n\nReturn the response in JSON format with the following schema:\n\njson\nCopy code\n{\n  \"projectTitle\": \"\",\n  \"explanation\": \"\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"\"\n    },\n    ...\n  },\n  \"generatedFiles\": []\n}\nEnsure the files field contains all created files, and the generatedFiles field lists all the filenames. Each file's code should be included in the code field, following this example:\nfiles:{\n  \"/App.js\": {\n    \"code\": \"import React from 'react';\\nimport './styles.css';\\nexport default function App() {\\n  return (\\n    <div className='p-4 bg-gray-100 text-center'>\\n      <h1 className='text-2xl font-bold text-blue-500'>Hello, Tailwind CSS with Sandpack!</h1>\\n      <p className='mt-2 text-gray-700'>This is a live code editor.</p>\\n    </div>\\n  );\\n}\"\n  }\n}\n  Additionally, include an explanation of the project's structure, purpose, and functionality in the explanation field. Make the response concise and clear in one paragraph.\n  - When asked then only use this package to import, here are some packages available to import and use (date-fns,react-chartjs-2,\"firebase\",\"@google/generative-ai\" ) only when it required\n  \n  - For placeholder images, please use a https://archive.org/download/placeholder-image/placeholder-image.jpg\n  -Add Emoji icons whenever needed to give good user experinence\n  - all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\n- By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\n- Use icons from lucide-react for logos.\n\n- Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n   `,\n\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n{\n  \"projectTitle\": \"React ToDo App\",\n  \"explanation\": \"This React ToDo application provides a user-friendly interface to manage tasks. It features components for adding new tasks, listing all tasks, marking tasks as complete, and deleting tasks. The project is structured with separate components for better organization and uses Tailwind CSS for styling. It includes the use of lucide-react for icons to enhance the user interface. The app leverages React's state management to handle dynamic updates of the ToDo list.\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\nimport TaskList from './components/TaskList';\\nimport AddTask from './components/AddTask';\\nimport { Clock } from 'lucide-react';\\n\\nfunction App() {\\n  const [tasks, setTasks] = useState(() => {\\n    const savedTasks = localStorage.getItem('tasks');\\n    return savedTasks ? JSON.parse(savedTasks) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('tasks', JSON.stringify(tasks));\\n  }, [tasks]);\\n\\n  const addTask = (newTask) => {\\n    setTasks([...tasks, newTask]);\\n  };\\n\\n  const toggleTask = (id) => {\\n    setTasks(tasks.map(task =>\\n      task.id === id ? { ...task, completed: !task.completed } : task\\n    ));\\n  };\\n\\n  const deleteTask = (id) => {\\n    setTasks(tasks.filter(task => task.id !== id));\\n  };\\n\\n  return (\\n    <div className=\\\"flex flex-col min-h-screen bg-gray-100\\\">\\n      <header className=\\\"bg-gradient-to-r from-teal-500 to-teal-700 p-6 flex items-center justify-between\\\">\\n        <h1 className=\\\"text-3xl font-bold text-white\\\">My ToDo List 📝</h1>\\n         <div className=\\\"flex items-center text-white gap-2\\\">\\n         <Clock className=\\\"h-6 w-6\\\" /> <p>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>\\n          </div>\\n\\n      </header>\\n      <main className=\\\"flex-1 p-8\\\">\\n        <AddTask addTask={addTask} />\\n        <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />\\n      </main>\\n       <footer className=\\\"bg-gray-800 text-white p-4 text-center\\\">\\n        <p> &copy; {new Date().getFullYear()} ToDo App. All rights reserved.</p>\\n      </footer>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n\"\n    },\n    \"/components/AddTask.js\": {\n      \"code\": \"import React, { useState } from 'react';\\nimport { Plus } from 'lucide-react';\\n\\nconst AddTask = ({ addTask }) => {\\n  const [newTaskText, setNewTaskText] = useState('');\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if (newTaskText.trim() === '') return;\\n    const newTask = {\\n      id: Date.now(),\\n      text: newTaskText,\\n      completed: false,\\n    };\\n    addTask(newTask);\\n    setNewTaskText('');\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"mb-6 flex\\\">\\n      <input\\n        type=\\\"text\\\"\\n        className=\\\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2\\\"\\n        placeholder=\\\"Add new task...\\\"\\n        value={newTaskText}\\n        onChange={(e) => setNewTaskText(e.target.value)}\\n      />\\n      <button type=\\\"submit\\\" className=\\\"bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline\\\">\\n          <Plus className='h-5 w-5'/>\\n      </button>\\n    </form>\\n  );\\n};\\n\\nexport default AddTask;\\n\"\n    },\n    \"/components/TaskList.js\": {\n      \"code\": \"import React from 'react';\\nimport { Trash, Check, Edit } from 'lucide-react';\\n\\nconst TaskList = ({ tasks, toggleTask, deleteTask }) => {\\n  return (\\n    <ul className=\\\"divide-y divide-gray-200\\\">\\n      {tasks.length === 0 ? (<p className='text-center text-gray-500'>No tasks yet. Add one!</p>) : (tasks.map(task => (\\n        <li key={task.id} className=\\\"py-3 flex items-center justify-between\\\">\\n          <div className='flex items-center'>\\n            <input\\n              type=\\\"checkbox\\\"\\n              className=\\\"mr-3 h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer\\\"\\n              checked={task.completed}\\n              onChange={() => toggleTask(task.id)}\\n            />\\n            <span className={`text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>\\n              {task.text}\\n            </span>\\n          </div>\\n           <div className='flex gap-2'>\\n           <button onClick={()=>console.log(\\\"edit\\\")} className=\\\"text-gray-500 hover:text-gray-700 focus:outline-none\\\">\\n                  <Edit className='h-4 w-4'/>\\n            </button>\\n            <button onClick={() => deleteTask(task.id)} className=\\\"text-red-500 hover:text-red-700 focus:outline-none\\\">\\n              <Trash className='h-4 w-4'/>\\n            </button>\\n           </div>\\n        </li>\\n      )))} \\n    </ul>\\n  );\\n};\\n\\nexport default TaskList;\\n\"\n    }\n   \n  },\n  \"generatedFiles\": [\n    \"/App.js\",\n    \"/components/AddTask.js\",\n    \"/components/TaskList.js\"\n  ]\n}\n```\n"},
        ],
      },
    ],
  })





// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash-exp",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function run() {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [],
//   });

//   const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//   console.log(result.response.text());
// }

// run();
