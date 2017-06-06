var
    fs = require('fs'),
    path = require('path'),
    cwd = path.dirname(process.execPath), 
    settings_path = path.join(cwd,'settings');
gt = new Array();

// functions to do things with specific files
custom_cssLoad = function(file){
    if(path.extname(file).toLowerCase() === '.css' && file !== "flat_gui.css"){
        gt.push(path.join(settings_path,file));
            var 
                head = document.getElementById('true_head'),
                stylepath = path.join(settings_path,file),
                se = document.createElement('link');
                se.setAttribute("rel","stylesheet");
                se.setAttribute('href',stylepath);
                se.id = file;
                head.appendChild(se);
    }
}
// check for custom settings and load them
fs.stat(settings_path,function(err,stats){
    if(err){ return; }
    else { 
        // read directory
        fs.readdir(settings_path,function(err,files){
            if(err){ console.log("Unable to read files in settings folder."); return; }
            else {
                for(var i=0; i<files.length; i++){
                    custom_cssLoad(files[i]);
                }
            }
        });
    }
});