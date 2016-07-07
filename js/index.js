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
	var obj = 		tab; // Don't mind this
	obj.page_id: 		tab.page_id || 		1;		// Page ID (Must be unique)
	obj.main_text : 	tab.main_text || 	"Main text";	// What text should show up on the page?
	obj.header : 		tab.header || 		"Header";	// What should the header say?
	obj.has_item : 		tab.has_item || 	false;		// Does the page give (an) item(s) to the player?
	obj.left_text : 	tab.left_text || 	"Left text"; 	// What text is on the left button
	obj.left_page : 	tab.left_page || 	{}; 		// What page does the left button go to?
	obj.right_text : 	tab.right_text || 	"Right text"; 	// What text is on the right button?
	obj.right_page : 	tab.right_page || 	{}; 		// What page does the right button go to?
	obj.background_color : 	tab.background_color || "purple"; 	// What should the background color be?
	obj.wrapper_color : 	tab.wrapper_color || 	"purple"; 	// What should the wrapper color be?
	obj.text_color : 	tab.text_color || 	"purple"; 	// What should the text color be?
	obj.give_item : 	tab.give_items || 	[]; 		// What items should we give the player?
	obj.does_need_items : 	tab.does_need_items || 	false; 		// Does the player need any items?
	obj.needed_items : 	tab.needed_items || 	[];		// What items does the player need?
	obj.item_punish : 	tab.item_punish || 	[]; 		// Kill the player if they don't have these items?
	obj.punish_page : 	tab.punish_page || 	PAGE_LOSE;	// What page "kills" the player? (See item_punish)
	obj.take_items : 	tab.take_items || 	[];		// Take these items from the player if they have them
	obj.lose :		tab.lose || 		false;		// Does the player lose on this page?
	obj.win : 		tab.win || 		false;		// Does the player win on this page?
	return obj; // Don't mind this either
}

// Create default pages
var PAGE_START, PAGE_LOSE, PAGE_WIN, PAGE_CURRENT;
PAGE_START = CreatePage({page_id = 1,
	main_text : "Welcome to Your Story. You come to a fork in the path.",
	header : "Welcome",
	left_text : "Go left",
	left_page : PAGE_WIN,
	right_text : "Go right",
	right_page : PAGE_LOSE
});
PAGE_LOSE = CreatePage({page_id = 2,
	main_text : "You have died.",
	header : "You Lose",
	left_text : "Start over",
	left_page : PAGE_START,
	right_text : "Start over",
	right_page : PAGE_START
});
PAGE_WIN = CreatePage({page_id = 3,
	main_text : "You have won!",
	header : "Congratulations!",
	left_text : "Start over",
	left_page : PAGE_START,
	right_text : "Start over", 
	right_page : PAGE_START
});

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
