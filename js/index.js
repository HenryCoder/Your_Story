var YS_LOADING = true;
var HeroName;
var HeroAbilites = {};
var HeroInv = [];

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

// Doesn't actually create a table, but "sanitizes" it.
function CreatePage(tab)
{
	//var obj = 		tab; // Don't mind this
	this.page_id = 		tab.page_id || 		1;		// Page ID (Must be unique)
	this.main_text = 	tab.main_text || 	"Main text";	// What text should show up on the page?
	this.header = 		tab.header || 		"Header";	// What should the header say?
	this.has_item = 	tab.has_item || 	false;		// Does the page give (an) item(s) to the player?
	this.left_text = 	tab.left_text || 	"Left text"; 	// What text is on the left button
	this.left_page = 	tab.left_page || 	{}; 		// What page does the left button go to?
	this.right_text = 	tab.right_text || 	"Right text"; 	// What text is on the right button?
	this.right_page = 	tab.right_page || 	{}; 		// What page does the right button go to?
	this.background_color = tab.background_color || "purple"; 	// What should the background color be?
	this.wrapper_color = 	tab.wrapper_color || 	"purple"; 	// What should the wrapper color be?
	this.text_color = 	tab.text_color || 	"purple"; 	// What should the text color be?
	this.give_item = 	tab.give_items || 	[]; 		// What items should we give the player?
	this.does_need_items = 	tab.does_need_items || 	false; 		// Does the player need any items?
	this.needed_items = 	tab.needed_items || 	[];		// What items does the player need?
	this.item_punish = 	tab.item_punish || 	[]; 		// Kill the player if they don't have these items?
	this.punish_page = 	tab.punish_page || 	PAGE_LOSE;	// What page "kills" the player? (See item_punish)
	this.take_items = 	tab.take_items || 	[];		// Take these items from the player if they have them
	this.lose =		tab.lose || 		false;		// Does the player lose on this page?
	this.win = 		tab.win || 		false;		// Does the player win on this page?
	//return obj; // Don't mind this either
}

// Create default pages
var PAGE_START = new CreatePage({
	this.page_id = 1,
	this.main_text = "Welcome to Your Story. You come to a fork in the path.",
	this.header = "Welcome",
	this.left_text = "Go left",
	this.left_page = PAGE_WIN,
	this.right_text = "Go right",
	this.right_page = PAGE_LOSE
});
var PAGE_LOSE = new CreatePage({
	this.page_id = 2,
	this.main_text = "You have died.",
	this.header = "You Lose",
	this.left_text = "Start over",
	this.left_page = PAGE_START,
	this.right_text = "Start over",
	this.right_page = PAGE_START
});
var PAGE_WIN = new CreatePage({
	this.page_id = 3,
	this.main_text = "You have won!",
	this.header = "Congratulations!",
	this.left_text = "Start over",
	this.left_page = PAGE_START,
	this.right_text = "Start over", 
	this.right_page = PAGE_START
});
var PAGE_CURRENT = PAGE_START;

function DoPage(page)
{
	PAGE_CURRENT = page;
	document.body.style.backgroundColor = page.background_color;
	$("#StoryHeader").html("<h2>" + page.header + "</h2>");
	$("#StoryMainText").html("<p>" + page.main_text + "</p>");
	$("#StoryLeftButton").html("<button id=\"StoryLeftButton\" onclick=\"DoPage(" + page.left_page + ")\">" + page.left_text + "</button>");
	$("#StoryRightButton").html("<button id=\"StoryRightButton\" onclick=\"DoPage(" + page.right_page + ")\">" + page.right_text + "</button>");
	if (page.has_item)
	{
		for (var i = 0; i < obj.give_items.length; i++)
		{
    			HeroInv.push(obj.give_items[i]);
		}
	}
	if (page.does_need_items)
	{
		for (var i = 0; i < obj.take_items.length; i++)
		{
    			if  (contains.call(HeroInv, obj.take_items[i]))
    			{
    				if (HeroInv.indexOf(obj.take_items[i]) > -1)
    				{
					HeroInv.splice(HeroInv.indexOf(obj.take_items[i]), 1);
				}
    			}
		}
		for (var i = 0; i < obj.item_punish.length; i++)
		{
    			if  !(contains.call(HeroInv, obj.item_punish[i]))
    			{
    				DoPage(PAGE_LOSE)
    			}
		}
	}
}

document.onload = function() {DoPage(PAGE_START)};

var YS_LOADING = false;
