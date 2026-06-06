#!/bin/sh
set -e

sed "s|__API_URL__|${API_URL:-http://backend:3000}|g" \
  /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
