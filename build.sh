#! /bin/sh

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

# Initialize our own variables:
output_file=""
verbose=0

while getopts "r" opt; do
  case "$opt" in
      r)  cd ./front/vite-project/ && npm run watch &
          cd ./server/ && ~/go/bin/air
      ;;
  esac
done

shift $((OPTIND-1))

[ "${1:-}" = "--" ] && shift
