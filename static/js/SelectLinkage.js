/* Zerock 2013-09-10 */
function setSelectData(SelectSelector, Source, IDKey, DispKey, DefOption) {
	$Select = $(SelectSelector); resetSelect($Select, DefOption);
	for (var i in Source) {
		Option = Source[i][DispKey]; Value = Source[i][IDKey];
		addOption($Select, Option, Value);
	}
}

function getDataByKeyValue(Source, Key, Value) {
	var Result = new Object();
	for (var i in Source) {
		Val = Source[i][Key];
		if (Val == Value) { Result[i] = Source[i]; }
	}
	return Result;
}

function addOption($Select, Option, Value)
{ $Select.append('<option value="' + Value + '">' + Option + '</option>'); }

function resetSelect($Select, Default)
{ $Select.children().remove(); if (Default) { addOption($Select, Default, 0); } }