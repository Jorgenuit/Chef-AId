import fs from "fs"
import { notFound } from "next/navigation"
import type { IndexData, RecipeData } from "../interfaces";
import Image from 'next/image'
import './stylesheet.css' 

export default async function Page({ params, }: { params: Promise<{ slug: string }>; }) {
  const { slug } = await params;

  const indexFile: string = "./app/data/index.json";


  let jsonstring = fs.readFileSync(indexFile, 'utf-8'); // Read index file
  const data: IndexData[] = JSON.parse(jsonstring); // Parse to object


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
  jsonstring = fs.readFileSync(object.FilePath, 'utf-8');
  const recipe:RecipeData = JSON.parse(jsonstring) // Parse to object


  return (
    <div className="recipe-container">
      <div className="image-wrapper">
        <Image
          // src='/test.svg'
          src={object.ImagePath}
          fill={true}
          objectFit="cover"
          quality={100}
          alt="Image">
          </Image>
          {/* <img className="recipe-image" src={object.ImagePath} alt="Image" /> */}
      </div>

      <h1 className="recipe-title"> {recipe.Title} </h1>

      <div className="recipe-wrapper">

        <div className="left">
          <div className="ingredients-container">
              <h2>Ingredients:</h2>
              {Object.entries(recipe.Ingredients).map(([key,value]) => (
                <div key={key}>
                  <h3>{key}</h3>
                  <ul>
                    {value.map((line:string, index:number) => <li key={index}>{line}</li> )}
                  </ul>
                </div>
              ))}
          </div>
          <div>
            <h2>Instructions</h2>
            <ul>
              {recipe.Instructions.map((line, index) => <li key={index}>{line}</li>)}
            </ul>
          </div>
        </div>

        <div className="right">
          <video controls >
            <source src={object.VideoPath} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}
