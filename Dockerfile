FROM node:20-alpine AS base

WORKDIR /app

# Встановлюємо залежності
COPY package.json package-lock.json* ./
RUN npm ci

# Копіюємо код
COPY . .

# Прокидаємо змінну оточення на етапі збірки (для Next.js це важливо)
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Збираємо Next.js додаток
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]