import fs from "fs";
import path from "path";
import type { SidebarProps } from "./Sidebar";
import type { IndexData } from "../interfaces";

export function createItemList(filePath: string): SidebarProps["items"] {
  const pathName = path.resolve(filePath); //resolve filepath
  const fileContent = fs.readFileSync(pathName, "utf-8"); //read file content

  const greie: IndexData[] = JSON.parse(fileContent); //parse the json objects from the file

  //map object name and id to a sidebar item
  const items = greie.map(({ Name, Id }) => ({
    label: Name,
    id: Id,
  }));

  console.log(items);
  return items;
}
