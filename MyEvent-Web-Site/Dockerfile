# Build aşaması
FROM node:18-alpine as build
WORKDIR /app
COPY . .

RUN npm install -g @angular/cli

RUN npm install
RUN npm run build -- --configuration production

# Nginx aşaması
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/my-event/browser /usr/share/nginx/html
EXPOSE 80
