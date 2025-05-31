"use client";
import React from "react";
import "./sidebar.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface SidebarProps {
	items?: { label: string; id: string; icon?: React.ReactNode }[];
}

const imageClick = () => {
	console.log("Going home!");
};

const Sidebar: React.FC<SidebarProps> = ({ items = [] }) => {
	const router = useRouter();
	return (
		<div className="sidebar">
			<div className="sidebar-header">
				<Link href={"/"}>
					<Image
						src="/images/house-icon-2.png"
						priority
						onClick={imageClick}
						style={{ cursor: "pointer" }}
						alt="logo"
						width={50}
						height={50}
					/>{" "}
					<span>Chef-AId </span>
				</Link>
			</div>
			<nav className="sidebar-nav">
				{items.map((item, idx) => (
					<button
						key={idx}
						className="sidebar-item"
						onClick={() => router.push(item.id)}
					>
						{item.icon && (
							<span className="sidebar-icon">{item.icon}</span>
						)}
						{item.label}
					</button>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
