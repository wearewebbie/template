# Template Project

This is a project that uses [Eleventy](https://www.11ty.dev/) as a static site generator and [Tailwind CSS](https://tailwindcss.com/) for styling.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)

## Installation

### 1. Install dependencies

```npm install```

### 2. Build the Project

```npm run build```

This will generate the static site and compile the CSS.

### 3. Run the Project Locally
```npm start```

This will serve the site locally using Eleventy. It will also watch for changes in your CSS and recompile automatically.

## Deployment

This project includes a deploy script to upload your static site to an FTP server. Each project requires its own .env file with the correct credentials.

### 1. Create a .env file

In the root of the project, create a .env file with the following variables:

```
FTP_HOST_DEV={DEV HOST IP}
FTP_HOST_PROD={Prod HOST IP}
FTP_USERNAME={HPanel Website Username}
FTP_PASSWORD={Your Password}
REMOTE_ROOT=/public_html
```

### 2. Deploy to Dev
```npm run dev-deploy```

- Cleans the /dist folder
- Builds the site
- Uploads the site to your dev FTP server


### 3. Deploy to Prod
```npm run deploy:prod```

- Prompts for confirmation before deploying

- Cleans /dist

- Builds the site

- Uploads the site to your production FTP server

##

> And as always, have a Webbie good time coding...