FROM nginx:alpine

# Remove default nginx template configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
