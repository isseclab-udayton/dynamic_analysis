# This folder is the tool to automatically open a browser to surf a given URL.

## Requirements
- Python 3.8.5
- chromedriver
- pipenv

# Installation
- Run `pipenv install`

# Run tests
- Go to "tests" directory and run `pytest`
- Or run `python main.py --test`

# Usage

Just use the -h or --help option to see
```sh
$ python main.py -h
usage: main.py [-h] [-i INPUT | -u URL | -t]


optional arguments:
  -h, --help            show this help message and exit
  -i INPUT, --input INPUT
                        Input a file containing a list of urls on each line
  -u URL, --url URL     Specify a url to act on
  -t, --test            Tests it on google.com
```
# Examples

`python main.py -u https://www.somesite.com `

`python main.py --input urls_list.txt`



# Config file

```javascript
{
    "chrome_path" : "/usr/bin/chromedriver", // Path to chromedriver on filesystem. Leave it empty if you want python to figure it out
    "download_driver_if_needed" : false, // If set to true python will download chromedriver and setup automatically
    "hostname":  "http://localhost:3000/", // This variable will be created inside the script, it should point to the receiver api.
    "loglevel": 0, // Increase this number to get less log messages. It is the python's logging module loglevel.
    "confirmation_server_port": 54540, // Make sure to use a port that isn't already listening on your system
    "keep_browser_open": true, // Don't leave chrome open after executing. Set false to automatically close it.
    "sleep_threshold": 0.2 // Threshold time to sleep after extension is done and data was sent. This could be 0 but is here as a safety measure or workaround. 
}

```
