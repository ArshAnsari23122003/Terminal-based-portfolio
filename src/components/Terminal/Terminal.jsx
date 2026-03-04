import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

/**
 * HELPING COMMANDS FOR THE USER:
 * ---------------------------------------------------------
 * - ls                   : List directories
 * - cd <dir>             : Enter a directory (e.g., cd projects)
 * - cat <file>           : Read a file (e.g., cat skills.txt)
 * - whoami               : Personal bio
 * - contact              : Start interactive contact wizard
 * - clear                : Clear terminal screen
 * - <link_name>          : Type a site name (e.g., github, linkedin) to open it
 * - <project_name>       : Type a project (e.g., chat-app, ecommerce) to open it
 * ---------------------------------------------------------
 */

const Terminal = () => {
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~');
  
  // States for Command History (Arrow Key behavior)
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const [history, setHistory] = useState([
    { type: 'system', content: 'Microsoft Windows [Version 10.0.22631.4460]' },
    { type: 'system', content: '(c) Microsoft Corporation. All rights reserved.' },
    { type: 'system', content: '' },
    { type: 'system', content: 'ArshAnsari@NITW-LAPTOP MINGW64 ~' },
    { type: 'system', content: '--- NAVIGATION GUIDE ---' },
    { type: 'system', content: '> Type "ls" to see folders.' },
    { type: 'system', content: '> Type "cd <folder_name>" to enter (e.g., cd projects).' },
    { type: 'system', content: '> Type "ls" again inside a folder to see detailed descriptions.' },
    { type: 'system', content: '> Type "contact" or "mail" to start the interactive form.' },
    { type: 'system', content: '> Use UP/DOWN arrows to navigate command history.' },
    { type: 'system', content: '> Press [TAB] to autocomplete commands or directories.' },
    { type: 'system', content: '------------------------' },
  ]);

  const [wizardStep, setWizardStep] = useState(0); 
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Autocomplete Data
  const COMMAND_LIST = ['ls', 'cd', 'cat', 'whoami', 'contact', 'mail', 'clear', 'help', 'github', 'linkedin', 'leetcode', 'codechef', 'codeforces', 'ecommerce', 'chat-app', 'dna'];
  const DIR_LIST = ['experience', 'projects', 'socials', 'education', 'achievements'];
  const FILE_LIST = ['skills.txt'];

  // Links Data
  const links = {
    github: "https://github.com/ArshAnsari23122003",
    leetcode: "https://leetcode.com/u/ArshAnsari/",
    codechef: "https://www.codechef.com/users/arshnitw",
    codeforces: "https://codeforces.com/profile/arshAnsari50",
    linkedin: "https://www.linkedin.com/in/arsh-ansari-317b62271/",
    ecommerce: "https://fullstack-web-ecommerce-frontend.vercel.app/",
    "ecommerce-git": "https://github.com/ArshAnsari23122003/fullstack-web-ecommerce",
    "chat-app": "https://fullstack-chat-app-o56d.onrender.com/",
    "chat-git": "https://github.com/ArshAnsari23122003/fullstack-chat-app",
    dna: "https://github.com/ArshAnsari23122003/DNA_Mutation_Simulation"
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  // Autocomplete Logic
  const handleTabCompletion = () => {
    const parts = input.trim().split(' ');
    const cmdPart = parts[0].toLowerCase();

    // Completing the command itself
    if (parts.length === 1 && cmdPart.length > 0) {
      const match = COMMAND_LIST.find(c => c.startsWith(cmdPart));
      if (match) setInput(match);
    } 
    // Completing arguments (directories/files)
    else if (parts.length === 2) {
      const argPart = parts[1].toLowerCase();
      const pool = [...DIR_LIST, ...FILE_LIST];
      const match = pool.find(a => a.startsWith(argPart));
      if (match) setInput(`${parts[0]} ${match}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } 
    else if (e.key === 'Enter') {
      const cleanInput = input.trim();
      
      if (cleanInput && wizardStep === 0) {
        setCmdHistory(prev => [cleanInput, ...prev]);
        setHistoryPointer(-1);
      }

      if (wizardStep > 0) {
        handleWizard(cleanInput);
        return;
      }

      const parts = cleanInput.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts[1] ? parts[1].toLowerCase() : null;
      
      const prompt = `ArshAnsari@NITW-LAPTOP MINGW64 ${currentDir} (main)`;
      let newHistory = [...history, { type: 'prompt', content: prompt, input: cleanInput }];
      
      if (links[cmd]) {
        window.open(links[cmd], '_blank');
        newHistory.push({ type: 'success', content: `✔ Opening ${cmd} in a new tab...` });
      } else {
        const response = executeCommand(cmd, arg);
        if (response) {
          if (response.type === 'clear') {
            setHistory([]);
            setInput('');
            return;
          } else {
            newHistory.push(response);
          }
        }
      }
      
      setHistory(newHistory);
      setInput('');
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyPointer < cmdHistory.length - 1) {
        const newPointer = historyPointer + 1;
        setHistoryPointer(newPointer);
        setInput(cmdHistory[newPointer]);
      }
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const newPointer = historyPointer - 1;
        setHistoryPointer(newPointer);
        setInput(cmdHistory[newPointer]);
      } else {
        setHistoryPointer(-1);
        setInput('');
      }
    }
  };

  const handleWizard = (val) => {
    let nextStep = wizardStep;
    let newHistory = [...history, { type: 'wizard-input', content: val }];

    if (wizardStep === 1) {
      setFormData({ ...formData, name: val });
      newHistory.push({ type: 'system', content: '? Enter your email address:' });
      nextStep = 2;
    } else if (wizardStep === 2) {
      setFormData({ ...formData, email: val });
      newHistory.push({ type: 'system', content: '? Type your message:' });
      nextStep = 3;
    } else if (wizardStep === 3) {
      const finalData = { ...formData, message: val };
      newHistory.push({ type: 'success', content: '✔ Message compiled successfully!' });
      window.location.href = `mailto:arshansari23122003@gmail.com?subject=Portfolio Inquiry from ${finalData.name}&body=${finalData.message}%0D%0A%0D%0AFrom: ${finalData.email}`;
      nextStep = 0;
    }

    setHistory(newHistory);
    setWizardStep(nextStep);
    setInput('');
  };

  const executeCommand = (cmd, arg) => {
    switch (cmd) {
      case 'help':
        return { type: 'result', content: 'Available: ls, cd, cat, whoami, contact, clear, github, leetcode, linkedin, codechef, codeforces, ecommerce, chat-app, dna' };
      
      case 'whoami':
        return { type: 'result', content: 'Arsh Ansari. Integrated MSc Mathematics (Minor in CSE) @ National Institute of Technology, Warangal. Roll: 22MAE0012.' };

      case 'contact':
      case 'mail':
        setWizardStep(1);
        return { type: 'system', content: 'INITIALIZING CONTACT WIZARD...\n? Enter your full name:' };

      case 'clear':
        return { type: 'clear' };

      case 'ls':
        if (currentDir === '~') {
          return { type: 'result', content: (
            <div className="grid grid-cols-2 gap-2 text-blue-400 font-bold">
              <span>experience/</span> <span>projects/</span> 
              <span>socials/</span> <span>education/</span>
              <span className="text-white">skills.txt</span>
            </div>
          )};
        }
        return showDirContent(currentDir);

      case 'cd':
        if (!arg || arg === '~' || arg === '..') {
          setCurrentDir('~');
          return null;
        }
        if (DIR_LIST.includes(arg)) {
          setCurrentDir(`~/${arg}`);
          return null;
        }
        return { type: 'error', content: `bash: cd: ${arg}: No such directory` };

      case 'cat':
        if (arg === 'skills.txt' && currentDir === '~') {
          return { type: 'result', content: (
            <div className="space-y-1">
                <p>Languages: C, C++, Python, JavaScript, HTML, CSS</p>
                <p>Frameworks: React.js, Node.js, Express.js, Socket.IO</p>
                <p>Databases: MongoDB, MySQL</p>
                <p>Core: DSA, OOP, REST APIs, AI, Statistics</p>
            </div>
          )};
        }
        return { type: 'error', content: 'bash: cat: File not found' };

      default:
        if (cmd === '') return null;
        return { type: 'error', content: `bash: ${cmd}: command not found. Type "help" for a list of available commands.` };
    }
  };

  const showDirContent = (dir) => {
    if (dir.includes('experience')) {
      return { type: 'result', content: (
        <div className="space-y-4">
          <div>
            <p className="text-yellow-400 font-bold underline">Rangpatra | Software Developer Intern</p>
            <p className="text-xs opacity-70">Nov 2022 - Present | Indore</p>
            <ul className="list-disc ml-5 text-xs space-y-1 mt-1">
              <li>Developed a full-stack, SEO-optimized web application using React.js and Node.js.</li>
              <li>Built scalable features and REST APIs to improve user engagement.</li>
            </ul>
          </div>
          <div>
            <p className="text-yellow-400 font-bold underline">BlockseBlock | Blockchain Developer Intern</p>
            <p className="text-xs opacity-70">Jun 2025 - Jul 2025 | Remote</p>
            <ul className="list-disc ml-5 text-xs space-y-1 mt-1">
              <li>Built and tested blockchain modules for decentralized applications.</li>
              <li>Implemented smart contract logic and transaction validation.</li>
            </ul>
          </div>
          <div>
            <p className="text-yellow-400 font-bold underline">CodSoft | Software Development Intern</p>
            <p className="text-xs opacity-70">May 2024 | Remote</p>
            <ul className="list-disc ml-5 text-xs space-y-1 mt-1">
              <li>Developed a calculator and to-do list using C++ and OOP.</li>
              <li>Optimized task storage using hash-based data structures.</li>
            </ul>
          </div>
        </div>
      )};
    }
    if (dir.includes('projects')) {
      return { type: 'result', content: (
        <div className="space-y-4">
          <div>
            <p className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => window.open(links.ecommerce, '_blank')}>ecommerce (Live Demo)</p>
            <p className="text-xs italic">MERN Stack + Stripe</p>
            <p className="text-xs opacity-90">Full-stack store with JWT and secure payment integration.</p>
          </div>
          <div>
            <p className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => window.open(links["chat-app"], '_blank')}>chat-app (Live Demo)</p>
            <p className="text-xs italic">Socket.IO + MERN</p>
            <p className="text-xs opacity-90">Real-time bi-directional messaging with secure authentication.</p>
          </div>
          <div>
            <p className="text-cyan-400 font-bold underline cursor-pointer" onClick={() => window.open(links.dna, '_blank')}>dna (GitHub Repo)</p>
            <p className="text-xs italic">Python + NumPy</p>
            <p className="text-xs opacity-90">Simulated genetic mutation patterns using Poisson distribution.</p>
          </div>
        </div>
      )};
    }
    if (dir.includes('socials')) {
        return { type: 'result', content: (
          <div className="flex flex-col gap-1">
            <p className="text-white">Direct Command Links:</p>
            <p className="text-cyan-400">github, linkedin, leetcode, codechef, codeforces</p>
          </div>
        )};
      }
    if (dir.includes('education')) {
        return { type: 'result', content: (
          <div className="space-y-3">
            <div>
              <p className="text-white font-bold italic">National Institute of Technology, Warangal</p>
              <p className="text-xs">Integrated MSc Mathematics (Minor in CSE) | CGPA: 8.77</p>
            </div>
            <div>
              <p className="text-white font-bold italic">Shri Ram Centennial School, Indore</p>
              <p className="text-xs">Class XII | Percentage: 81.8%</p>
            </div>
            <div>
              <p className="text-white font-bold italic">Shri Vaishnav Academy</p>
              <p className="text-xs">Class X | Percentage: 86.67%</p>
            </div>
          </div>
        )};
      }
    return { type: 'result', content: 'No files found.' };
  };

  return (
    <div 
      className="terminal-container w-full max-w-4xl border border-[#333] rounded-md font-mono text-[#ccc] p-0 relative overflow-hidden bg-[#0c0c0c] shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top Bar */}
      <div className="bg-[#333] px-4 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
           <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
           <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
           <span className="text-[11px] ml-2 text-gray-400 font-sans tracking-tight uppercase">MINGW64:/c/Users/ArshAnsari/Portfolio</span>
        </div>
      </div>

      {/* Main Terminal Body */}
      <div ref={scrollRef} className="p-4 h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 text-sm leading-relaxed">
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.type === 'prompt' && (
              <p>
                <span className="text-[#27c93f]">ArshAnsari@NITW-LAPTOP </span>
                <span className="text-[#ffbd2e]">MINGW64 </span>
                <span className="text-[#d33682]">{entry.content.split(' ')[2]} (main)</span><br/>
                <span className="text-white">$ {entry.input}</span>
              </p>
            )}
            {entry.type === 'wizard-input' && <p className="text-white ml-4 italic">{entry.content}</p>}
            {entry.type === 'result' && <div className="mt-1 text-[#ccc]">{entry.content}</div>}
            {entry.type === 'system' && <p className="text-gray-500 whitespace-pre-wrap">{entry.content}</p>}
            {entry.type === 'success' && <p className="text-green-500 font-bold">{entry.content}</p>}
            {entry.type === 'error' && <p className="text-red-500">{entry.content}</p>}
          </div>
        ))}

        {/* Input Area */}
        <div className="flex flex-col">
          {wizardStep === 0 && (
            <p>
              <span className="text-[#27c93f]">ArshAnsari@NITW-LAPTOP </span>
              <span className="text-[#ffbd2e]">MINGW64 </span>
              <span className="text-[#d33682]">{currentDir} (main)</span>
            </p>
          )}
          <div className="flex items-center">
            {wizardStep === 0 && <span className="text-white mr-2">$</span>}
            <input
              ref={inputRef}
              autoFocus
              className="bg-transparent border-none outline-none text-white w-full caret-block"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;