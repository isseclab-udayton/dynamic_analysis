from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import logging
import json
import socket
import sys
import time

config = json.loads(open("config.json").read())
log_format = '[%(asctime)s] [%(levelname)s] - %(message)s'
logging.basicConfig(level=config["loglevel"], format=log_format)
sys.path.insert(1, "../")

class Browsing:
    def __init__(self, url: str=None, exec_path=None):
        self.url = url
        self.config = config
        if not exec_path and config["chrome_path"]:
            exec_path = config["chrome_path"]
        self.browser = webdriver.Chrome(ChromeDriverManager().install(
        )) if config["download_driver_if_needed"] else webdriver.Chrome(executable_path=exec_path)

    def start_browser_detach_listener(self):
        "A basic tcp socket server that will hold the browser until things are done"
        # Create a TCP/IP socket
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind(("localhost", int(self.config["confirmation_server_port"])))
        s.listen(1)
        # Wait until someone connects
        logging.info(
            "Started confirmation server and waiting for close connection")
        conn, addr = s.accept()
        conn.close()
        s.close()
        logging.info(
            "Closed confirmation server")
        # Just making sure all is finished
        time.sleep(.2)

    def patch_extension(self):
        # Patches
        # Add configured hostname on js source code (Alter file)
        logging.info("Modifying extension")
        hostname = self.config["hostname"]
        defstring = "const hostname = \"" + hostname + "\";\n"
        source = ""
        hostadded = False
        with open("extension/DynamicFeatureExctractor.js", "r") as f:
            for line in f.readlines():
                if "const" in line and "hostname" in line and "=" in line:
                    source += defstring
                    hostadded = True
                elif "return features;" in line:
                    # Add event sender to injected javascript
                    source += f"var connection = new WebSocket('ws://localhost:{self.config['confirmation_server_port']}');"
                    source += line
                else:
                    source += line
        if not hostadded:
            source = defstring + source
        with open("extension/DynamicFeatureExctractor.js", "w") as f:
            f.write(source)

    def load_extension(self, ext_path: str):
        self.patch_extension()
        logging.info("Loading extension")
        chrome_options = Options()
        if self.config["keep_browser_open"]:
            chrome_options.add_experimental_option("detach", True)
        chrome_options.add_argument('--load-extension={}'.format(ext_path))
        self.browser = webdriver.Chrome(options=chrome_options)

    def close(self):
        self.browser.close()

    def access_url(self, url=False, autoclose=True):
        url = url if url else self.url
        logging.info("Opening browser at "+url)
        self.browser.get(url)

        if not self.config["keep_browser_open"]:
            self.start_browser_detach_listener()
        if autoclose and not self.config["keep_browser_open"]:
            self.close()
