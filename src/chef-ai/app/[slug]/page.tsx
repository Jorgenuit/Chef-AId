import fs from "fs"
import { notFound } from "next/navigation"
import type { IndexData, RecipeData } from "../interfaces";
import Image from 'next/image'
import './stylesheet.css' 
// import { BsExclamationCircle } from "react-icons/bs";
import { FaRegSmileWink } from "react-icons/fa";


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
          src={object.ImagePath}
          fill={true}
          objectFit="cover"
          quality={100}
          alt="Image">
          </Image>
      </div>

      <h1 className="recipe-title"> {recipe.Title} </h1>

      <div className="recipe-wrapper">

        <div className="left">
          <div className="info-wrapper">
            <p className="info"><b>Calories:</b> {recipe.Calories}</p>
            <p className="info"><b>Number of servings:</b> {recipe.Servings}</p>
            <p className="info"><b>Prep time:</b> {recipe.Time}</p>
          </div>
          <div className="ingredients-container">
              <h2>Ingredients:</h2>
              {Object.entries(recipe.Ingredients).map(([key,value]) => (
                <div key={key}>
                  <h3>{key}</h3>
                  <ul className="list">
                    {value.map((line:string, index:number) => <li key={index}>{line}</li> )}
                  </ul>
                </div>
              ))}
          </div>
          <div className="ingredients-container">
            <h2>Instructions</h2>
            <ul className="list">
              {recipe.Instructions.map((line, index) => <li key={index}>{line}</li>)}
            </ul>
          </div>
          <div className="tip-container">
            {/* <BsExclamationCircle size={50}/> */}
            <FaRegSmileWink size={50}/>
            <div className="big-tip-div">
              <div className="tip-div">
                <h4>Some useful tips!</h4>
                <ul className="tip-list">
                  {recipe.Tips.map((line, index) => <li key={index}> {line} </li> )}
                </ul>
                <br />
                {/* <h4>How about trying one of these next!</h4>
                <ul className="tip-list">
                  {recipe.Suggestions.map((line, index) => <li key={index}> {line} </li> )}
                </ul> */}
              </div>
              <div className="other-tip-div">
                <h4>How about trying one of these next!</h4>
                <ul className="tip-list">
                  {recipe.Suggestions.map((line, index) => <li key={index}> {line} </li> )}
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="right">
          <video className="video" controls >
            <source src={object.VideoPath} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}
