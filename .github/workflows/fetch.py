from monai.bundle import download
from monai.bundle.config_parser import ConfigParser
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
import markdown
import requests
import json
import tempfile
import os
import re

def _get_all_bundles_info(repo: str = "Project-MONAI/model-zoo", tag: str = "hosting_storage_v1"):
    request_url = f"https://api.github.com/repos/{repo}/releases"
    resp = requests.get(request_url)
    resp.raise_for_status()
    releases_list = json.loads(resp.text)
    bundle_name_pattern = re.compile(r"_v\d*.")
    bundles_info: Dict = {}

    for release in releases_list:
        if release["tag_name"] == tag:
            for asset in release["assets"]:
                asset_name = bundle_name_pattern.split(asset["name"])[0]
                if asset_name not in bundles_info:
                    bundles_info[asset_name] = {}
                asset_version = asset["name"].split(f"{asset_name}_v")[-1].replace(".zip", "")
                bundles_info[asset_name][asset_version] = {
                    "id": asset["id"],
                    "name": asset["name"],
                    "size": asset["size"],
                    "download_count": asset["download_count"],
                    "browser_download_url": asset["browser_download_url"],
                    "created_at": asset["created_at"],
                    "updated_at": asset["updated_at"],
                }
                
    return bundles_info

def get_bundle_web_data(bundle_name, download_dir, all_bundles_info):
    current_bundle = all_bundles_info[bundle_name]
    
    web_data = {}
    web_data["bundle_name"] = bundle_name
    
    download_count = 0
    
    for key, item in current_bundle.items():
        download_count += item["download_count"]
    web_data["downloads"] = download_count
    
    latest_version = sorted(current_bundle.keys())[-1]
    
    if "updated_at" in current_bundle[latest_version]:
        web_data["latest_update"] = current_bundle[latest_version]["updated_at"]
        
    # download zip file and get readme, license, metadata path
    download(name=bundle_name, version=latest_version, bundle_dir=download_dir)

    #determine readme filepath
    readme_path = ""
    docs_path = os.path.join(download_dir, bundle_name, "docs")
    files = [f for f in os.listdir(docs_path) if os.path.isfile(os.path.join(docs_path, f))]
    for name in files:
        if "readme.md" in name.lower():
            readme_path = os.path.join(download_dir, bundle_name, "docs", name)

    if os.path.exists(readme_path):
        with open(readme_path, 'r', encoding="utf-8") as f:
            text = f.read()
            readme_html = markdown.markdown(text, extensions=['tables', 'fenced_code'])
            readme_soup = BeautifulSoup(readme_html, "html.parser")
            for img in readme_soup.find_all('img'):
                img_urls = img['src']
                if "https:" not in img_urls and "http:" not in img_urls:
                    img_urls="https://raw.githubusercontent.com/Project-MONAI/model-zoo/dev/models/{bundle_name}/docs/{img_name}".format(bundle_name=bundle_name, img_name=img_urls)
                    img['src'] = img_urls
            for a in readme_soup.find_all('a'):
                a_urls = a['href']
                if "https:" not in a_urls and "http:" not in a_urls:
                    a_urls="https://raw.githubusercontent.com/Project-MONAI/model-zoo/dev/models/{bundle_name}/docs/{a_name}".format(bundle_name=bundle_name, a_name=a_urls)
                    a['href'] = a_urls
            
        web_data["readme_path"] = readme_path
        web_data["readme_html"] = readme_soup
        
    license_path = os.path.join(download_dir, bundle_name, "docs", "license.txt")
    if os.path.exists(license_path):
        web_data["license_path"] = license_path
        
    metadata_path = os.path.join(download_dir, bundle_name, "configs", "metadata.json")
    if os.path.exists(metadata_path):
        web_data["metadata"] = ConfigParser.load_config_file(metadata_path)
        
    web_data["download_url"] = current_bundle[latest_version]["browser_download_url"]
    web_data["size"] = current_bundle[latest_version]["size"]
    web_data["image_path"] = "https://raw.githubusercontent.com/Project-MONAI/model-zoo/dev/models/" + bundle_name + "/docs/"        
    
    return web_data

def main():
    all_bundle_list = _get_all_bundles_info()
    temp_dir = tempfile.mkdtemp()

    all_models = {}
    for item in all_bundle_list.items():
        bundle_name = item[0]
        bundle_web_data = get_bundle_web_data(bundle_name, temp_dir, all_bundle_list)
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
            model_values["version"] = all_models[model]["metadata"]["version"]
        except KeyError:
            model_values["version"] = []
            
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
