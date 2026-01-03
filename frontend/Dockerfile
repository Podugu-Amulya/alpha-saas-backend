# Using a simple Nginx server to serve your HTML files
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 3000
# Update Nginx to listen on 3000 instead of 80
RUN sed -i 's/listen\(.*\)80;/listen 3000;/' /etc/nginx/conf.d/default.conf