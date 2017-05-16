if(!Array.prototype.move) {
    Array.prototype.move = function (old_index, new_index) {
        while (old_index < 0) {
            old_index += this.length;
        }
        while (new_index < 0) {
            new_index += this.length;
        }
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    };
};

var 
    fs = require('fs'),
    template = require('../files/template.json')
    path = require('path'),
    moment = require('moment'),
    cwd = path.dirname(process.execPath), 
    schedules_path = path.join(cwd,'schedules');

Schedule = function(){
    this.data = null;
}
Schedule.prototype = {
    load: function(file,cb){
        var Self = this;
        Self.path = path.join(cwd,"schedules",file+".json");
        fs.readFile(path.join(Self.path), 'utf8', function(err,data){
            Self.data = JSON.parse(data);
            Self.schedule = null;
            if(Self.data.class_info.hasOwnProperty('icon')){
                 fs.lstat(path.join(cwd,"schedules",Self.data.class_info.icon), function(err,pic){
                    Self.img = pic;
                    Self.imgPath = path.join(cwd,"schedules",Self.data.class_info.icon);
                    cb();
                });  
            }
            else { cb(); }
                     
        });        
    },
    updateModStart: function(sched,ent,time,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent]["start_time"] = time;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    updateModDur(sched,ent,ix,time,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent]["items"][ix].time = time;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    updateLocation(sched,sEnt,sIX,dEnt,dIX,cb){
        var Self = this,
            workingSet = Self.data;
            if(sEnt === dEnt){
                workingSet.scheduled[sched].entries[sEnt]["items"].move(sIX,dIX);
            } else {
                var mm = workingSet.scheduled[sched].entries[sEnt]["items"][sIX];
                if(sIX!==null && dIX!==null && sEnt!==null && dEnt!==null){
                    workingSet.scheduled[sched].entries[sEnt]["items"].splice(sIX, 1);
                    workingSet.scheduled[sched].entries[dEnt]["items"].splice(dIX, 0, mm);
                } else { alert("Failed to make requested change, try again. We tried the following: "+sIX+dIX+sEnt+dEnt); }
            }            
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){                
                if(err){ alert("Failed to save changes"); } else {}
                cb();
            });            
    },
    updateScheduleSelect(schedSelected,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.selected_schedule = schedSelected;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    updateHoursinDay(sched,hrs,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.class_info.hours_in_day = hrs;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    deleteMod(sched,ent,ix,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent]["items"].splice(ix, 1);
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    deleteEntry(sched,ent,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries.splice(ent,1);
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    insertItm(sched,ent,ix,newT,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent]["items"].splice(ix, 0, newT);
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    changeItm(sched,ent,ix,key,value,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent]["items"][ix][key]=value;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    insertEntry(sched,ent,ix,cb){
        console.log(ix);
        var Self = this,
            entry = {"title":ent, "start_time": "08:00", "items": []},
            workingSet = Self.data;
            workingSet.scheduled[sched].entries.push(entry);
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    changeEntry(sched,ent,key,value,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ent][key]=value;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    renameEntry(sched,ent,ix,cb){
        console.log(ix);
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched].entries[ix].title=ent;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    newSchedule(curSchedule, newSchedule, cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[newSchedule] = workingSet.scheduled[curSchedule]
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    changeSchedule(sched,key,value,cb){
        var Self = this,
            workingSet = Self.data;
            workingSet.scheduled[sched][key]=value;
            fs.writeFile(Self.path,JSON.stringify(workingSet),function(err,data){
                if(err){ alert("Failed to save changes"); }
                cb();
            });
    },
    newClass(name,type,days,schedule_name,img,cb){
        /*
        alert("Creating new class!" +
        "\r\nName: "+ name +
        "\r\nType: "+ type +
        "\r\nDays: "+ days +
        "\r\nSchedule Name: "+ schedule_name +
        "\r\nimage: "+ img
        );
        */
        var tmp = template,
            scheduled = {
                "class_type": type,
                "updated": moment.now(),
                "entries": []
            };
        tmp.selected_schedule = schedule_name;
        tmp.class_info.name = name;
        tmp.class_info.days = days;     

        for(var i=0; i<days; i++){
            scheduled.entries.push({
                "title": "Day "+(i+1),
                "start_time": "08:00",
                "items": []
            });            
        }        
        tmp.scheduled[schedule_name] = scheduled;
        delete tmp.scheduled.TEMPLATE_SCHEDULE;

        fs.writeFile(path.join(schedules_path,name+".json"),JSON.stringify(tmp),function(err,data){
            if(err){ alert("Failed to save changes"); cb(); }
            else {
                if(img && img !== ''){
                    fs.lstat(img,function(err,inf){
                        if(!err && inf.isFile()){
                            var inStr = fs.createReadStream(img),
                                outStr = fs.createWriteStream(path.join(schedules_path,name+".png"));
                                inStr.on('error',function(err){
                                    alert(err);
                                });
                                outStr.on('error',function(err){
                                    alert(err);
                                });
                                outStr.on("close", function(ex) {
                                    cb();
                                });
                                inStr.pipe(outStr);
                        }                        
                    });
                }
            }            
        });
    }

}

module.exports = Schedule;