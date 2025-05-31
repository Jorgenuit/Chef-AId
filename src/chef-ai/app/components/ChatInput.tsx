"use client";
import React, { useState, useRef, useEffect } from "react";
import "./ChatInput.css";
import { useRouter } from "next/navigation";

interface ChatInputProps {}

const ChatInput = () => {
	const backend = "http://localhost:8080"

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [message, setMessage] = useState("");
	const [isLocked, setIsLocked] = useState(false);
	const router = useRouter();
    
	// const handleLock = () => {{setIsLocked(!isLocked)}}

	const handleSend = async () => {
		if (message.trim() !== "") {
			//   onSend({
			//     id: Date.now(),
			//     text: message.trim(),
			//   });
			console.log(message);
			

			setIsLocked(true);
			try{
			const response = await fetch(backend, {
				method: 'POST',
				body: message,
				headers:{
					'Content-type': 'application/json',
					// 'Access-Control-Allow-Origin': '*'
				}
			});
			console.log(response);
			let body = await response.json();
			console.log(body);
			setMessage("");
			}
			
			finally{
				textareaRef.current!.value = "";
				setIsLocked(false)
				router.refresh();
			}
	}
	};

	useEffect(() => {
  const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = "auto"; // reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // set to content height
  }
}, [message]);


	return (
		<div className="input-container">
			<div className="input-wrapper">
				<textarea
					ref={textareaRef}
					className="input-textarea"
					rows={1}
					placeholder="Enter a url"
					disabled={isLocked}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault(); // Prevent newline after submit
							handleSend();
						}
					}}
				/>
				<button className="input-send-button" onClick={handleSend} disabled={isLocked}>
					{isLocked ? "Sending..." : "Send"}
				</button>
			</div>
		</div>
	);
};
export default ChatInput;
