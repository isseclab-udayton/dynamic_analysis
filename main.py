import tests.test_browsing as test
from browsing import Browsing
from sys import argv
import argparse
import os

parser = argparse.ArgumentParser(description='Sitemap Generator')
group = parser.add_mutually_exclusive_group()
group.add_argument('-i', '--input', action="store", default=None,
                   help="Input a file containing a list of urls on each line", required=False)
group.add_argument('-u', '--url', action="store", default=None,
                   help="Specify a url to act on", required=False)
group.add_argument('-t', '--test', action="store_true", default=False,
                   help="Tests it on google.com", required=False)
args = parser.parse_args()




if __name__ == "__main__":
    if args.input:
        browsing = Browsing()
        extension_path = os.path.abspath("extension/")
        browsing.load_extension(extension_path)
        import validators
        filename = args.input
        if os.path.isfile(filename):
            for link in open(filename).readlines():
                if validators.url(link) == True:
                    try:
                        response = browsing.access_url(link, False)
                    except Exception as e:
                        print("IGNORING URL: ", link, "\nBecause: ", e)
                else:
                    print("IGNORING INVALID URL: ", link, " !!!")
        else:
            print("Input file not found!")
        browsing.close()

    elif args.url:
        url=args.url
        browsing = Browsing(url)
        extension_path = os.path.abspath("extension/")
        browsing.load_extension(extension_path)
        response = browsing.access_url()

    elif args.test:
        test.test_load_extension_google()
