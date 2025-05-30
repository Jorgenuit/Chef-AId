import React from "react";
import "./bubble.css";

interface MessageBubbleProps {
    text: string;
    sender: "user" | "reply";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
    return <div className={"message-bubble ${sender}"}>{text}</div>;
};

export default MessageBubble;
