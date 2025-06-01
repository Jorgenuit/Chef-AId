import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar, { SidebarProps } from "./components/Sidebar";
import { createItemList } from "./components/CreateItemList";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Chef-AId",
	description: "Generate a recipe from a tiktok video",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	let itemList: SidebarProps["items"] = [];
	try {
		itemList = createItemList("./app/data/index.json"); //read index file and create listitems 
	}

	catch (error) {
		console.error(error);
	}

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<div className="sidebar-container">
					<Sidebar items={itemList} />
				</div>
				<div className={"page-container"}>{children}</div>
			</body>
		</html>
	);
}
