#!/bin/sh
set -e

echo "=== docker-entrypoint.sh ==="
echo "API_URL=${API_URL:-unset}"

if [ -f /etc/nginx/conf.d/default.conf.template ]; then
  echo "Template found"
  sed "s|__API_URL__|${API_URL:-http://backend:3000}|g" \
    /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
  echo "Generated /etc/nginx/conf.d/default.conf:"
  cat /etc/nginx/conf.d/default.conf
else
  echo "ERROR: Template not found at /etc/nginx/conf.d/default.conf.template"
  exit 1
fi

echo "Testing nginx config..."
nginx -t

echo "Starting nginx..."
exec nginx -g 'daemon off;'
