# Template Project

This is a project that uses [Eleventy](https://www.11ty.dev/) as a static site generator and [Tailwind CSS](https://tailwindcss.com/) for styling.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/)

## Installation

### 1. Install dependencies
```npm install```

## Build Scripts

This project has three environments — local, dev, and prod. Each has its own build script and output directory.

### Local Development
```npm start```

Starts a local dev server with live reload. Watches for CSS changes and recompiles automatically. No image or video optimisation is run to keep startup fast. Outputs to `dist`.

```npm run build:local``` can be used to to create a local build without starting the server.

Builds the site locally without starting the dev server. Useful for quickly checking your local build output. No image or video optimisation. Outputs to `dist`.

### Dev Build
```npm run build:dev```

Builds the site for the customer preview URL. Automatically optimises images to WebP format and compresses videos. Outputs to `dist-dev`.

### Production Build
```npm run build:prod```

Builds the site for the live domain. Automatically optimises images to WebP format and compresses videos. Outputs to `dist-prod`.

### Image & Video Optimisation

Image and video optimisation runs automatically as part of `build:dev` and `build:prod` — no manual steps required.

- **Images** — converted and compressed to WebP format using Sharp
- **Videos** — compressed using ffmpeg with H.264 encoding

Optimisation is skipped on local builds to keep development fast.

## Getting Started Checklist

Before starting a new project, fill in the following placeholders:

### Business Information

Within [site.js](src/_data/site.js) fill in the business information and URLs for each environment. This information feeds into the SEO features of the website and can be used as a single source of truth for business data across contact pages, footers etc:
```{{ site.email }}```

> The image key is used to add the relative path to the website preview image. This appears when people share the website URL. This image should be 1200 x 675 pixels.

### Environment URLs

Inside `src/_data/site.js` update the three URLs for each environment:
```
url: env === "production"
    ? "https://your-real-domain.com"
    : env === "development"
    ? "https://your-preview-url.hostingersite.com"
    : "http://localhost:8080",
```

### Sitemap

A sitemap is automatically generated on `build:dev` and `build:prod` builds at `/sitemap.xml`. No manual steps are required. Make sure your URLs in `site.js` are correct before deploying.

## Deployment

This project includes a deploy script to upload your static site to an FTP server. Each project requires its own `.env` file with the correct credentials.

### 1. Create a .env file

In the root of the project, create a `.env` file with the following variables:

```
FTP_HOST_DEV={DEV HOST IP}
FTP_HOST_PROD={PROD HOST IP}
FTP_USERNAME={HPanel Website Username}
FTP_PASSWORD={Your Password}
REMOTE_ROOT=/public_html
````

### 2. Deploy to Dev
```npm run deploy:dev```

- Builds the site with dev environment URLs
- Optimises images and videos
- Uploads `dist-dev` to your dev FTP server

### 3. Deploy to Prod
```npm run deploy:prod```

- Builds the site with production environment URLs
- Optimises images and videos
- Prompts for confirmation before deploying
- Uploads `dist-prod` to your production FTP server

##

> And as always, have a Webbie good time coding...
