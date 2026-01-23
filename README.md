# CSI - Innowave Website

Official website for the Computer Society of India - Innowave student chapter, built with Astro, Keystatic CMS, and deployed on Vercel.

## Tech Stack

- **[Astro 5.0](https://astro.build/)** - Modern web framework
- **[Keystatic CMS](https://keystatic.com/)** - GitHub-based content management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Cloudinary](https://cloudinary.com/)** - Image hosting and optimization
- **[Vercel](https://vercel.com/)** - Deployment platform

## Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account with access to the repository
- Cloudinary account (for image hosting)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PrathamGupta06/csi-website.git
cd csi-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Cloudinary Configuration
PUBLIC_CLOUDINARY_CLOUD_NAME=dop6gul0f

# Site URL (update for production)
PUBLIC_SITE_URL=http://localhost:4321

# Keystatic GitHub Integration
KEYSTATIC_GITHUB_CLIENT_ID=your_github_app_client_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_github_app_client_secret
KEYSTATIC_SECRET=your_random_secret_key
PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=csi-website-keystatic
```

**Note:** For local development without GitHub OAuth, Keystatic will work in local mode automatically.

### 4. Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Content Management

### Accessing Keystatic Admin

- **Local Development:** Navigate to `http://localhost:4321/keystatic`
- **Production:** Navigate to `https://csi-website-tau.vercel.app/keystatic`

### Content Collections

The CMS manages the following content types:

- **Sponsors** - Organization sponsors with logos
- **Events** - Upcoming and past events
- **Team** - Team members organized by category
- **Gallery** - Event photos and memories
- **About** - Vision, mission, and objectives

### Adding Content

1. Access the Keystatic admin interface
2. Authenticate with GitHub (production) or use local mode (development)
3. Select a collection (e.g., Events, Team)
4. Click "Create Entry" and fill in the details
5. For images, use Cloudinary URLs
6. Save - content is automatically committed to GitHub

## Image Management

All images are hosted on Cloudinary. To add images:

1. Upload images to Cloudinary
2. Copy the image URL
3. Paste the URL in Keystatic image fields

## Deployment

### Vercel Deployment

The site is configured for automatic deployment on Vercel:

1. Push changes to the `main` branch
2. Vercel automatically builds and deploys
3. Production URL: `https://csi-website-tau.vercel.app`

### Environment Variables on Vercel

Ensure these environment variables are set in Vercel project settings:

- `PUBLIC_CLOUDINARY_CLOUD_NAME`
- `PUBLIC_SITE_URL`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `KEYSTATIC_SECRET`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`

## Team Collaboration

### For Content Editors

1. Get added as a collaborator to the GitHub repository
2. Visit the production site at `/keystatic`
3. Authenticate with your GitHub account
4. Edit content - changes are saved as Git commits

### For Developers

1. Clone the repository
2. Create a new branch for features: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Push and create a pull request
5. After review, merge to `main` for deployment

## Project Structure

```
/
├── public/
│   ├── _headers
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── favicons/
│   │   ├── images/
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/
│   │   ├── blog/
│   │   ├── common/
│   │   ├── ui/
│   │   ├── widgets/
│   │   │   ├── Header.astro
│   │   │   └── ...
│   │   ├── CustomStyles.astro
│   │   ├── Favicons.astro
│   │   └── Logo.astro
│   ├── content/
│   │   ├── post/
│   │   │   ├── post-slug-1.md
│   │   │   ├── post-slug-2.mdx
│   │   │   └── ...
│   │   └-- config.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── MarkdownLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── [...blog]/
│   │   │   ├── [category]/
│   │   │   ├── [tag]/
│   │   │   ├── [...page].astro
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├-- rss.xml.ts
│   │   └── ...
│   ├── utils/
│   ├── config.yaml
│   └── navigation.js
├── package.json
├── astro.config.ts
└── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory if they do not require any transformation or in the `assets/` directory if they are imported directly.

## Commands

| Command             | Action                                             |
| :------------------ | :------------------------------------------------- |
| `npm install`       | Installs dependencies                              |
| `npm run dev`       | Starts local dev server at `localhost:4321`        |
| `npm run build`     | Build your production site to `./dist/`            |
| `npm run preview`   | Preview your build locally, before deploying       |
| `npm run check`     | Check your project for errors                      |
| `npm run fix`       | Run Eslint and format codes with Prettier          |

## Pages

- **Home** (`/`) - Hero section, sponsors, stats, recent events
- **About** (`/about`) - Vision, mission, objectives
- **Team** (`/team`) - Team members organized by category
- **Events** (`/events`) - Event listings with detail pages
- **Gallery** (`/gallery`) - Photo gallery with Cloudinary integration
- **Contact** (`/contact`) - Contact information

## Customization

### Site Configuration

Edit `src/config.yaml` to customize:
- Site name and metadata
- Navigation structure
- Events per page
- Social media links

### Styling

- **Custom styles:** `src/components/CustomStyles.astro`
- **Tailwind config:** `tailwind.config.js`
- **Global styles:** `src/assets/styles/tailwind.css`

## License

This project is based on the AstroWind template,