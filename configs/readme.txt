
Steps to configuring the framework:

1. create a project folder with your project name
2. create a template.json in that folder
3. create a data.json in that folder
4. create a settings.json in that folder that points to your template.json and data.json
5. copy your new settings.json file into the configs folder. If one is already there, overwrite it.
   
Each project's config folder has a copy of the main settings file for that project. 
The git configuration ignores the main settings.json when pulling changes, so when you pull from the template branch
it will not overwrite your setup. Also because it ignores settings.json, your settings do not overwrite the settings of the repository.
