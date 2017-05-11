initContext = function(Schedule){
    // Building context menu
contextMenuFunctions = {
	// Module menu items
    delete: function (event, ui) {
		var tar = null;
		if (ui.target.tagName !== 'DIV') {
			tar = $(ui.target).parent();
		} else {
			tar = $(ui.target);
		}
		Schedule.deleteMod(Schedule.data.selected_schedule, $(tar).attr('entry'), $(tar).attr('index'), function () {
			$(tar).remove();
			reIndex();
		});
	},
	insertMod: function (where, event, ui) {
		if (ui.target.tagName !== 'DIV') {
			var tar = $(ui.target).parent();
		} else {
			var tar = $(ui.target).parent();
		}
		var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
			.append($('<input style="display: inline;" type="text" name="new_module" id="new_module" />'))
			.on('keydown', function (e) {
				if (e.which == 13) {
					$('#submit_new').click();
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			})
			.css('left', event.pageX)
			.css('top', (event.pageY) - 50)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
					var name = $('#new_module').val(),
					entry = $(tar).attr('entry')
						ref = tar,
					addTO = (where === 'above') ? 1 : -1
					nIx = (Number($(ref).attr('index')) + addTO);

					insertRow(name, entry, where, ref,Schedule);
					reIndex();
					$('#new_module_dialog').remove();
					Schedule.insertItm(Schedule.data.selected_schedule, entry, $('[id="' + name + '"]').attr('index'), {
						"name": name,
						"time": 0
					}, function () {
						//showSchedule(Schedule)
					});
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}));
		$('body').append(nMod);
		$('#new_module').focus();
	},
    insertModAbove: function(event, ui){
        contextMenuFunctions.insertMod("above", event, ui);
    },
	insertModBelow: function (event, ui) {
		contextMenuFunctions.insertMod("below", event, ui);
	},
	renameMod: function (event, ui) {
		if (ui.target.tagName !== 'DIV') {
			var tar = $(ui.target).parent();
		} else {
			var tar = $(ui.target).parent();
		}
		var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
			.append($('<input style="display: inline;" type="text" name="new_module" id="new_module" />'))
			.on('keydown', function (e) {
				if (e.which == 13) {
					$('#submit_new').click();
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			})
			.css('left', event.pageX)
			.css('top', (event.pageY) - 50)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
					var ent = $(tar).parents('.entry').attr('id'),
						ix = $(tar).attr('index'),
						key = "name",
						value = $('#new_module').val();
					Schedule.changeItm(Schedule.data.selected_schedule,ent,ix,key,value,function(){
						$(tar).children('.class_name').html(value);
						reIndex();
						$('#new_module_dialog').remove();
					});
					
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}));	
			$('body').append(nMod);
			$('#new_module').focus();

	},
	setTimeMod: function (event, ui){
		if (ui.target.tagName !== 'DIV') {
			var tar = $(ui.target).parent();
		} else {
			var tar = $(ui.target).parent();
		}
		var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
			.append($('<input style="display: inline;" type="number" name="new_module" id="new_module" />'))
			.on('keydown', function (e) {
				if (e.which == 13) {
					$('#submit_new').click();
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			})
			.css('left', event.pageX)
			.css('top', (event.pageY) - 50)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
					var ent = $(tar).parents('.entry').attr('id'),
						ix = $(tar).attr('index'),
						key = "name",
						value = $('#new_module').val();
					Schedule.updateModDur(Schedule.data.selected_schedule,ent,ix,value,function(){
						var
							nTime = value,
							nTimeDisplay = (nTime<61) ? (nTime) +" Min." : parseFloat((nTime/60).toFixed(2)) + " Hr.";
						
						$(tar).children('.classTime').text(nTimeDisplay);
						$(tar).children('.classTime').attr('time',nTime);
						$(tar).children('.item_time').attr('time',nTime);

						$('#new_module_dialog').remove();
					});
					
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}));	
			$('body').append(nMod);
			$('#new_module').focus();
	},
    // Entries menu items
    deleteEntry: function (event, ui) {
		var tar = null;
		if (!$(ui.target).hasClass('entry')) {
			tar = $(ui.target).parentsUntil('.entry');
		} else {
			tar = $(ui.target);
		}
        alert("Deleted day "+$(tar).attr('id'));
		Schedule.deleteEntry(Schedule.data.selected_schedule, $(tar).attr('id'), function () {
			$(tar).remove();
			reIndex();
		});
	},
    insertEntry: function (event, ui){
        var tar = null;
		if (!$(ui.target).hasClass('entry')) {
			tar = $(ui.target).parents('div.entry');
		} else if($(ui.target).hasClass('entry')) {
			tar = $(ui.target);
		}
        var where = "below";
        // Need to add another option here for non-positional addition of entries?

        var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
			.append($('<input style="display: inline;" type="text" name="new_module" id="new_module" />'))
			.on('keydown', function (e) {
				if (e.which == 13) {
					$('#submit_new').click();
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			})
			.css('left', event.pageX)
			.css('top', (event.pageY) - 50)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
					var name = $('#new_module').val(),
						ref = tar,
					    addTO = (where === 'above') ? 1 : -1,
					    nIx = (Number($(ref).attr('id')) + addTO);
                    console.log(ref);
					insertEntry(nIx, where, ref);
                    reIndex();
					$('#new_module_dialog').remove();
					Schedule.insertEntry(Schedule.data.selected_schedule, name, $('[id="' + name + '"]').attr('index'), function () {
						showSchedule(Schedule)
					});
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}));
		$('body').append(nMod);
		$('#new_module').focus();

    },
    renameEntry: function (event, ui){
        var tar = null;
		if (!$(ui.target).hasClass('entry')) {
			tar = $(ui.target).parents('div.entry');
		} else if($(ui.target).hasClass('entry')) {
			tar = $(ui.target);
		}
        var where = "below";
        // Need to add another option here for non-positional addition of entries?

        var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
			.append($('<input style="display: inline;" type="text" name="new_module" id="new_module" />'))
			.on('keydown', function (e) {
				if (e.which == 13) {
					$('#submit_new').click();
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			})
			.css('left', event.pageX)
			.css('top', (event.pageY) - 50)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
					var name = $('#new_module').val(),
						ref = tar,
					    addTO = (where === 'above') ? 1 : -1,
					    nIx = (Number($(ref).attr('id')));
                    console.log(ref);
					$(tar).children('.entry_label').html(name);
                    reIndex();
					$('#new_module_dialog').remove();
					Schedule.renameEntry(Schedule.data.selected_schedule, name, nIx, function () {
						showSchedule(Schedule)
					});
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}));
		$('body').append(nMod);
		$('#new_module').focus();

    }
};

// Modules menu
ModulesMenu = [
    {title: "Delete", action: contextMenuFunctions.delete}, 
	{title: "Rename", action: contextMenuFunctions.renameMod}, 
    {title: "---"},
    {title: "Insert Above", action: contextMenuFunctions.insertModAbove },
    {title: "Insert Below", action: contextMenuFunctions.insertModBelow },
    { title: "---" },   
	{title: "Set Time (Minutes)", action: contextMenuFunctions.setTimeMod},
    { title: "---" },
    { title: "Change Color <input type='text' id='pickcolor' size=2 />", addClass: "colorer" }                 
];
EntriesMenu = [
    {title: "Rename", action: contextMenuFunctions.renameEntry},
    {title: "Delete", action: contextMenuFunctions.deleteEntry},
    {title: "---"},
    {title: "New Day", action: contextMenuFunctions.insertEntry},
	{title: "Change Color <input type='text' id='pickcolor' size=2 />", addClass: "colorer" }                 
]


// Initializing context menu
contextMenu = {
    delegate: ".module,.entry",
    autoFocus: true,
    preventContextMenuForPopup: true,
    preventSelect: true,
    taphold: true,
    menu: [],
    beforeOpen: function(event, ui) {
        // replace the whole menu depending on click target type
        if( $(ui.target).hasClass("module") || $(ui.target).parents(".module").length  ) {
            context = "module";
			$(document).contextmenu("replaceMenu", ModulesMenu);
        } 
        else if( $(ui.target).hasClass("entry_label") || $(ui.target).parents(".entry_label").length ) {
            context = "entry";
			$(document).contextmenu("replaceMenu", EntriesMenu);
        }
    },
	open: function(event, ui){
		if(context === "module"){
			if(ui.target.tagName !== 'DIV'){
				var tar = $(ui.target).parent();
			} else { var tar = $(ui.target); }
		}
		else if (context === "entry"){
			if (!$(ui.target).hasClass('entry')) {
				tar = $(ui.target).parents('div.entry');
			} else if($(ui.target).hasClass('entry')) {
				tar = $(ui.target);
			}
		}
		$('#pickcolor').spectrum({
			color: (context === "module") ? $(tar).css('background') : $(tar).children('.header_contain').css('background'),
			preferredFormat: "rgb",
			showInitial: true,
			showInput: true,
    		allowEmpty:true,
			showAlpha: true,
			showButtons: false,
			clickoutFiresChange: true,
			containerClassName: 'color-chooser-window',
			palette: [],
			move: function(color) {
				if(context === "module"){
					if(color){
						$(tar).css('background',color.toRgbString());
					} else { $(tar).css('background',''); }
				} else if (context === "entry"){
					console.log($(tar).children('.header_contain'));
					if(color){
						$(tar).children('.header_contain').css('background',color.toRgbString());
					} else { $(tar).children('.header_contain').css('background',''); }
				}
				
			},
			change: function(color) {
				if(color){					
					var changeTo = color.toRgbString();			
				} else { changeTo=null; }
				if(context === "module"){
					Schedule.changeItm(Schedule.data.selected_schedule,$(tar).attr('entry'),$(tar).attr('index'),"color",changeTo,function(){
						if(color){
							$(tar).css('background',color.toRgbString());
						} else { $(tar).css('background',''); }
					});	
				}
				else if(context === "entry"){
					Schedule.changeEntry(Schedule.data.selected_schedule,$(tar).attr('id'),"color",changeTo,function(){
						if(color){
							$(tar).children('.header_contain').css('background',color.toRgbString());
						} else { $(tar).children('.header_contain').css('background',''); }
					});						
				}
			}			
		});
	}
}

    $(document).contextmenu(contextMenu);
}

