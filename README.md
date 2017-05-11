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
