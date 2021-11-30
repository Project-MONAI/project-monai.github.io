# Project MONAI Website
This repo contains source code and content for the project MONAI website found at [monai.io](https://monai.io/). You can find out more on the [Project-MONAI github](https://github.com/Project-MONAI).

## Local Development
Git clone this repo, run 'python -m http.server' and navigate to localhost:8000 or your indicated port.

The CSS is minimized to use only the included classes required throughout all the pages.  If you're looking to add classes that aren't currently used, make sure to use npm to install the relevant packages and build the tailwind CSS after updating the .html files.  Alternatively, after installing npm dependencies, run the 'npm run watch' command to automatically re-build the CSS file everytime you modify an .html file.

## Adding / Removing Navigation Items
Currently Nav/Footer bars aren't abstracted so you'll need to individually update each page for an update.

## Adding Pages
To add a page, copy an existing page, like 'community.html' and use that as a reference for the overall layout.  The pages are using TailWind CSS (https://tailwindcss.com/docs) as the implementation framework, so make sure to use utility-first primitives. 

## Adding Page Content
If simple updates are required, update the pages directly and use any utility-style CSS classes for your changes.  If you need additional help, contact Michael Zephyr.
