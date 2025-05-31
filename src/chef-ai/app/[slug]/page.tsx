import fs from "fs"
import { notFound } from "next/navigation"
import type { IndexData, RecipeData } from "../interfaces";
import styles from './page.module.css'

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
  jsonstring = fs.readFileSync(object.Path + 'recipe.json', 'utf-8');
  const recipe:RecipeData = JSON.parse(jsonstring) // Parse to object


  return (
    <div>
      <h1> {recipe.Title} </h1>
      <div className="recipe-container">
          <h2>Ingredients:</h2>
          {Object.entries(recipe.Ingredients).map(([key,value]) => (
            <>
              <h3>{key}</h3>
              <ul>
                {value.map((line:string) => <li>{line}</li> )}
              </ul>
            </>
          ))}
      </div>
      <div>
        <h2>Instructions</h2>
        <ul>
          {recipe.Instructions.map(line => <li>{line}</li>)}
        </ul>
      </div>
    </div>
  )
}
