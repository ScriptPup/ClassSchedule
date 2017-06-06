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
        fs.readdir(schedules_path,function(err,folder_list){
          for(var i=0; i<folder_list.length; i++){
              if(!folder_list || folder_list === "undefined" || folder_list == null){ continue; }
                var li = $('<li class="tile"><img /><a></a></li>'),
                    baseName = folder_list[i],
                    imgPath =  path.join(cwd,"schedules",folder_list[i],baseName+".png"),
                    imgTest = fs.existsSync(imgPath);                
                  li.find('a')
                    .attr('href', "#"+baseName)
                    .text(baseName);
                  li.appendTo(ul);
                  if(imgTest){
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
          $('.list').flipster({
            nav: false,
            enableNav: false,            
            start: 0,            
            itemContainer: 'ul',
            itemSelector: 'li',
            start: 'center',
            fadeIn: 400,
            buttons: true,
            enableNavButtons: false
          });
          setTimeout(function(){ $('.list-nav').fadeIn(400); }, 800);
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