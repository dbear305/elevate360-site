FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./server.mjs
USER node
ENV PORT=8090
ENV BIND_HOST=0.0.0.0
EXPOSE 8090
CMD ["node", "server.mjs"]
