var FirstPage;
var CurPage;
var HeroName;
var HeroAbilites = {};
var HeroInv = [];

// Doesn't actually create a table, but "sanitizes" it.
function CreatePage(tab)
{
	obj = 			tab; // Don't mind this
	obj.id = 		obj.id || 		1;		// Page ID (Must be unique)
	obj.main_text = 	obj.main_text || 	"Main text";	// What text should show up on the page?
	obj.header = 		obj.header || 		"Header";	// What should the header say?
	obj.has_item = 		obj.has_item || 	false;		// Does the page give (an) item(s) to the player?
	obj.left_text = 	obj.left_text || 	"Left text"; 	// What text is on the left button
	obj.left_page = 	obj.legt_page || 	{}; 		// What page does the left button go to?
	obj.right_text = 	obj.right_text || 	"Right text"; 	// What text is on the right button?
	obj.background_color = 	obj.background_color || "white"; 	// What should the background color be?
	obj.wrapper_color = 	obj.wrapper_color || 	"blue"; 	// What should the wrapper color be?
	obj.text_color = 	obj.text_color || 	"white"; 	// What should the text color be?
	obj.give_item = 	obj.give_items || 	[]; 		// What items should we give the player?
	obj.does_need_items = 	obj.does_need_items || 	false; 		// Does the player need any items?
	obj.needed_items = 	obj.needed_items || 	[];		// What items does the player need?
	obj.item_punish = 	obj.item_punish || 	[]; 		// Kill the player if they don't have these items?
	obj.take_items = 	obj.take_items || 	[];		// Take these items from the player if they have them
	obj.lose =		obj.lose || 		false;		// Does the player lose on this page?
	obj.win = 		obj.win || 		false;		// Does the player win on this page?
	return obj; // Don't mind this either
}

function DoPage(page)
{
	document.body.style.backgroundColor = page.background_color;
	$("#StoryHeader").html("<h2>" + page.header + "</h2>")
	$("#StoryMainText").html("<p>" + page.main_text + "</p>")
	if (page.has_item)
	{
		for (var i = 0; i < obj.give_items.length; i++) {
    			HeroInv.push(obj.give_items[i])
		}
	}
	if (page.does_need_items)
	{
		for (var i = 0; i < obj.needed_items.length; i++) {
    			HeroInv.push(obj.give_items[i])
		}
	}
}
