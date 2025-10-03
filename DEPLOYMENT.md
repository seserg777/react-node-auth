# Deployment Instructions

## Local Development Setup (OSPanel)

### 1. Create OSPanel Configuration

Create `.osp/project.ini` file in the project root:

```ini
[react-node-auth.loc]

php_engine   = PHP-8.2
allow_url_fopen = on
ssl               = on
ssl_cert_file     = auto
ssl_key_file      = auto
document_root     = apps/frontend/build
```

### 2. Create Root Redirect Files

Create `index.html` in the project root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Node Auth</title>
    <script>
        window.location.href = '/apps/frontend/build/';
    </script>
</head>
<body>
    <p>Redirecting to React app...</p>
    <p>If you are not redirected automatically, <a href="/apps/frontend/build/">click here</a>.</p>
</body>
</html>
```

Create `.htaccess` in the project root:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/apps/frontend/build/
RewriteRule ^(.*)$ /apps/frontend/build/$1 [L]
RewriteRule ^$ /apps/frontend/build/index.html [L]
RewriteCond %{REQUEST_URI} ^/static/
RewriteRule ^(.*)$ /apps/frontend/build/$1 [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/apps/frontend/build/
RewriteRule ^.*$ /apps/frontend/build/index.html [L]
```

### 3. Build the Frontend

```bash
cd apps/frontend
npm run build
```

### 4. Restart OSPanel

Restart your OSPanel server to apply the new configuration.

## Production Deployment

For production deployment, configure your web server to serve the `apps/frontend/build` directory as the document root.

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/react-node-auth/apps/frontend/build
    
    <Directory /path/to/react-node-auth/apps/frontend/build>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/react-node-auth/apps/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
