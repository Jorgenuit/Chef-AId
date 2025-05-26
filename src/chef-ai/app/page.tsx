'use client';
import React, { useState } from "react";
import ChatInput, { Message } from './components/Input';
import MessageBubble from "./components/Bubble";

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const handleSend = (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    }
    return(
        <div className="chatPage">
            <div className="chatHistory">
                {messages.map((msg, idx) => (
                    <MessageBubble key={msg.id} text={msg.text} sender={msg.sender}/>
                ))}
            </div>
            <div><ChatInput onSend={handleSend}/></div>
        </div>
    )
}

//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>app/page.tsx</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// function InputBar(){
//   const [inputValue, setInputValue] = useState('');
  
//   const handleChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   return (
//     <div>
//       <label htmlFor="myInput">Enter text:</label>
//       <input
//         id="myInput"
//         type="text"
//         value={inputValue}
//         onChange={handleChange}
//       />
//       <p>You typed: {inputValue}</p>
//     </div>
//   );
// }

// export default function Form(){
//   return(
//   <InputBar />
//   )
