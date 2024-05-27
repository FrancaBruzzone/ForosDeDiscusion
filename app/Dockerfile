# Utiliza una imagen base adecuada para tu aplicación (por ejemplo, Node.js)
FROM node:14-alpine

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the container
COPY . .

# Expone el puerto en el que se ejecutará tu aplicación
EXPOSE 3000

# Comando para ejecutar tu aplicación cuando el contenedor se inicie
CMD ["node", "index.js"]