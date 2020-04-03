# Project MONAI Website
This repo contains source code and content for the project MONAI website found at [monai.io](http://monai.io/). You can find out more on the [Project-MONAI github](https://github.com/Project-MONAI). 

## Templates and Guides
A full set of seciton templates and guides is available for reference on the [Templates Page](http://monai.io/templates.html) using `templates.html`. The site uses responsive css layouts provided by [Purecss](https://purecss.io/), [Google Fonts](https://fonts.google.com/), and font icons by [Font Aweomse](https://fontawesome.com/icons?d=gallery&m=free).

### Local Development 
Git clone this repo and open the .html pages with a browser. For the NAV and FOOTER sections to appear requires the files to be served via `python -m http.server` or similar. 

## Adding / Removing Navigation Items
To add or remove an item, go to the `footer.html` and `nav.html` files and add or remove a corresponding `<div>` and `<li>` elements. 

## Adding Pages
Too add a page, copy the `templates.html` file and remove the uncessary sections while preserving the head, nav, footer, and script sections. Then add the new .html file link to the `nav.html` and `footer.html` pages.

## Adding Page Content
Use the `templates.html` to copy the section type you want the content to appear as, and paste it into your page. Be careful to grab the full tag. If the content requires hosted images, be sure to upload them into the `/img` folder. 


