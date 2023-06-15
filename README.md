# tiptap-calculation-example
This is a simple prototype written to meet the following requirements:
- simple WYSIWYG editing of text - explaining a result, inline with the result of a calculation
- ability to add, edit and delete simple formulas, the result of which which will be calculated once the variables are known
- display the underlying formula creating the displayed result on hover
- a narrow immutable symbol used inline to represent the formula. This is because: 
  - displaying the whole formula inline would result in less readability
  - displaying a formula editor in a modal allows more formula specific options and formatting of the formula itself

  The code in this repo borrows heavily from the [Tiptap Mentions Plugin](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-mention/src/mention.ts)

Pull requests, suggestions and code reviews (including to improve adherance to Tiptap or Vue style guides and recommended practice) are welcome...
