"use client";
import React, { useState, useRef, useEffect } from "react";
import "./ChatInput.css";
interface ChatInputProps {}

const ChatInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [message, setMessage] = useState("");
    const handleSend = () => {
        if (message.trim() !== "") {
            //   onSend({
            //     id: Date.now(),
            //     text: message.trim(),
            //   });
            console.log(message);
            textareaRef.current!.value = "";
            setMessage("");
        }
    };
    // Auto-resize textarea
    //   useEffect(() => {
    //     const textarea = textareaRef.current;
    //     console.log(textareaRef.current?.value);
    //     if (textarea) {
    //       textarea.style.height = "auto";
    //       textarea.style.height = `${textarea.scrollHeight}px`;
    //     }
    //   }, [message]);

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <textarea
                    ref={textareaRef}
                    className="input-textarea"
                    rows={1}
                    placeholder="Enter a url"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // Prevent newline after submit
                            handleSend();
                        }
                    }}
                />
                <button
                    className="input-send-button"
                    onClick={handleSend}
                    //   disabled={!message.trim()}
                >
                    Send
                </button>
            </div>
        </div>
    );
};
export default ChatInput;
// export type Message = {
//   id: number;
//   text: string;
// };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

// };
