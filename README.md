# ClassSchedule
Simple program designed to simplify scheduling classes by module

## Building
### *All instructions provided have been tested on windows hosts, linux will vary*

This project is build using node-webkit. This means that it's not possible to just run index.html to launch it. nw.js must be used to package and run the application.

To do this in testing (without fully packaging)
- Download nw from: https://nwjs.io/
- Run: nw.exe Path\To\ClassSchedule [--enable-logging]

To package the application
- Download nw from: https://nwjs.io/
- Run (from powershell 5.0, in folder containing nw.exe): Compress-Archive -Path Path\To\ClassSchedule -DestinationPath Path\To\ClassSchedule.zip ; copy /b nw.exe+Path\To\ClassSchedule.nw CLassSchedule.exe

## Features: Current (version 0.1.0)
* Create new class
  * Class Name
  * Class Image
  * Class Type
  * Class Days
  * First Schedule Name
* Create new entry (Day)
  * Modifiable start time
* Rename entry
* Delete entry
* Create new module (intra-entry)
  * Create above
  * Create below
* Move module (drag and drop)
  * Move between entries
  * Move within same entry
* Delete module
* Change entry title color (colorpicker)
* Change module title color (colorpicker)
* Change module time (how long the module will run for)
* Create new schedule
  * Allows different modules between schedules
  * Allows different module order between schedules
  * Allows different times per module between schedules
  * Allows different entry starting time
* Locked "end of day" row with ending time-of-day
* Custom css files can be added to the settings folder
* All classes stored as .json files, user editable
* Editable class type

## Features: Planned
* Per-class css themes?
* Improve program opening speed
  * Possibly create installer option
  * Possibly eliminate some nw dependancies?
* Decrease .exe size
  * Requires research
* Distribution system?
  * Possibly add online or hosted class distro system to share between trainers
  * Probably won't happen
* GUI improvmenets
  * Add condition to change text color to black if background is light? 
  * Highlight over-time modules in red?
* Module details
  * Add ability to add notes to module (make module expandable)
  * Ability to add file-links within notes
* Entry focus
  * Add entries to left-hand side so that a single entry may be selected and focused on to eliminate distractions

## Bugs: Known bugs
* Known bugs as of 05/11/2017 1.2.0 build
  * Colors set on wrong modules after adding new module (index issue?) - CONFIRMED ISSUE STILL EXISTS
  * Times not fully updating after manually setting module time
# Change Log
## 1.0.1
* Fixed bug[1]: Module minute time change not committed
## 1.1.0
* Fixed bug[2]: Jumps to top when adding stuff
* Fixed bug[3]: Takes a long time to commit minute change for modules
* Added feature[4]: Context menu to modify module time duration
* Added feature[5]: Context menu to rename module entry
## 1.1.1
* Fixed bug[6]: Changes reverting when moving items around (indexing method was wrong) gui.js:230->266
* Fixed bug[7]: Fixed modify time (module context menu) - using arrows after setting would reset to 0
* Added workaround: Null entries and items will now be ignored by display process. Need to figure out why nulls occur and fix...
* Added feature: Added entry summary as part of "End of day" row
* Altered feature: "End of day" module now exempt from context menu
* GUI Improvements
  * Improved module column start position match
  * Module time addition spinner now updates while holding down (need to test compiled)
  * Added flipster home for prettieness (this was ridiculously time consuming?!)
  * Improved module title labels
* Added installer option
