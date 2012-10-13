#!/usr/bin/env python
import os
import sys
import re

def main():
    fileList = []
    rootdir = './test'
    for root, subFolders, files in os.walk(rootdir):
      for file in files:
          if(re.match('.*.test.js', file)):
            fileList.append(os.path.join(root,file))

    result = 0
    for file in fileList:
        result = os.system('mocha -t 5s -R list '+file)
        if(result != 0):
            sys.exit(1);

    return result

if __name__ == '__main__':
    main()
