// You only need to touch comments with the todo of this file to complete the assignment!

/*
=== How to build on top of the starter code? ===

Problems have multiple solutions.
We have created a structure to help you on solving this problem.
On top of the structure, we created a flow shaped via the below functions.
We left descriptions, hints, and to-do sections in between.
If you want to use this code, fill in the to-do sections.
However, if you're going to solve this problem yourself in different ways, you can ignore this starter code.
 */

/*
=== Terminology for the jService API ===

Clue: The name given to the structure that contains the question and the answer together.
Category: The name given to the structure containing clues on the same topic.
 */

/*
=== Data Structure of Request the jService API Endpoints ===

/categories:
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues_count": <number of clues in the category where each clue has a question, an answer, and a value>
  },
  ... more categories
]

/category:
{
  "id": <category ID>,
  "title": <category name>,
  "clues_count": <number of clues in the category>,
  "clues": [
    {
      "id": <clue ID>,
      "answer": <answer to the question>,
      "question": <question>,
      "value": <value of the question (be careful not all questions have values) (Hint: you can assign your own value such as 200 or skip)>,
      ... more properties
    },
    ... more clues
  ]
}
 */

const API_URL = "https://jservice.io/api"; // The URL of the jService API.
const NUMBER_OF_CATEGORIES = 6; // The number of categories you will be fetching. You can change this number.
const NUMBER_OF_CLUES_PER_CATEGORY = 5; // The number of clues you will be displaying per category. You can change this number.

let categories = []; // The categories with clues fetched from the API.
/*
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues": [
      {
        "id": <clue ID>,
        "value": <value (e.g. $200)>,
        "question": <question>,
        "answer": <answer>
      },
      ... more categories
    ]
  },
  ... more categories
]
 */

let activeClue = null; // Currently selected clue data.
let activeClueMode = 0; // Controls the flow of #active-clue element while selecting a clue, displaying the question of selected clue, and displaying the answer to the question.
/*
0: Empty. Waiting to be filled. If a clue is clicked, it shows the question (transits to 1).
1: Showing a question. If the question is clicked, it shows the answer (transits to 2).
2: Showing an answer. If the answer is clicked, it empties (transits back to 0).
 */

let isPlayButtonClickable = true; // Only clickable when the game haven't started yet or ended. Prevents the button to be clicked during the game.

$("#play").on("click", handleClickOfPlay);

/**
 * Manages the behavior of the play button (start or restart) when clicked.
 * Sets up the game.
 *
 * Hints:
 * - Sets up the game when the play button is clickable.
 */
async function handleClickOfPlay () {
  // todo set the game up if the play button is clickable
  if (isPlayButtonClickable) {
    setupTheGame();
  }
  
}

/**
 * Sets up the game.
 *
 * 1. Cleans the game since the user can be restarting the game.
 * 2. Get category IDs
 * 3. For each category ID, get the category with clues.
 * 4. Fill the HTML table with the game data.
 *
 * Hints:
 * - The game play is managed via events.
 */
async function setupTheGame ()
{
  // todo show the spinner while setting up the game
  
$("#spinner").removeClass("disabled");
  resetDOM();
  const categoryIds = await getCategoryIds();
  categories = await Promise.all(categoryIds.map(getCategoryData));
  fillTable(categories);
  $("#spinner").addClass("disabled");
  isPlayButtonClickable = false;
  $("#play").text("Restart the Game!"); 
}

// todo reset the DOM (table, button text, the end text)
  // todo fetch the game data (categories with clues)
  // todo fill the table

function resetDOM() {
  $("#categories").empty();
  $("#clues").empty();
  $("#active-clue").empty();
  isPlayButtonClickable = true;
  $("#play").text("Start the Game!");
}


/**
 * Gets as many category IDs as in the `NUMBER_OF_CATEGORIES` constant.
 * Returns an array of numbers where each number is a category ID.
 *
 * Hints:
 * - Use /categories endpoint of the jService API.
 * - Request as many categories as possible, such as 100. Randomly pick as many categories as given in the `NUMBER_OF_CATEGORIES` constant, if the number of clues in the category is enough (<= `NUMBER_OF_CLUES` constant).
 */
async function getCategoryIds ()
{const response = await axios.get('https://jservice.io/api/categories', {params: {count: 100}});
  // const ids = []; // todo set after fetching

  // todo fetch NUMBER_OF_CATEGORIES amount of categories

  // return ids;

  const categoryIds = response.data
    .filter((category) => category.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY)
    .map((category) => category.id)
    .slice(0, NUMBER_OF_CATEGORIES);
  return categoryIds;
}

/**
 * Gets category with as many clues as given in the `NUMBER_OF_CLUES` constant.
 * Returns the below data structure:
 *  {
 *    "id": <category ID>
 *    "title": <category name>
 *    "clues": [
 *      {
 *        "id": <clue ID>,
 *        "value": <value of the question>,
 *        "question": <question>,
 *        "answer": <answer to the question>
 *      },
 *      ... more clues
 *    ]
 *  }
 *
 * Hints:
 * - You need to call this function for each category ID returned from the `getCategoryIds` function.
 * - Use /category endpoint of the jService API.
 * - In the API, not all clues have a value. You can assign your own value or skip that clue.
 */
async function getCategoryData (categoryId)
{
  const categoryWithClues = {
    id: categoryId,
    title: undefined, // todo set after fetching
    clues: [] // todo set after fetching
  };

  // todo fetch the category with NUMBER_OF_CLUES_PER_CATEGORY amount of clues

  const response = await axios.get(`${API_URL}/category?id=${categoryId}`);
  const clues = response.data.clues
    .slice(0, NUMBER_OF_CLUES_PER_CATEGORY)
    .map((clue) => ({
      id: clue.id,
      value: clue.value || 200,
      question: clue.question,
      answer: clue.answer,
    }));

  categoryWithClues.title = response.data.title;
  categoryWithClues.clues = clues;

  return categoryWithClues;
}


/**
 * Fills the HTML table using category data.
 *
 * Hints:
 * - You need to call this function using an array of categories where each element comes from the `getCategoryData` function.
 * - Table head (thead) has a row (#categories).
 *   For each category, you should create a cell element (th) and append that to it.
 * - Table body (tbody) has a row (#clues).
 *   For each category, you should create a cell element (td) and append that to it.
 *   Besides, for each clue in a category, you should create a row element (tr) and append it to the corresponding previously created and appended cell element (td).
 * - To this row elements (tr) should add an event listener (handled by the `handleClickOfClue` function) and set their IDs with category and clue IDs. This will enable you to detect which clue is clicked.
 */
function fillTable (categories)
{ // todo
  const categoriesRow = $("#categories");
  const tbody = $("#clues"); 

  categories.forEach((category) => {
    const categoryCell = $("<th>").text(category.title);
    categoriesRow.append(categoryCell);
  });

  // Create rows for each clue
  for (let i = 0; i < NUMBER_OF_CLUES_PER_CATEGORY; i++) {
    const clueRow = $("<tr>");


   categories.forEach((category) => {
  const clue = category.clues[i];
  const clueCell = $("<td>")
    .addClass("clue")  // Uncomment this line
    .attr("id", `clue_${category.id}_${clue.id}`)
    .text("$" + (i * 200 + 200)); 
  clueRow.append(clueCell);
});
    tbody.append(clueRow);
  }
}

$(".clue").on("click", handleClickOfClue);

/**
 * Manages the behavior when a clue is clicked.
 * Displays the question if there is no active question.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - Identify the category and clue IDs using the clicked element's ID.
 * - Remove the clicked clue from categories since each clue should be clickable only once. Don't forget to remove the category if all the clues are removed.
 * - Don't forget to update the `activeClueMode` variable.
 *
 */
function handleClickOfClue (event)
{// todo find and remove the clue from the categories
  
  const [categoryID, clueID] = event.currentTarget.id.split("_")[1];
  activeClue = categories.find((category) => category.id === parseInt(categoryID)).clues.find((clue) => clue.id === parseInt(clueID));
  
// todo mark clue as viewed (you can use the class in style.css), display the question at #active-clue

  $(event.currentTarget).addClass("viewed");
  $("#active-clue").html(activeClue.question);
  activeClueMode = 1;
}

$("#active-clue").on("click", handleClickOfActiveClue);

/**
 * Manages the behavior when a displayed question or answer is clicked.
 * Displays the answer if currently displaying a question.
 * Clears if currently displaying an answer.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - After clearing, check the categories array to see if it is empty to decide to end the game.
 * - Don't forget to update the `activeClueMode` variable.
 */

function handleClickOfActiveClue() {
// function handleClickOfActiveClue (event)
// todo display answer if displaying a question
  
  if (activeClueMode === 1) {
    $("#active-clue").html(activeClue.answer);
    activeClueMode = 2;

  // todo clear if displaying an answer

} else if (activeClueMode === 2) {
   $("#active-clue").empty();
   activeClueMode = 0; 

  // todo after clear end the game when no clues are left

  if (categories.every((category) => category.clues.every((clue) => clue.id !== activeClue.id))) {
    $("#active-clue").html("The End!");
  }
 }
}

//   if (activeClueMode === 1)
//   {
//     activeClueMode = 2;
//     $("#active-clue").html(activeClue.answer);
//   }
//   else if (activeClueMode === 2)
//   {
//     activeClueMode = 0;
//     $("#active-clue").html(null);

//     if (categories.length === 0)
//     {
//       isPlayButtonClickable = true;
//       $("#play").text("Restart the Game!");
//       $("#active-clue").html("The End!");
//     }
//   }
// }