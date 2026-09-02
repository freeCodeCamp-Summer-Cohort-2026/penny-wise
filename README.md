# penny-wise

### Original Git Readme

```
https://github.com/freeCodeCamp-Summer-Cohort-2026/penny-wise.git

…or create a new repository on the command line

echo "# penny-wise" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/freeCodeCamp-Summer-Cohort-2026/penny-wise.git
git push -u origin main

…or push an existing repository from the command line

git remote add origin https://github.com/freeCodeCamp-Summer-Cohort-2026/penny-wise.git
git branch -M main
git push -u origin main


```

### Folder structure

```

///// Folder structure
penny-wise/
├── frontend/          # React + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Express.js + MongoDB
│   ├── server.js
│   ├── models/        # MongoDB models (e.g., User.js)
│   ├── routes/        # API routes (e.g., auth.js, users.js)
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## Creating Penny Wise project

```
npm create vite@latest frontend -- --template react
cd frontend

//Tailwind
npm install tailwindcss @tailwindcss/postcss postcss autoprefixer

Then create postcss.config.js manually:

``js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

```
//Configure Tailwind (tailwind.config.js) this is optional for old V3
module.exports = {
  content: ["./index.html", "./src/*/.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```
//Add Tailwind to index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Creating Backend

```
//Create a backend folder
mkdir backend
cd backend

//Initialize Node.js project
npm init -y

//Install Express.js and MongoDB driver
npm install express mongoose cors dotenv
npm install --save-dev nodemon

//Express server (server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Install and Run Mongo DB

- It will be setup in Docker

## Create Mongo DB

This requires docker installed on the system. [A guide on installing Docker can be found here](https://docs.docker.com/get-started/get-docker/).

before starting the backend service, run this command to start the MongoDB container:

```bash
docker compose up -d
```

It will start the MongoDB on the port 27010, which the Backend service will connect to.
