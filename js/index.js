var YS_LOADING = true;

var DefaultStats = 0;
var HelpText = "AddInventoryItem, AddHeroStrength, AddHeroIntellect, ClearInventory, ResetStrength, ResetIntellect, ResetStats";

var HeroName = "Unnamed";
var HeroGender = "Unknown";
var HeroStrength = DefaultStats;
var HeroIntel = DefaultStats;
var HeroInv = [];

var StoryWrapper_ID = "StoryWrapper";
var StoryHeader_ID = "StoryHeader";
var StoryMainText_ID = "StoryMainText";
var StoryLeftButton_ID = "StoryLeftButton";
var StoryRightButton_ID = "StoryRightButton";

// http://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
var contains = function(needle)
{
	var findNaN = needle !== needle;
	var indexOf;
	if (!findNaN && typeof Array.prototype.indexOf === 'function')
	{
		indexOf = Array.prototype.indexOf;
	}
	else
	{
		indexOf = function(needle)
		{
			var i = -1, index = -1;
			for (i = 0; i < this.length; i++)
			{
				var item = this[i];
				if ((findNaN && item !== item) || item === needle)
				{
					index = i;
					break;
				}
			}
			return index;
		};
	}
	return indexOf.call(this, needle) > -1;
};

// http://stackoverflow.com/questions/3387427/remove-element-by-id
Element.prototype.remove = function()
{
	this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function()
{
	for(var i = this.length - 1; i >= 0; i--)
	{
		if(this[i] && this[i].parentElement)
        	{
			this[i].parentElement.removeChild(this[i]);
        	}
	}
}

// Doesn't actually create a table, but "sanitizes" it.
function CreatePage(tab)
{
	this.page_id = 		tab.page_id || 		1;		// Page ID (Must be unique)
	this.main_text = 	tab.main_text || 	"Main text";	// What text should show up on the page?
	this.header = 		tab.header || 		"Header";	// What should the header say?
	this.left_text = 	tab.left_text || 	"Left text"; 	// What text is on the left button
	this.left_page = 	tab.left_page || 	{}; 		// What page does the left button go to?
	this.right_text = 	tab.right_text || 	"Right text"; 	// What text is on the right button?
	this.right_page = 	tab.right_page || 	{}; 		// What page does the right button go to?
	this.background_color = tab.background_color || "purple"; 	// What should the background color be?
	this.wrapper_color = 	tab.wrapper_color || 	"magenta"; 	// What should the wrapper color be?
	this.text_color = 	tab.text_color || 	"white"; 	// What should the text color be?
	this.give_items = 	tab.give_items || 	[]; 		// What items should we give the player?
	this.give_strength = 	tab.give_strength || 	0;		// How much strength should the player gain?
	this.give_intel = 	tab.give_intel || 	0;		// How much intellect should the player gain?
	this.needed_items = 	tab.needed_items || 	[];		// What items does the player need?
	this.item_punish = 	tab.item_punish || 	[]; 		// Kill the player if they don't have these items?
	this.punish_page = 	tab.punish_page || 	"PAGE_LOSE";	// What page "kills" the player? (See item_punish)
	this.take_items = 	tab.take_items || 	[];		// Take these items from the player if they have them
	this.lose =		tab.lose || 		false;		// Does the player lose on this page?
	this.win = 		tab.win || 		false;		// Does the player win on this page?
}

// Set them to a value so they aren't undefined before "creation" - NO LONGER NECESSARY, JUST KEEPING
// var PAGE_START, PAGE_LOSE, PAGE_WIN, PAGE_CURRENT = 1;

// Create default pages
var PAGE_START = new CreatePage({
	page_id : 1,
	main_text : "You wake up in a small house. There is a table with an apple, knife, and book on it. You pick up the apple and decide if you are going to take the knife or the book.",
	header : "Welcome to You Story",
	left_text : "Pick up knife",
	left_page : "PAGE_0",
	right_text : "Pick up book",
	right_page : "PAGE_1"
});
var PAGE_LOSE = new CreatePage({
	page_id : 2,
	main_text : "You have lost.",
	header : "You Lose",
	left_text : "Start over",
	left_page : "PAGE_START",
	right_text : "Start over",
	right_page : "PAGE_START"
});
var PAGE_WIN = new CreatePage({
	page_id : 3,
	main_text : "You have won!",
	header : "You Win!",
	left_text : "Start over",
	left_page : "PAGE_START",
	right_text : "Start over", 
	right_page : "PAGE_START"
});
var PAGE_CURRENT = PAGE_START;

function DoPage(page)
{
	PAGE_CURRENT = page;
	document.body.style.backgroundColor = page.background_color;
	document.getElementById(StoryWrapper_ID).style.color = page.text_color;
	document.getElementById(StoryWrapper_ID).style.backgroundColor = page.wrapper_color;
	document.getElementById(StoryHeader_ID).outerHTML = "<h2 id=\"" + StoryHeader_ID + "\">" + page.header + "</h2>";
	document.getElementById(StoryMainText_ID).outerHTML = "<p id=\"" + StoryMainText_ID + "\">" + page.main_text + "</p>";
	document.getElementById(StoryLeftButton_ID).outerHTML = "<button id=\"" + StoryLeftButton_ID + "\" onclick=\"DoPage(" + page.left_page + ")\">" + page.left_text + "</button>";
	document.getElementById(StoryRightButton_ID).outerHTML = "<button id=\"" + StoryRightButton_ID + "\" onclick=\"DoPage(" + page.right_page + ")\">" + page.right_text + "</button>";

	if (page.give_items.length)
	{
		for (var i = 0; i < page.give_items.length; i++)
		{
			HeroInv.push(page.give_items[i]);
		}
	}
	if (page.take_items.length)
	{
		for (var i = 0; i < page.take_items.length; i++)
		{
			if  (contains.call(HeroInv, page.take_items[i]))
			{
				if (HeroInv.indexOf(page.take_items[i]) > -1)
				{
					HeroInv.splice(HeroInv.indexOf(page.take_items[i]), 1);
				}
			}
		}
	}
	if (page.item_punish.length)
	{
		for (var i = 0; i < page.item_punish.length; i++)
		{
			if  (!contains.call(HeroInv, page.item_punish[i]))
			{
				DoPage(eval(page.punish_page));
			}
		}
	}
	HeroStrength += page.give_strength;
	HeroIntel += page.give_intel;
	UpdateInfoBox();
}

function SetHeroGender(gender)
{
	if (gender)
	{
		HeroGender = "Female";
		// Female easter eggs
		if (HeroName == "Marie Curie")
		{
			HeroInv.push("Radiation posioning"); // That's pretty dark
			UpdateInfoBox();
		}
	}
	else
	{
		HeroGender = "Male";
		// Male easter eggs
		if (HeroName == "Tai Lopez")
		{
			HeroInv.push("Lamborghini");
			UpdateInfoBox();
		}
		else if (HeroName == "Donald Trump")
		{
			HeroInv.push("Small loan of $1,000,000");
			UpdateInfoBox();
		}
		else if (HeroName == "John Cena")
		{
			HeroStrength += 5;
			UpdateInfoBox();
		}
		else if (HeroName == "Steve Jobs")
		{
			HeroInv.push("iPhone");
			UpdateInfoBox();
		}
	}
	HeroName = document.getElementById("HeroNameTextEntry").value;
	document.getElementById("HeroNameTextEntry").remove();
	document.getElementById("HeroGenderButtonMale").remove();
	document.getElementById("HeroGenderButtonFemale").remove();
	document.getElementById("HeroInfoDisplayName").innerHTML = "Name: " + HeroName;
	document.getElementById("HeroInfoDisplayGender").innerHTML = "Gender: " + HeroGender;
}

function UpdateInfoBox()
{
	var InvStr = "Inventory: ";
	var StatStr = "Stats: Strength: " + HeroStrength + ", Intellect: " + HeroIntel;
	for (var i = 0; i < HeroInv.length; i++)
	{
		if (HeroInv[i] == HeroInv.length)
		{
			InvStr += HeroInv[i];
		}
		else
		{
			InvStr += HeroInv[i] + ", ";	
		}
    		
	}
	document.getElementById("HeroInfoDisplayInventory").innerHTML = InvStr;
	document.getElementById("HeroInfoDisplayStats").innerHTML = StatStr;
}

// Debugging commands
function AddInventoryItem(item)
{
	HeroInv.push(item);
	UpdateInfoBox();
	console.log(item + " has been added to inventory");
}

function AddHeroStrength(num)
{
	HeroStrength += num;
	UpdateInfoBox();
	console.log("Hero strength is now " + num);
}

function AddHeroIntellect(num)
{
	HeroIntel += num;
	UpdateInfoBox();
	console.log("Hero intellect is now " + num);
}

function ClearInventory()
{
	HeroInv = [];
	UpdateInfoBox();
	console.log("Inventory cleared");
}

function ResetStrength()
{
	HeroStrength = DefaultStats;
	UpdateInfoBox();
	console.log("Strength reset");
}

function ResetIntellect()
{
	HeroIntel = DefaultStats;
	UpdateInfoBox();
	console.log("Intellect reset");
}

function ResetStats()
{
	HeroStrength = DefaultStats;
	HeroIntel = DefaultStats;
	UpdateInfoBox();
	console.log("Stats reset");
}

function YourStoryHelp()
{
	console.log("Debugging Functions: " + HelpText);
}

// On page load
function StartTheAdventure()
{
	HeroInv.push("Apple");
	DoPage(PAGE_START);
	console.log("The adventure has been started!");
}

window.onload = StartTheAdventure;

///////////////////////////////////////
////////// CREATE PAGES HERE //////////
///////////////////////////////////////

var PAGE_0 = new CreatePage({
	page_id : 3,
	header : "You walk outside and see a path.",
	main_text : "The path leads to an arena. You look around some more and find another path that leads to a church.",
	left_text : "Go to arena",
	left_page : "PAGE_00",
	right_text : "Go to church", 
	right_page : "PAGE_01",
	give_strength : 5,
	give_items : ["Knife"]
});

var PAGE_1 = new CreatePage({
	page_id : 3,
	header : "You walk outside and see a path.",
	main_text : "The path leads to an arena. You look around some more and find another path that leads to a church.",
	left_text : "Go to arena",
	left_page : "PAGE_10",
	right_text : "Go to church", 
	right_page : "PAGE_11",
	give_intel : 5,
	give_items : ["Book"]
});

var PAGE_00 = new CreatePage({
	page_id : 3,
	header : "You walk towards the arena and see that there is a fight.",
	main_text : "There aren't that many people watching, and there is no security. Do you want to fight or train?",
	left_text : "Fight",
	left_page : "PAGE_000",
	right_text : "Train", 
	right_page : "PAGE_001",
});

var PAGE_01 = new CreatePage({
	page_id : 3,
	header : "You walk towards the church.",
	main_text : "There are people. They seem to be waiting for the priest to show up.",
	left_text : "Sit down with the people",
	left_page : "PAGE_010",
	right_text : "Pretend to be a priest", 
	right_page : "PAGE_011",
});

///////////////////////////////////////
////////// CREATE PAGES HERE //////////
///////////////////////////////////////

var YS_LOADING = false;
