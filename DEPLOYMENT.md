# Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for Vite React apps.

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? will-it-rain
   - Directory? ./
   - Override settings? No

4. **Production deployment:**
   ```bash
   vercel --prod
   ```

**Alternative: Deploy via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Vite settings
4. Click "Deploy"

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy
   ```

4. **Deploy to production:**
   ```bash
   netlify deploy --prod
   ```

**Alternative: Deploy via Netlify Dashboard**
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Or connect your GitHub repository

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.js:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/will-it-rain/', // Your repo name
   })
   ```

3. **Add to package.json scripts:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings
   - Pages section
   - Source: gh-pages branch

### Option 4: AWS Amplify

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify:**
   ```bash
   amplify init
   ```

3. **Add hosting:**
   ```bash
   amplify add hosting
   ```

4. **Publish:**
   ```bash
   amplify publish
   ```

### Option 5: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create .dockerignore:**
   ```
   node_modules
   npm-debug.log
   .git
   .gitignore
   ```

3. **Build and run:**
   ```bash
   docker build -t will-it-rain .
   docker run -p 8080:80 will-it-rain
   ```

### Option 6: Traditional Web Server

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload dist folder** to your web server

3. **Configure server** (Apache example):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## 🔧 Environment Variables

If you're using real NASA APIs, create `.env` file:

```env
VITE_NASA_API_KEY=your_api_key_here
VITE_OPENWEATHER_API_KEY=your_key_here
```

**Important:** Environment variables must be prefixed with `VITE_` to be accessible.

Access in code:
```javascript
const apiKey = import.meta.env.VITE_NASA_API_KEY
```

## 📝 Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test the production build locally (`npm run preview`)
- [ ] Update all API endpoints to production URLs
- [ ] Add environment variables to hosting platform
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test data export functionality
- [ ] Add analytics (Google Analytics, Plausible, etc.)
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Create custom domain (if desired)
- [ ] Enable HTTPS
- [ ] Set up CDN for assets
- [ ] Optimize images
- [ ] Add meta tags for SEO
- [ ] Create sitemap.xml
- [ ] Test loading speed

## 🎨 Production Optimizations

### 1. Enable Gzip Compression

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

**Apache:**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

### 2. Add Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### 3. Enable HTTP/2

Most modern hosting platforms enable this by default.

### 4. Add Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## 📊 Performance Monitoring

### Add Google Analytics

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Lighthouse CI

Run before deployment:
```bash
npm install -g @lhci/cli
lhci autorun
```

## 🔒 Security Considerations

1. **API Keys:** Never commit API keys to Git
2. **CORS:** Configure properly for your domain
3. **Rate Limiting:** Implement on backend
4. **Input Validation:** Already handled in components
5. **HTTPS:** Always use HTTPS in production
6. **CSP Headers:** Add Content Security Policy

## 📱 PWA Setup (Optional)

To make the app installable:

1. **Install workbox:**
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. **Update vite.config.js:**
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa'
   
   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'Will It Rain?',
           short_name: 'WillItRain',
           description: 'Weather conditions planner',
           theme_color: '#667eea',
           icons: [
             {
               src: 'icon-192.png',
               sizes: '192x192',
               type: 'image/png'
             }
           ]
         }
       })
     ]
   })
   ```

## 🌐 Custom Domain

### Vercel:
1. Go to project settings
2. Domains tab
3. Add your domain
4. Configure DNS records

### Netlify:
1. Domain settings
2. Add custom domain
3. Netlify DNS or external DNS

## 🎯 Post-Deployment

1. **Submit to search engines**
2. **Share on social media**
3. **Create demo video**
4. **Write blog post**
5. **Monitor analytics**
6. **Collect user feedback**
7. **Plan next features**

## 🆘 Troubleshooting

**Build fails:**
- Clear node_modules and reinstall
- Check Node.js version (18+ recommended)

**Blank page after deployment:**
- Check browser console for errors
- Verify base URL in vite.config.js
- Check for routing issues

**Assets not loading:**
- Check asset paths (should be relative)
- Verify build output in dist folder

**Map not showing:**
- Check if Leaflet CSS is loaded
- Verify internet connection for tiles

## 📞 Support

Need help? 
- Open an issue on GitHub
- Check documentation
- Join our Discord community

---

Ready to deploy? Choose your platform and follow the steps above! 🚀
