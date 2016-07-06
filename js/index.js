var FirstPage;
var HeroName;
var HeroAbilites = {};

// Doesn't actually create a table, but "sanitizes" it.
function CreatePage(tab)
{ // Get rekt mr. stark
	obj = 			tab;
	obj.id = 		obj.id || 		1;
	obj.main_text = 	obj.main_text || 	"Unassigned text";
	obj.header = 		obj.header || 		"";
	obj.has_item = 		obj.has_item || 	false;
	obj.left_text = 	obj.left_text || 	"Left text";
	obj.right_text = 	obj.right_text || 	"Right text";
	obj.background_color = 	obj.background_color || "white";
	obj.wrapper_color = 	obj.wrapper_color || 	"blue";
	obj.text_color = 	obj.text_color || 	"white";
	obj.give_item = 	obj.give_item || 	"";
	obj.does_need_items = 	obj.does_need_items || 	false;
	obj.need_items = 	obj.need_items || 	[];
	return obj;
}

function DoPage(page)
{
	document.body.style.backgroundColor = page.background_color;
	$("")
}
