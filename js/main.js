//require('nw.gui').Window.get().showDevTools()
$(function(){
  $('.app').css('max-height', ($(window).height() - 200)+"px" );
  $('.app').css('width', ($(window).width() - 310)+"px" );
  $('.header_contain').css('width', ($(window).width() - 270)+"px" );
  $('.portal').css('width', ($(window).width() - 265)+"px" );
  scheduleStatus = "pre";
  var
    fs = require('fs'),
    path = require('path'),
    Scheduler = require('./js/schedule.js'),
    Schedule = new Scheduler(),
    cwd = path.dirname(process.execPath), 
    schedules_path = path.join(cwd,'schedules'),   
    schedules_exist,
    ul = $('.list ul');
   
    fs.lstat(schedules_path,function(err,check){ 
      if(err || !check.isDirectory(schedules_path)){
        alert("Shedule folder doesn't exist!");
        schedules_exist = false;
      }
      else {
        schedules_exist = true;
        // alert("Shedule folder exists!");
      }
      
      if(schedules_exist){
        fs.readdir(schedules_path,function(err,file_list){
          for(var i=0; i<file_list.length; i++){
            	var li = $('<li class="tile"><img /><a></a></li>'),
                  baseName = path.basename(file_list[i],'.json'),
                  imgPath =  path.join(cwd,"schedules",path.basename(file_list[i],'.json')+".png"),
                  imgTest = fs.existsSync(imgPath);
              if(path.extname(file_list[i]) !== '.json'){ continue; }
                li.find('a')
                  .attr('href', "#"+baseName)
                  .text(baseName);
                li.appendTo(ul);
                if(imgTest){
                    console.log("Setting " + imgPath);
                    li.find('img').attr('src', imgPath);
                } else {
                    li.find('img').attr('src','./css/img/default_tile.png');
                }           
          }
          $('.list').on('click', function(e){
              if(e.target.tagName === 'A'){
                var t = e.target.text;
              }
              else if(e.target.tagName === 'IMG'){
                var t = $(e.target).next().text();
              }
              else {
                return;
              }
              e.preventDefault();
              Schedule.load(t,function(){
                showStats(Schedule,function(s){
                  showSchedule(s);
                  initContext(Schedule);
                });                
              });              
          });
          $('#back').on('click',function(e){
            window.location.reload();
          });
        });
      }      
    });
    // auto resizing
    $( window ).resize(function() {
      var nh = ($(window).height() - 200);
      $('.app').css('max-height', ($(window).height() - 200)+"px" );
      $('.app').css('width', ($(window).width() - 310)+"px" );
      $('.header_contain').css('width', ($(window).width() - 270)+"px" );
      $('.portal').css('width', ($(window).width() - 270)+"px" );
    });
    $('#new_class').click(function(e){
        newClass(e,Schedule);
    });
});