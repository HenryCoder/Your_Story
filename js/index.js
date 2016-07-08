var YS_LOADING = true;
var IsHeroNameSet = false;
var IsHeroGenderSet = false;
var HeroName = "Unnamed";
var HeroGender = "Unknown";
var HeroStats = {"Strength":5, "Intellect":5};
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
	this.has_item = 	tab.has_item || 	false;		// Does the page give (an) item(s) to the player?
	this.left_text = 	tab.left_text || 	"Left text"; 	// What text is on the left button
	this.left_page = 	tab.left_page || 	{}; 		// What page does the left button go to?
	this.right_text = 	tab.right_text || 	"Right text"; 	// What text is on the right button?
	this.right_page = 	tab.right_page || 	{}; 		// What page does the right button go to?
	this.background_color = tab.background_color || "purple"; 	// What should the background color be?
	this.wrapper_color = 	tab.wrapper_color || 	"magenta"; 	// What should the wrapper color be?
	this.text_color = 	tab.text_color || 	"white"; 	// What should the text color be?
	this.give_items = 	tab.give_items || 	[]; 		// What items should we give the player?
	this.gives_stats = 	tab.gives_stats || 	false;		// Does the page give the player stats?
	this.give_stats = 	tab.give_stats || 	{};		// What stats should be added to the player's current stats?
	this.needs_stats = 	tab.needs_stats || 	false;		// Does the page need stats?
	this.needed_stats = 	tab.needed_stats || 	{};		// What stats does the player need to live?
	this.stat_punish = 	tab.stat_punish || 	true;		// Does the player die if they don't have the stats above? (Can't be disabled ATM)
	this.does_need_items = 	tab.does_need_items || 	false; 		// Does the player need any items?
	this.needed_items = 	tab.needed_items || 	[];		// What items does the player need?
	this.item_punish = 	tab.item_punish || 	[]; 		// Kill the player if they don't have these items?
	this.punish_page = 	tab.punish_page || 	"PAGE_LOSE";	// What page "kills" the player? (See item_punish)
	this.take_items = 	tab.take_items || 	[];		// Take these items from the player if they have them
	this.lose =		tab.lose || 		false;		// Does the player lose on this page?
	this.win = 		tab.win || 		false;		// Does the player win on this page?
}

// Set them to a value so they aren't undefined before "creation" - NO LONGER NECESSARY, JUST KEEPING
// var PAGE_START, PAGE_LOSE, PAGE_WIN, PAGE_CURRENT = 1;

// Create default pages (and Charles thinks I don't organize my code enough, at least I don't use separate functions every page, ha!)
var PAGE_START = new CreatePage({
	page_id : 1,
	main_text : "Welcome to Your Story. You come to a fork in the path.",
	header : "Welcome",
	left_text : "Go left",
	left_page : "PAGE_WIN",
	right_text : "Go right",
	right_page : "PAGE_LOSE"
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
	if (page.has_item)
	{
		for (var i = 0; i < page.give_items.length; i++)
		{
    			HeroInv.push(page.give_items[i]);
		}
	}
	if (page.does_need_items)
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
		for (var i = 0; i < page.item_punish.length; i++)
		{
    			if  (!contains.call(HeroInv, page.item_punish[i]))
    			{
    				DoPage(eval(page.punish_page));
    			}
		}
	}
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
	HeroName = document.getElementById("HeroNameTextEntry").value;
	document.getElementById("HeroNameTextEntry").remove();
	document.getElementById("HeroGenderButtonMale").remove();
	document.getElementById("HeroGenderButtonFemale").remove();
	document.getElementById("HeroInfoDisplayName").innerHTML = "Name: " + HeroName;
	document.getElementById("HeroInfoDisplayGender").innerHTML = "Gender: " + HeroGender;
}

function GoBackToStartPage()
{
	DoPage(PAGE_START);
}

window.onload = GoBackToStartPage;

var YS_LOADING = false;
