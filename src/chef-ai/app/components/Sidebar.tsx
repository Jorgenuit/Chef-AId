"use client";
import React from "react";
import "./sidebar.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

//items for the sidebar
export interface SidebarProps {
	items?: { label: string; id: string; }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items = [] }) => {
	const router = useRouter(); //router used to redirect to recipes
	return (
		<div className="sidebar">
			<div className="sidebar-header">
				<Link href={"/"} className="sidebar-link">
					<Image
						src="/images/mascot-icon.png"
						priority
						style={{ cursor: "pointer" }}
						alt="logo"
						width={75}
						height={75}
					/>{" "}
					<span>Chef AId </span>
				</Link>
			</div>
			<nav className="sidebar-nav">
				{items.map((item, idx) => (
					<button
						key={idx}
						className="sidebar-item"
						onClick={() => router.push(item.id)}
					>
						{item.label}
					</button>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
