#!/bin/bash

ctags -R --exclude=.git --exclude=static/libraries\
  # # --regex-JavaScript=/\$scope[A-Za-z0-9._$]*\.\([A-Za-z0-9._$]+?\)[ \t]*[:=]/\1/t,ng-scope-variable\
  # --regex-JavaScript=/\.controller\('([A-Za-z0-9._$]+)'/\1/c,ng-controller/
