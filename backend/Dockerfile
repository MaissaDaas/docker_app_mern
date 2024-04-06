# Utilisation de l'image Node.js pour construire l'application backend
FROM node:latest as build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json ./

# Installer les dépendances
RUN npm install

ENV PORT 3001
# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 3000 du conteneur
EXPOSE 3001

# Commande pour démarrer l'application backend
CMD ["npm", "start"]

