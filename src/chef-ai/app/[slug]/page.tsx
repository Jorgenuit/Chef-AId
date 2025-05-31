import fs from "fs"
import { notFound } from "next/navigation"
import type { IndexData, RecipeData } from "../interfaces";
// interface IndexData {
//   "Id": string,
//   "Name": string,
//   "Path": string
// }

// interface RecipeData {
//   "Name": string,
//   "Ingredients": string,
//   "Instructions": string
// }

export default async function Page({params,}: {params: Promise<{ slug: string }>;}) {
  const { slug } = await params;

  const indexFile: string = "./app/data/index.json";


  let jsonstring = fs.readFileSync(indexFile, 'utf-8'); // Read index file
  const data:IndexData[] = JSON.parse(jsonstring); // Parse to object


  // Validate path and get object
  let object = null
  for (let e of data) {
    if (e.Id === slug) {
      object = e;
    }
  }
  if (!object) {
    return notFound();
  }
  console.log(object); // DEBUG


  // Get recipe
  jsonstring = fs.readFileSync(object.Path, 'utf-8');
  const recipe:RecipeData = JSON.parse(jsonstring) // Parse to object


  // Generate UUID: crypto.randomUUID()

  // return <div>My Post: {slug}</div>;
  return <div>My Post: {recipe.Instructions}</div>;
}
