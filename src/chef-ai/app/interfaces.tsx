

export interface IndexData {
  "Id": string,
  "Name": string,
  "FilePath": string,
  "ImagePath": string,
  "VideoPath": string
}

export interface RecipeData {
  "Title": string,
  "Ingredients": object,
  "Instructions": string[],
  "Calories": string,
  "Servings": string,
  "Time": string,
  "Tips": string[],
  "Suggestions": string[]
}