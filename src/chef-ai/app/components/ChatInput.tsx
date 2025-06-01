"use client";
import React, { useState, useRef, useEffect } from "react";
import "./ChatInput.css";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";

const ChatInput = () => {
	const backend = "http://localhost:8080"

	//declarations
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [message, setMessage] = useState("");
	const [locked, setLocked] = useState(false);
	const router = useRouter();

	//function dealing with sending URL to back-end
	const handleSend = async () => {
		if (message.trim() !== "") {
			//   onSend({
			//     id: Date.now(),
			//     text: message.trim(),
			//   });
			console.log(message);


			setLocked(true); //lock input and send button so user cant spam requests, but can see that its working 
			try {
				//request to backend to generate the recipe
				const response = await fetch(backend, {
					method: 'POST',
					body: message,
					headers: {
						'Content-type': 'application/json',
						// 'Access-Control-Allow-Origin': '*'
					}
				}); //fetch to backend
				console.log(response);
				let body = await response.json();
				console.log(body);
				setMessage("");
			}

			finally {
				textareaRef.current!.value = ""; //reset the text area
				setLocked(false) // unlock the input
				router.refresh(); // refresh the page to reload the sidebar with the new recipe
			}
		}
	};

	//Effect that resizes the text area to fit the text
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
					disabled={locked}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault(); // Prevent newline after submit
							handleSend();
						}
					}}
				/>
				<button className="input-send-button" onClick={handleSend} disabled={locked}>
					{locked ? "Sending..." : "Send"}
				</button>
				<MoonLoader size={25} color="silver" loading={locked} />
			</div>
		</div >
	);
};
export default ChatInput;
