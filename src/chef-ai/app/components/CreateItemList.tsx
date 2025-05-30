import fs from "fs";
import path from "path";
import type { SidebarProps } from "./Sidebar";

export function createItemList(filePath: string): SidebarProps["items"] {
	const pathName = path.resolve(filePath);
	const fileContent = fs.readFileSync(pathName, "utf-8");

	const lines = fileContent
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	const items = lines.map((label) => ({
		label,
	}));
	console.log(items);
	return items;
}
