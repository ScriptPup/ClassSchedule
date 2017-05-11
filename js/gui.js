function showStats(Schedule, cb){
    var 
        Sched = Schedule,
        name = Sched.data.class_info.name,
        days = Sched.data.class_info.days,
        hours_in_day = Sched.data.class_info.hours_in_day,
        schedules = Sched.data.scheduled,
        _schedules = new Array(),
        pm = null,
        firstSchedule = Object.keys(schedules)[0];        
            if(!Schedule.data.selected_schedule){
                Schedule.data.selected_schedule = firstSchedule;
            }             
        for( s in schedules ){
            if(s === Schedule.data.selected_schedule){
                pm = "<option selected>" + s + "</option>";
            } else { pm = "<option>" + s + "</option>"; }
            _schedules.push(pm);
        }
        $('#title').html(name);
        $('#new_class').remove();
        $('#days').html(", "+days+" days").show();
        $('#hours_container').show();       
        $('#hours_in_day').val(hours_in_day).show();
        $('#hours_in_day').on('change',function(e){            
            Schedule.updateHoursinDay(Schedule.data.selected_schedule,$(e.target).val(),function(){

            });
        });
        $('#schedules').html(_schedules).show();
        $('<button id="new_schedule_clicker">Add</button>')
            .on('click',function(e){
                $('#new_schedule_dialog').remove();
                var nMod = $('<div id="new_schedule_dialog" class="scheduleForm"></div>')
                    .append($('<input style="display: inline;" type="text" name="new_schedule" id="new_schedule" />'))
                        .on('keydown',function(e){
                            if(e.which == 13) {
                                $('#submit_new').click();
                            }    
                            if (e.keyCode == 27) {
                                $('#cancel_new').click();
                            }                                      
                        })
                        .css('left', 300)
                        .css('top', 60)
                    .append($('<button style="display: inline;" id="submit_new">Add</button>')
                        .on('click',function(e){
                            var thing = $('#new_schedule').val();
                            $('<option></option')
                                .text(thing)
                                .val(thing)
                                .appendTo($('#schedules'));
                            Schedule.newSchedule(Schedule.data.selected_schedule,thing,function(){
                                $('#cancel_new').click();
                                $('#schedules').val(thing);
                                $('#schedules').change();
                            });                            
                        })
                    )
                    .append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
                        .on('click',function(e){
                            $('#new_schedule_dialog').remove();
                        })
                    );
                    $('body').append(nMod);
                    $('#new_schedule').focus();
            })
            .insertAfter('#schedules');
        $('#schedules').on('change', function(){
            var selected = $('#schedules option:selected').text();
            Schedule.updateScheduleSelect(selected,function(){
                showSchedule(Schedule);
            });            
        });

        $('.schedule_contain').show();
        $('.list').hide();
        cb(Schedule);        
}

function updateTimes(entry){
    var 
        start_time = $('[id="'+entry+'"]').find('.ST_Counter').val(),
        times = $('[id="'+entry+'"]').find('.item_time'),
        t = null,
        mt = null,
        ct = moment('12-may-2014, '+start_time).format("hh:mm A");
        times.each(function(index){
            $(this).html(ct);
            t = $(this).attr('time');
            ct = moment('12-may-2014, '+ct).add(t,'m').format("hh:mm A");
            mt = (ct<61) ? ct +" Min." : parseFloat((ct/60).toFixed(2)) + " Hr.";
        });
}

function toggleLoad(set){
    if(set){
        $('.ui').on('mousedown', function(){ return false; });
        $('.ui').css('cursor','wait');
    }
    else {
        $('.ui').off('mousedown', function(){ return false; });
        $('.ui').css('cursor',null);
    }
}

function reIndex(){
    var eix = 0;
    $('.entry').each(function(index){
        var ix = 0;
        $(this).attr('id',eix);
        $(this).find('.module').each(function(index2){
            $(this).attr('index',ix);
            $(this).find('.modTime').attr('index',ix);
            ix++;
        });
        eix++;
    });
    
}

function showSchedule(Scheduler){
    scheduleStatus = "shown";
    $('.portal').addClass('extended')
    $('.app').empty();
     
    var 
        Schedule = Scheduler.data.scheduled[Scheduler.data.selected_schedule],
        class_type = Schedule.class_type,
        entries = Schedule.entries,
        curEntry = null,
        nEntry = null,
        nModuleTime = null,
        nModuleTimeHolder = null;
        nModuleNameHolder = null;
        nModule = null,
        curTime = null,
        nTime = null;
    $('#type').html(class_type).show();
    for(var inu=0; inu< entries.length; inu++){
        var entry = entries[inu].title,
            qce = (entries[inu].hasOwnProperty('color')) ?  entries[inu].color : null,
            curTime = moment('12-may-2014, '+entries[inu].start_time).add(entries[inu].start_time,'m').format("hh:mm A"),
            curEntry = entries[inu],
            nEntry = $('<div></div>')
                .addClass('entry')
                .attr('id',inu)
                .append($('<span></span>')
                    .addClass('header_contain')
                    .css('background',qce)
                    .append($('<span></span>')                    
                    .text(entry)
                    .addClass('entry_label')
                    .addClass('header')
                    )   
                    .append($('<span></span>')
                        .append($('<input class="ST_Counter" id="'+entry+'_time" type="time">')
                            .val(entries[inu].start_time)
                            .on('change',function(e){
                                var ent = $(e.target).parents('.entry').attr('id'),
                                    time = $(e.target).val();
                                v = e.target;
                                Scheduler.updateModStart(Scheduler.data.selected_schedule,ent,time,function(){
                                    updateTimes(ent);
                                });
                            })
                        )                    
                        .addClass('start_time')
                        .addClass('header')
                    )
                )
                ;
        curEntry.items.push({ "name": "End of day", "time": 00, disabled: true });
        for(var i=0; i< curEntry.items.length; i++){
           curEntry.items[i];
           var qc = (curEntry.items[i].hasOwnProperty('color')) ?  curEntry.items[i].color : null,
                qtc = (curEntry.items[i].hasOwnProperty('font-color')) ?  curEntry.items[i]['font-color'] : null;
            nModuleTime = (curEntry.items[i].time<61) ? curEntry.items[i].time +" Min." : parseFloat((curEntry.items[i].time/60).toFixed(2)) + " Hr.";
            nModule = $('<div></div>')
                        .addClass('module')
                        .attr('entry',inu)
                        .attr('index',i)
                        .attr('id',curEntry.items[i].name)
                        .css('background',qc)
                        .css('color',qtc)
                        .append($('<span></span>')
                            .text(curEntry.items[i].name)
                            .addClass('class_name')
                            .addClass('moduleAttrib')                            
                        )
                        .append($('<span></span>')                            
                            .text(nModuleTime)    
                            .attr('time',curEntry.items[i].time)                        
                            .addClass('classTime')
                            .addClass('moduleAttrib')
                        )
                        .append($('<input class="modTime" type="number">')                                
                                .attr('index',i)
                                .addClass("item_minutes")
                                .val(curEntry.items[i].time)
                                .on('change',function(e){
                                    var
                                        nTime = $(e.target).val(),
                                        nTimeDisplay = ($(e.target).val()<61) ? ($(e.target).val()) +" Min." : parseFloat(($(e.target).val()/60).toFixed(2)) + " Hr.";
                                   ttest=e.target;
                                    $(e.target).prev().text(nTimeDisplay);
                                    $(e.target).prev().attr('time',nTime);
                                    $(e.target).next().attr('time',nTime);                                
                                    Scheduler.updateModDur(Scheduler.data.selected_schedule,$(e.target).parents('.entry').attr('id'),$(e.target).attr('index'),nTime,function(){
                                         updateTimes($(e.target).parents('.entry').attr('id'));
                                    });
                                })
                        )
                        .append($('<span></span>')
                            .addClass('item_time')
                            .text(curTime)
                            .attr('time',curEntry.items[i].time)   
                        )
                        ;
            curTime = moment('12-may-2014, '+curTime).add(curEntry.items[i].time,'m').format("hh:mm A");
            if(curEntry.items[i].hasOwnProperty('disabled')){
                nModule.find('.modTime').attr('disabled','true');
                nModule.find('.modTime').addClass('da');
                curEntry.items.splice(i,1);
            }            
            nEntry.append(nModule);
        }        

        $('.app').append(nEntry);
        $('.entry').sortable({
            items: "> div:not(:last)",
            connectWith: '.entry',
            start: function (event, ui){
                $(this).attr('prev-index', ui.item.index());
            },
            update: function(event,ui){ 
                var t = ui.item,
                    parSize = $(t).parent().children().length - 3,
                    sEnt = $(ui.item).attr('entry'),
                    sIX = $(this).attr('prev-index')-2,
                    dIX = ui.item.index()-2,                    
                    dEnt = $(ui.item).parent().attr('id');
                    if(dIX >= parSize){ 
                        $(t).insertBefore($(t).prev());  
                        return;
                    }
                toggleLoad(true);
                $(this).removeAttr('prev-index');
                if(sIX!==null && dIX!==null && sEnt!==null && dEnt!==null && !isNaN(dIX) && !isNaN(sIX) ){
                    console.log("Updating location...");
                    console.log("\tSchedule: "+Scheduler.data.selected_schedule);
                    console.log("\tSource entry: "+sEnt +" : "+sIX);
                    console.log("\tDestination entry: "+dEnt +" : "+dIX); 
                                            
                    Scheduler.updateLocation(Scheduler.data.selected_schedule,sEnt,sIX,dEnt,dIX,function(){
                        reIndex();
                        updateTimes(sEnt);  updateTimes(dEnt);
                        toggleLoad(false);
                    });   
                }             
            }
        });
    }
    $('.header_contain').css('width', ($(window).width() - 270)+"px" );
    $('#type').on('input',function(){
        Scheduler.changeSchedule(Scheduler.data.selected_schedule,"class_type",$(this).html(),function(){

        });
    });
}

function insertRow(name,entry,where,ref){    
    var addTO = (where === 'above') ? 1 : -1
        nIx = ( Number($(ref).attr('index')) + addTO )
        newThing = $('<div></div>')
        .addClass('module')
        .attr('entry',entry)
        .attr('index',nIx)
        .attr('id',name)
        .append($('<span></span')
            .addClass('class_name')
            .addClass('moduleAttrib')
            .text(name)
        )
        .append($('<span></span')
            .addClass('classTime')
            .addClass('moduleAttrib')
            .text('00 Min.')
        )
        .append($('<input type="number" />')
            .addClass('modTime')
            .addClass('item_minutes')
            .attr('index',nIx)
            .val(0)
        )
        .append($('<span></span>')
            .addClass('item_time')
            .text('00:00 AM')
        );
        if(where === "above"){
            newThing.insertBefore(ref);
        }
        else if(where === "below"){
            newThing.insertAfter(ref);
        }
}

function insertEntry(entry,where,ref){    
    var addTO = (where === 'above') ? 1 : -1
        nIx = ( $('.app').children().length + 1 )
        nEntry = $('<div></div>')
                .addClass('entry')
                .attr('id',nIx)
                .append($('<span></span>')
                    .text(entry)
                    .addClass('entry_label')
                    .addClass('header')
                )
                .append($('<span></span>')
                    .append($('<input class="ST_Counter" id="'+entry+'_time" type="time">')
                        .val("08:00")
                        .on('change',function(e){
                            var ent = $(e.target).parents('.entry').attr('id'),
                                time = $(e.target).val();
                            Scheduler.updateModStart(Scheduler.data.selected_schedule,ent,time,function(){
                                updateTimes(ent);
                            });
                        })
                    )                    
                    .addClass('start_time')
                    .addClass('header')
                );
                $('.app').append(nEntry)
        
}

function newClass(event,Sched){
    	var tar = event.target;
        $('#new_module_dialog').remove();
		var nMod = $('<div id="new_module_dialog" class="moduleForm"></div>')
            .append($('<h2>New Class</h3>'))
            .append($('<hr />'))
			.append($('<input style="display: block;" type="text" name="class_name" id="class_name" placeholder="Class Name: Linux 101" />'))            
            .append($('<span class="btn btn-overlay fileinput-button"><span>Select Image (.png only)</span><input type="file" accept="image/x-png" name="class_image" id="class_image"></span>'))
			.append($('<input style="display: block;" type="text" name="class_type" id="class_type" placeholder="Class Type: Instructor Lead" />'))            
            .append($('<input style="display: block;" type="number" name="class_days" id="class_days" placeholder="Class Days: 5 " />'))
            .append($('<input style="display: block;" type="text" name="class_schedule" id="class_schedule" placeholder="First Schedule: Primary" />'))
			.css('left', event.pageX - 20)
			.css('top', (event.pageY) + 10)
			.append($('<button style="display: inline;" id="submit_new">Add</button>')
				.on('click', function () {
                    var validate= true;
                    $('#new_module_dialog input').each(function(){
                        if($(this).val() == '' && $(this).attr('type') !== "file")
                            validate = false;
                    });
                    if(!validate){
                        alert('All inputs are required, please fill out the form.');
                        return false;
                    }
                    else { 
                        toggleLoad(true);
                        Sched.newClass($('#new_module_dialog #class_name').val(),$('#new_module_dialog #class_type').val(),$('#new_module_dialog #class_days').val(),$('#new_module_dialog #class_schedule').val(),$('#new_module_dialog #class_image').val(),function(res){
                            $('#new_module_dialog').remove();
                            toggleLoad(false);
                            window.location.reload();
                        });
                    }
				}))
			.append($('<button style="display: inline;" id="cancel_new">Cancel</button>')
				.on('click', function (e) {
					$('#new_module_dialog').remove();
				}))
            .on('keydown', function (e) {
				if (e.which == 13) {
                    e.preventDefault();
                    if( $(e.target).next('input')[0] ){
                        $(e.target).next().focus();
                    }                    
					else { $('#submit_new').click(); }
				}
				if (e.keyCode == 27) {
					$('#cancel_new').click();
				}
			});               ;            
		$('body').append(nMod);
		$('#new_module').focus();
}

