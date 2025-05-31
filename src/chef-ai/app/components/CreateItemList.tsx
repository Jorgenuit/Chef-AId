import fs from "fs";
import path from "path";
import type { SidebarProps } from "./Sidebar";
import type { IndexData } from "../interfaces";

export function createItemList(filePath: string): SidebarProps["items"] {
  const pathName = path.resolve(filePath);
  const fileContent = fs.readFileSync(pathName, "utf-8");

  const greie: IndexData[] = JSON.parse(fileContent);

  const items = greie.map(({ Name, Id }) => ({
    label: Name,
    id: Id,
  }));

  console.log(items);
  return items;
}
