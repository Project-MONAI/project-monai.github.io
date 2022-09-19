from monai.bundle import get_all_bundles_list, get_bundle_info, get_bundle_versions, download
from monai.bundle.config_parser import ConfigParser
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
import markdown
import tempfile
import os

def get_bundle_web_data(bundle_name, download_dir):
    web_data = {}
    web_data["bundle_name"] = bundle_name
    versions_info = get_bundle_versions(bundle_name=bundle_name)
    # calculate download count
    download_count = 0
    for version in versions_info["all_versions"]:
        download_count += get_bundle_info(bundle_name=bundle_name, version=version)["download_count"]
    web_data["downloads"] = download_count
    # get latest update time, after this PR: https://github.com/Project-MONAI/MONAI/pull/5141 is merged,
    # the data can be achieved.
    latest_info = get_bundle_info(bundle_name=bundle_name, version=versions_info["latest_version"])
    if "updated_at" in latest_info:
        web_data["latest_update"] = latest_info["updated_at"]
    # download zip file and get readme, license, metadata path
    download(name=bundle_name, version=versions_info["latest_version"], bundle_dir=download_dir)

    readme_path = os.path.join(download_dir, bundle_name, "docs", "README.md")
    if os.path.exists(readme_path):
        with open(readme_path, 'r', encoding="utf-8") as f:
            text = f.read()
            readme_html = markdown.markdown(text, extensions=['tables', 'fenced_code'])
            readme_soup = BeautifulSoup(readme_html, "html.parser")
            for img in readme_soup.find_all('img'):
                img_urls = img['src']
                if "https:" not in img_urls or "http:" not in img_urls:
                    img_urls="https://raw.githubusercontent.com/Project-MONAI/model-zoo/dev/models/{bundle_name}/docs/{img_name}".format(bundle_name=bundle_name, img_name=img_urls)
                    img['src'] = img_urls
            
        web_data["readme_path"] = readme_path
        web_data["readme_html"] = readme_soup
        
    license_path = os.path.join(download_dir, bundle_name, "docs", "license.txt")
    if os.path.exists(license_path):
        web_data["license_path"] = license_path
        
    metadata_path = os.path.join(download_dir, bundle_name, "configs", "metadata.json")
    if os.path.exists(metadata_path):
        web_data["metadata"] = ConfigParser.load_config_file(metadata_path)
    
    web_data["download_url"] = latest_info["browser_download_url"]
    web_data["size"] = latest_info["size"]
    web_data["image_path"] = "https://raw.githubusercontent.com/Project-MONAI/model-zoo/dev/models/" + bundle_name + "/docs/"
    
    return web_data

def main():
  all_bundle_list = get_all_bundles_list()
  temp_dir = tempfile.mkdtemp()

  all_models = {}
  for item in all_bundle_list:
      bundle_name = item[0]
      bundle_web_data = get_bundle_web_data(bundle_name, temp_dir)
      all_models[bundle_name] = bundle_web_data
  
  environment = Environment(loader=FileSystemLoader("./templates/"))
  template = environment.get_template("model-template.html")
  template_string = ""
  final_string = ""

  for model in all_models:
      model_values = {}
      try:
          model_values["model_name"] = model.replace("_", " ").capitalize()
      except KeyError:
          model_values["model_name"] = ""
          
      try:
          model_values["description"] = all_models[model]["metadata"]["description"]
      except KeyError:
          model_values["description"] = ""
          
      try:
          model_values["authors"] = all_models[model]["metadata"]["authors"]
      except KeyError:
          model_values["authors"] = ""
          
      try:
          model_values["papers"] = all_models[model]["metadata"]["references"]
      except KeyError:
          model_values["papers"] = []
          
      try:
          model_values["download_url"] = all_models[model]["download_url"]
      except KeyError:
          model_values["download_url"] = ""
          
      try:
          model_values["downloads"] = all_models[model]["downloads"]
      except KeyError:
          model_values["downloads"] = 0
          
      try:
          model_values["last_updated"] = all_models[model]["last_updated"]
      except KeyError:
          model_values["last_updated"] = "" 
          
      try:
          model_values["readme"] = all_models[model]["readme_html"]
      except KeyError:
          model_values["readme"] = "" 
          
      try:
          file_size = all_models[model]["size"]
          model_values["size"] = str(round(file_size / 1048576, 1)) + "MB"
      except KeyError:
          model_values["size"] = ""
          
      content = template.render(model_values)
      template_string += str(content)

  with open("model-zoo.html", "r", encoding="utf-8") as f:
    contents = f.read()
    
    model_zoo_soup = BeautifulSoup(contents, "html.parser")
    generated_model_soup = BeautifulSoup(template_string, "html.parser")
    
    model_entry = model_zoo_soup.find(id="all_models")
    model_entry.clear()
    model_entry.append(generated_model_soup)
    final_string = model_zoo_soup.prettify()
    f.close()

  with open("model-zoo.html", "w", encoding="utf-8") as f:
    f.write(final_string)
    f.close()
    
  

if __name__ == '__main__':
  main()