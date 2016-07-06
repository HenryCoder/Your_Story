var FirstPage;
var CurPage;
var HeroName;
var HeroAbilites = {};
var HeroInv = [];

// Doesn't actually create a table, but "sanitizes" it.
function CreatePage(tab)
{
	obj = 			tab;
	obj.id = 		obj.id || 		1;
	obj.main_text = 	obj.main_text || 	"Unassigned text";
	obj.header = 		obj.header || 		"";
	obj.has_item = 		obj.has_item || 	false;
	obj.left_text = 	obj.left_text || 	"Left text";
	obj.left_page = 	obj.legt_page || 	{};
	obj.right_text = 	obj.right_text || 	"Right text";
	obj.background_color = 	obj.background_color || "white";
	obj.wrapper_color = 	obj.wrapper_color || 	"blue";
	obj.text_color = 	obj.text_color || 	"white";
	obj.give_item = 	obj.give_item || 	"";
	obj.does_need_items = 	obj.does_need_items || 	false;
	obj.need_items = 	obj.need_items || 	[];
	obj.lose =		obj.lose || 		false;
	obj.win = 		obj.win || 		true'
	return obj;
}

function DoPage(page)
{
	document.body.style.backgroundColor = page.background_color;
	$("StoryHeader1").html("<h2>" + page.header + "</h2>")
	$("StoryMainText").html("<p>" + page.main_text + "</p>")
}
