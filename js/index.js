var YS_LOADING = true;

// Information
var YS_LONG_NAME = "Your Story";
var YS_SHORT_NAME = "YS";
var YS_DESCRIPTION = "A choose your own adventure game.";
var YS_VERSION = "Alpha 0.8";

// Default values, feel free to edit
var DefaultStats = 0;
var DefaultItems = ["Apple"];

// Help text
var HelpTextPre = "Debugging functions: ";
var HelpText = "AddInventoryItem, AddHeroStrength, AddHeroIntellect, ClearInventory, ResetStrength, ResetIntellect, ResetStats";

// Hero information, do not edit
var HeroName = "Unnamed";
var HeroGender = "Unknown";
var HeroStrength = DefaultStats;
var HeroIntel = DefaultStats;
var HeroInv = [];

// HTML element IDs, do not edit unless they are changed in the actual HTML
var StoryWrapper_ID = "StoryWrapper";
var StoryHeader_ID = "StoryHeader";
var StoryMainText_ID = "StoryMainText";
var StoryLeftButton_ID = "StoryLeftButton";
var StoryRightButton_ID = "StoryRightButton";
var StoryHeroNameTextEntry_ID = "HeroNameTextEntry";
var StoryHeroGenderButtonMale_ID = "HeroGenderButtonMale";
var StoryHeroGenderButtonFemale_ID = "HeroGenderButtonFemale";
var StoryHeroInfoDisplayName_ID = "HeroInfoDisplayName";
var StoryHeroInfoDisplayGender_ID = "HeroInfoDisplayGender";
var StoryHeroInfoDisplayInventory_ID = "HeroInfoDisplayInventory";
var StoryHeroInfoDisplayStats_ID = "HeroInfoDisplayStats";

///////////////////////////////////////
////////// CREATE HOOKS HERE //////////
///////////////////////////////////////

// OnPageDone - Called when a story page is loaded
// obj - The page object
// obj_str - The name of the page object
// inv - The player's inventory
// strength - The player's current strength
// intel - The player's current intellect
function OnPageDone(obj, obj_str, inv, strength, intel)
{
	// Do stuff here
}

// OnInvItemAdded - Called when an item is added to the player's inventory
// inv - The player's inventory
// item - The item added
function OnInvItemAdded(inv, item)
{
	// Do stuff here
}

// OnStatChanged - Called when a stat is changed
// changed_stat - The stat changed
// old_val - The old level
// new_val - The new level
function OnStatChanged(changed_stat, old_val, new_val)
{
	// Do stuff here
}

// OnInfoSet - Called when the player chooses their name and gender
// ply_name - The player's name
// gender - The gender bool. false = male, true = female
// gender_str - The gender string
function OnInfoSet(ply_name, gender, gender_str)
{
	// Do stuff here
}

// OnCommandRun - Called when the player runs a debugging function
// command - The name of the command
// args - An array containing the arguments
function OnCommandRun(command, args)
{
	// Do stuff here
}

///////////////////////////////////////
////////// CREATE HOOKS HERE //////////
///////////////////////////////////////

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
	this.needed_strength = 	tab.needed_strength || 	0;		// How much strength does the player need?
	this.needed_intel = 	tab.needed_intel || 	0;		// How much intellect does the player need?
	this.needed_items = 	tab.needed_items || 	[];		// What items does the player need?
	this.item_punish = 	tab.item_punish || 	[]; 		// Kill the player if they don't have these items?
	this.punish_page = 	tab.punish_page || 	"PAGE_LOSE";	// What page "kills" the player? (See item_punish)
	this.take_items = 	tab.take_items || 	[];		// Take these items from the player if they have them
	this.lose =		tab.lose || 		false;		// Does the player lose on this page?
	this.win = 		tab.win || 		false;		// Does the player win on this page?
}

// Set them to a value so they aren't undefined before "creation" - NO LONGER NECESSARY, JUST KEEPING
// var PAGE_START, PAGE_LOSE, PAGE_WIN, PAGE_CURRENT = 1;

// Create default pages, feel free to edit values but do not change object name
var PAGE_START = new CreatePage({
	page_id : 1,
	main_text : "You wake up in a small house. There is a table with an apple, knife, and book on it. You pick up the apple and decide if you are going to take the knife or the book.",
	header : "Welcome to Your Story",
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
				// eval is needed because page.punish_page is a string containing the
				// name of the page, not the actual page object
				DoPage(eval(page.punish_page));
			}
		}
	}
	HeroStrength += page.give_strength;
	HeroIntel += page.give_intel;
	if (HeroStrength < page.needed_strength || HeroIntel < page.needed_intel)
	{
		// eval is needed because page.punish_page is a string containing the
		// name of the page, not the actual page object
		DoPage(eval(page.punish_page));
	}
	if (page.lose)
	{
		HeroStrength += DefaultStats;
		HeroIntel += DefaultStats;
		HeroInv = DefaultItems;
	}
	UpdateInfoBox();
}

function SetHeroGender(gender)
{
	if (gender)
	{
		HeroGender = "Female";
	}
	else
	{
		HeroGender = "Male";
	}
	HeroName = document.getElementById(StoryHeroNameTextEntry_ID).value;
	document.getElementById(StoryHeroNameTextEntry_ID).remove();
	document.getElementById(StoryHeroGenderButtonMale_ID).remove();
	document.getElementById(StoryHeroGenderButtonFemale_ID).remove();
	document.getElementById(StoryHeroInfoDisplayName_ID).innerHTML = "Name: " + HeroName;
	document.getElementById(StoryHeroInfoDisplayGender_ID).innerHTML = "Gender: " + HeroGender;
	if (gender) // Make a new if statement so we have the update HeroName and HeroGender in our scope
	{
		// Female easter eggs
		/*
		if (HeroName == "Marie Curie")
		{
			HeroInv.push("Radiation posioning"); // That's pretty dark
			UpdateInfoBox(); // Actually a bit too dark
		}
		*/
	}
	else
	{
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
		else if(HeroName == "Cat Dog Team")
		{
			HeroInv.push("pugtato and grumpy cat");
			UpdateInfoBox();
	}
}

function UpdateInfoBox()
{
	var InvStr = "Inventory: ";
	var StatStr = "Stats: Strength: " + HeroStrength + ", Intellect: " + HeroIntel;
	for (var i = 0; i < HeroInv.length; i++)
	{
		// Check for last inventory item
		if (i == HeroInv.length - 1)
		{
			// No comma
			InvStr += HeroInv[i];
		}
		else
		{
			// Append comma
			InvStr += HeroInv[i] + ", ";	
		}
    		
	}
	document.getElementById(StoryHeroInfoDisplayInventory_ID).innerHTML = InvStr;
	document.getElementById(StoryHeroInfoDisplayStats_ID).innerHTML = StatStr;
}

// Debugging commands
function AddInventoryItem(item)
{
	HeroInv.push(item);
	UpdateInfoBox();
	console.log(item + " has been added to inventory");
	OnCommandRun("AddInventoryItem", [item]);
}

function AddHeroStrength(num)
{
	HeroStrength += num;
	UpdateInfoBox();
	console.log("Hero strength is now " + num);
	OnCommandRun("AddHeroStrength", [num]);
}

function AddHeroIntellect(num)
{
	HeroIntel += num;
	UpdateInfoBox();
	console.log("Hero intellect is now " + num);
	OnCommandRun("AddHeroIntellect", [num]);
}

function ClearInventory()
{
	HeroInv = [];
	UpdateInfoBox();
	console.log("Inventory cleared");
	OnCommandRun("ClearInventory", []);
}

function ResetStrength()
{
	HeroStrength = DefaultStats;
	UpdateInfoBox();
	console.log("Strength reset");
	OnCommandRun("ResetStrength", []);
}

function ResetIntellect()
{
	HeroIntel = DefaultStats;
	UpdateInfoBox();
	console.log("Intellect reset");
	OnCommandRun("ResetIntellect", []);
}

function ResetStats()
{
	HeroStrength = DefaultStats;
	HeroIntel = DefaultStats;
	UpdateInfoBox();
	console.log("Stats reset");
	OnCommandRun("ResetStats", []);
}

function YourStoryHelp()
{
	console.log(HelpTextPre + HelpText);
	OnCommandRun("YourStoryHelp", []);
}

// On page load
function StartTheAdventure()
{
	for (var i = 0; i < DefaultItems.length; i++)
	{
		HeroInv.push(DefaultItems[i]);
	}
	DoPage(PAGE_START);
	console.log(YS_LONG_NAME + " has been started!\nVersion: " + YS_VERSION);
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
	left_page : "PAGE_ARENA",
	right_text : "Go to church", 
	right_page : "PAGE_CHURCH",
	give_strength : 5,
	give_items : ["Knife"]
});
var PAGE_1 = new CreatePage({
	page_id : 3,
	header : "You walk outside and see a path.",
	main_text : "The path leads to an arena. You look around some more and find another path that leads to a church.",
	left_text : "Go to arena",
	left_page : "PAGE_ARENA",
	right_text : "Go to church", 
	right_page : "PAGE_CHURCH",
	give_intel : 5,
	give_items : ["Book"]
});
var PAGE_ARENA = new CreatePage({
	page_id : 3,
	header : "You walk towards the arena and see that there is a fight.",
	main_text : "There aren't that many people watching, and there is no security. Do you want to fight or train?",
	left_text : "Fight",
	left_page : "PAGE_FIGHT",
	right_text : "Train", 
	right_page : "PAGE_TRAIN"
});
var PAGE_FIGHT = new CreatePage({
	page_id : 3,
	header : "You decide to fight.",
	main_text : "You run into the arena. The crowd starts booing. How shall you fight.",
	left_text : "Brute force",
	left_page : "PAGE_BRUTE",
	right_text : "Tactics", 
	right_page : "PAGE_TACTICS"
});
var PAGE_BRUTE = new CreatePage({
	page_id : 3,
	header : "You use brute force to fight.",
	main_text : "You swing and stab with all your might.",
	left_text : "Attack",
	left_page : "PAGE_ATTACK",
	right_text : "Block", 
	right_page : "PAGE_BLOCK"
});
var PAGE_BLOCK = new CreatePage({
	page_id : 3,
	header : "You attempt to block.",
	main_text : "You are struck with a heavy, blunt attack and pass out.",
	left_text : "Wake up",
	left_page : "PAGE_START",
	right_text : "Wake up", 
	right_page : "PAGE_START"
});
var PAGE_BRUTE_ATTACK = new CreatePage({
	page_id : 3,
	header : "You attack brutally.",
	main_text : "You successfully destroy your target.",
	left_text : "Run Away",
	left_page : "PAGE_ARENA",
	right_text : "Block", 
	right_page : "PAGE_BLOCK",
	punish_page : "PAGE_WEAK",
	needed_strength : 10
});
var PAGE_TACTIC_ATTACK = new CreatePage({
	page_id : 3,
	header : "You flank your opponent.",
	main_text : "You successfully destroy your target.",
	left_text : "Attack",
	left_page : "PAGE_ATTACK",
	right_text : "Block", 
	right_page : "PAGE_BLOCK",
	punish_page : "PAGE_WEAK",
	needed_intel : 10
});
var PAGE_WEAK = new CreatePage({
	page_id : 3,
	header : "You are too weak to fight.",
	main_text : "You swing and stab with all your might, but you are too weak. Your enemy's sword hits you, and you die.",
	left_text : "Accept defeat",
	left_page : "PAGE_LOSE",
	right_text : "Accept defeat", 
	right_page : "PAGE_LOSE"
});
var PAGE_CHURCH = new CreatePage({
	page_id : 3,
	header : "You walk towards the church.",
	main_text : "There are people. They seem to be waiting for the priest to show up.",
	left_text : "Sit down with the people",
	left_page : "PAGE_CHURCH_SIT",
	right_text : "Pretend to be a priest", 
	right_page : "PAGE_PRIEST"
});
var PAGE_CHURCH_SIT = new CreatePage({
	page_id : 3,
	header : "You sit down on one of the pues.",
	main_text : "You have no idea why you did this. The priest is obviously not coming.",
	left_text : "Get up",
	left_page : "PAGE_CHURCH",
	right_text : "Wait", 
	right_page : "PAGE_WAIT"
});
var PAGE_WAIT = new CreatePage({
	page_id : 3,
	header : "You wait.",
	main_text : "And you wait. And you wait. Everybody leaves. You keep waiting. You die where you sit. You never stopped waiting, even break your thirst.",
	left_text : "Accept defeat",
	left_page : "PAGE_LOSE",
	right_text : "Accept defeat", 
	right_page : "PAGE_LOSE"
});
var PAGE_PRIEST = new CreatePage({
	page_id : 3,
	header : "You get up on to the stand.",
	main_text : "The people start clapping. They think you are the priest. What do you say.",
	left_text : "Praise",
	left_page : "PAGE_PRAISE",
	right_text : "Start a song", 
	right_page : "PAGE_SONG"
});
var PAGE_PRAISE = new CreatePage({
	page_id : 3,
	header : "You praise.",
	main_text : "The people clap for your praise. You realise how good of a priest you are.",
	left_text : "Leave",
	left_page : "PAGE_LEAVE_CHURCH",
	right_text : "More praise", 
	right_page : "PAGE_MORE_PRAISE",
	give_intel : 5
});
var PAGE_SONG = new CreatePage({
	page_id : 3,
	header : "You sit down at the organ.",
	main_text : "You begin to play and the people start singing. Before long, they realise you cannot play the organ, and you are obviously a fake priest. You are stoned and beaten to death.",
	left_text : "Accept defeat",
	left_page : "PAGE_LOSE",
	right_text : "Accept defeat", 
	right_page : "PAGE_LOSE"
});
var PAGE_MORE_PRAISE = new CreatePage({
	page_id : 3,
	header : "You praise again.",
	main_text : "You continue to and the people continue to clap until the stop. You keep going. You are revealed as a fake. You are stoned and beaten to death.",
	left_text : "Accept defeat",
	left_page : "PAGE_LOSE",
	right_text : "Accept defeat", 
	right_page : "PAGE_LOSE"
});
var PAGE_LEAVE_CHURCH = new CreatePage({
	page_id : 3,
	header : "You leave.",
	main_text : "You walk out of the church, the people's claps and cheers become quiet. A rather puzzled looking man walks up to the door you left from.",
	left_text : "Run away",
	left_page : "PAGE_RUN",
	right_text : "Walk away slowly", 
	right_page : "PAGE_CHURCH_WALK"
});
var PAGE_CHURCH_WALK = new CreatePage({
	page_id : 3,
	header : "You walk.",
	main_text : "As you walk away slowly, a crowd of people run from the church, pitchforks and torches in hand. The man was the priest. He told the people. The crowd catches up to you and kills you. Faker.",
	left_text : "Accept defeat",
	left_page : "PAGE_LOSE",
	right_text : "Accept defeat", 
	right_page : "PAGE_LOSE"
});
var PAGE_RUN = new CreatePage({
	page_id : 3,
	header : "You run away.",
	main_text : "You run as fast as you can to the forest. As you finally get there and hide in the bushes, you can see another town",
	left_text : "Explore the forest",
	left_page : "PAGE_FOREST",
	right_text : "Go to the town", 
	right_page : "PAGE_TOWN"
});

///////////////////////////////////////
////// ACTUAL STORY BELOW HERE ////////
///////////////////////////////////////

///////////////////////////////////////
////////// CREATE PAGES HERE //////////
///////////////////////////////////////

var YS_LOADING = false;
