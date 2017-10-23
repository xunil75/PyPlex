[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b33743975ac9430aae4da10aa107c8a7)](https://www.codacy.com/app/xunil75/PyPlex?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xunil75/PyPlex&amp;utm_campaign=Badge_Grade)

# PyPlex
PyPlex Theme for Pyload

After creating a Theme for Ombi https://github.com/tidusjar/Ombi (former Plex Requests), I've decided to create a Theme as well for Pyload. I've used the Pyload "Next" theme as a base and the modified "Next" theme from https://github.com/OzzieIsaacs/pyload-NextTheme

This Theme it's inspired by PlexPy (https://github.com/JonnyWong16/plexpy) A Python based monitoring and tracking tool for Plex Media Server. That's why I've choosen the name PyPlex for this theme.

## Installation

Stop your pyload Server

navigate to '/usr/share/pyload/module/web' (in my case it's /home/user/.pyload/module/web)
Open the file webinterface.py for editing

`nano webinterface.py`

Search for the following line in the file:

`FileSystemLoader(join(PROJECT_DIR, "templates", "default")),`

Insert the following lines of code right after:

`"PyPlex": FileSystemLoader(join(PROJECT_DIR, "templates", "PyPlex")),`

Delete the file webinterface.pyc located in the same path.
 
Copy all of the files from this repro from `template` folder to `/usr/share/pyload/module/web/templates` 

Copy the files from this repro from `media` folder to `/usr/share/pyload/module/web/media`

Restart your pyload Server

Login into the PyLoad webinterface. Navigate to the Config page, General Tab and click on "Webinterface". Enter the name of the new theme: "PyPlex" in the template field and hit "Submit"

Restart your pyload server

For now these are some screenshots on how it looks now:

Login Page:

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Login.jpg)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.38.03.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.38.27.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.38.37.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.38.44.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.38.53.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.02.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.08.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.15.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.22.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.32.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.39.51.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.40.04.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.40.38.png)

![ScreenShot](https://github.com/xunil75/PyPlex/blob/master/Screenshots/Screen%20Shot%202017-10-20%20at%2017.41.13.png)


