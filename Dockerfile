# 1. Imagem base Node.js LTS
FROM node:20-alpine

# 2. Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copiar package.json e package-lock.json
COPY package*.json ./

# 4. Instalar dependências
RUN npm install

# 5. Copiar todo o código fonte
COPY . .

# 6. Build do TypeScript
RUN npx tsc

# 7. Expor a porta da aplicação
EXPOSE 3000

# 8. Comando para rodar a aplicação
CMD ["node", "dist/server.js"]
