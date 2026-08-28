# Deploying ABM Tech on your VPS

For a VPS that is **already running Frappe bench** on other subdomains. The
whole point of this guide is that the two coexist without touching each
other's config.

**Result:** `abmtech.in` served by Next.js on port 3000, behind your existing
nginx, with MongoDB local, SSL from Let's Encrypt, and the app managed by
systemd so it survives reboots.

---

## 0. What already exists, and what we are adding

Frappe bench installs its own nginx config at `/etc/nginx/conf.d/frappe-bench.conf`
and owns ports 80/443 through it. **We do not edit that file.** We add a
separate server block for `abmtech.in` only. nginx routes by `server_name`, so
as long as `abmtech.in` is not listed in the Frappe config, the two never
collide.

| Piece | Frappe | ABM Tech |
| --- | --- | --- |
| Web server | nginx (shared) | nginx (shared) |
| App port | 8000 / 9000 (gunicorn, socketio) | **3000** |
| Database | MariaDB :3306 | **MongoDB :27017** |
| Process manager | supervisor | **systemd** |
| Config file | `conf.d/frappe-bench.conf` | `sites-available/abmtech.in` |

Nothing overlaps. If your bench uses a different port, the only rule is that
ABM Tech's port (3000) is free — check with `sudo ss -tlnp | grep 3000`.

---

## 1. Prerequisites

```bash
sudo ss -tlnp | grep -E ':(80|443|3000|27017)\s'
```

Port 80/443 will show nginx (expected). **3000 and 27017 must be empty.** If
3000 is taken, pick another and change it consistently everywhere below.

---

## 2. Install Node 22 LTS

Frappe uses its own Node via nvm for asset building. Installing a system Node
does not disturb it.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # v22.x
```

---

## 3. Install MongoDB 7

MariaDB (Frappe) and MongoDB run side by side on different ports.

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc \
  | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" \
  | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable --now mongod
sudo systemctl status mongod --no-pager
```

> Replace `jammy` with your Ubuntu codename (`lsb_release -cs`). For Debian use
> the Debian repo path from MongoDB's docs.

### Bind to localhost only

Open `/etc/mongod.conf` and confirm:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1
```

`bindIp: 127.0.0.1` means MongoDB is unreachable from the internet regardless
of your firewall. Do not change it — the app connects locally.

### Create the database user

```bash
mongosh
```

```javascript
use admin
db.createUser({
  user: "root",
  pwd: passwordPrompt(),
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})
exit
```

Enable auth in `/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

Then the application user (least privilege — it can only touch its own database):

```bash
mongosh -u root -p --authenticationDatabase admin
```

```javascript
use abm_tech
db.createUser({
  user: "abm_app",
  pwd: passwordPrompt(),
  roles: [ { role: "readWrite", db: "abm_tech" } ]
})
exit
```

---

## 4. Deploy the application

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
cd /var/www
git clone <your-repo-url> abmtech
cd abmtech
npm ci
```

### Environment

```bash
nano /var/www/abmtech/.env.local
```

```ini
NODE_ENV=production

# --- CMS ---
MONGODB_URI=mongodb://abm_app:YOUR_APP_PASSWORD@127.0.0.1:27017/abm_tech?authSource=abm_tech
MONGODB_DB=abm_tech

# openssl rand -base64 48
AUTH_SECRET=PASTE_A_LONG_RANDOM_STRING

NEXTAUTH_URL=https://abmtech.in
NEXT_PUBLIC_SITE_URL=https://abmtech.in

# --- Business details (these reach the header, footer, schema and llms.txt) ---
NEXT_PUBLIC_CONTACT_EMAIL=contact@abmtech.in
NEXT_PUBLIC_PHONE_E164=+919119756710
NEXT_PUBLIC_PHONE_DISPLAY=+91 91197 56710
NEXT_PUBLIC_WHATSAPP=919119756710
NEXT_PUBLIC_ADDR_STREET=
NEXT_PUBLIC_ADDR_CITY=Dehradun
NEXT_PUBLIC_ADDR_REGION=Uttarakhand
NEXT_PUBLIC_ADDR_POSTAL=248001
NEXT_PUBLIC_MAPS_URL=

# --- Social (must be ABM Tech's OWN profiles — see the note at the bottom) ---
NEXT_PUBLIC_INSTAGRAM=
NEXT_PUBLIC_FACEBOOK=

# --- Email (optional; leads are still stored and logged without it) ---
RESEND_API_KEY=
```

```bash
chmod 600 /var/www/abmtech/.env.local
```

### Build

```bash
cd /var/www/abmtech
npm run build
```

The build must succeed **without** a database — that is deliberate, and it is
why a Mongo outage can never take the site down.

### Seed

```bash
npm run seed          # imports the committed content into MongoDB

ADMIN_EMAIL=you@abmtech.in \
ADMIN_PASSWORD='a long passphrase you will remember' \
ADMIN_NAME='Your Name' \
npm run seed:admin
```

Then **remove `ADMIN_PASSWORD` from your shell history**:

```bash
history -d $((HISTCMD-1))
```

---

## 5. Run it under systemd

```bash
sudo nano /etc/systemd/system/abmtech.service
```

```ini
[Unit]
Description=ABM Tech (Next.js)
After=network.target mongod.service
Wants=mongod.service

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/var/www/abmtech
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/abmtech/.env.local
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=abmtech

# Hardening — the app needs nothing outside its own directory.
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=read-only
ReadWritePaths=/var/www/abmtech/.next

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now abmtech
sudo systemctl status abmtech --no-pager
curl -I http://127.0.0.1:3000     # expect 200
```

---

## 6. nginx

Point DNS first: an **A record** for `abmtech.in` and `www.abmtech.in` at your
VPS IP. Wait for it to resolve (`dig +short abmtech.in`) before requesting a
certificate.

```bash
sudo nano /etc/nginx/sites-available/abmtech.in
```

```nginx
# ABM Tech — separate from the Frappe bench config, which owns its own
# server_names in conf.d/frappe-bench.conf. nginx routes by server_name, so
# the two never see each other's traffic.

upstream abmtech_app {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name abmtech.in www.abmtech.in;

    # certbot writes its challenge here; everything else goes to HTTPS.
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://abmtech.in$request_uri; }
}

# www -> apex, so only one hostname is ever indexed.
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.abmtech.in;

    ssl_certificate     /etc/letsencrypt/live/abmtech.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/abmtech.in/privkey.pem;

    return 301 https://abmtech.in$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name abmtech.in;

    ssl_certificate     /etc/letsencrypt/live/abmtech.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/abmtech.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Contact form and admin writes are small; 2M is generous.
    client_max_body_size 2m;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               application/xml+rss image/svg+xml;
    gzip_min_length 1024;

    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Immutable build assets — safe to cache hard, the filenames are hashed.
    location /_next/static/ {
        proxy_pass http://abmtech_app;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # The admin must never be cached by any intermediary.
    location /admin {
        proxy_pass http://abmtech_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass 1;
        add_header Cache-Control "no-store" always;
    }

    location / {
        proxy_pass http://abmtech_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

Enable it and check nothing else already claims the name:

```bash
sudo grep -rn "abmtech" /etc/nginx/conf.d/ /etc/nginx/sites-enabled/ || echo "no conflict"
sudo ln -s /etc/nginx/sites-available/abmtech.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

> If `sites-enabled` is not included on your box (some Frappe images only use
> `conf.d`), check `/etc/nginx/nginx.conf` for
> `include /etc/nginx/sites-enabled/*;` and add it inside the `http { }` block,
> or place the file in `conf.d/abmtech.in.conf` instead.

### SSL

The HTTPS blocks above reference certificates that do not exist yet, so get
them first with the webroot method — this does **not** touch the Frappe config:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --webroot -w /var/www/html \
  -d abmtech.in -d www.abmtech.in \
  --agree-tos -m you@abmtech.in --no-eff-email
sudo nginx -t && sudo systemctl reload nginx
```

Renewal is automatic via the `certbot.timer` systemd unit. Verify:

```bash
sudo certbot renew --dry-run
```

---

## 7. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

**Do not open 3000 or 27017.** Both are localhost-only and must stay that way.

---

## 8. Verify

```bash
curl -I https://abmtech.in                       # 200
curl -s https://abmtech.in/sitemap.xml | head    # XML
curl -s https://abmtech.in/llms.txt | head       # markdown
curl -I https://abmtech.in/admin                 # 307 -> /admin/login
curl -s https://abmtech.in/api/v1                # 401 without a token
curl -s https://abmtech.in/api/v1/openapi.json | head -3
```

Then sign in at `https://abmtech.in/admin/login`, edit a service price, and
confirm `/pricing` updates within a second or two.

---

## 9. Updating the site

```bash
cd /var/www/abmtech
git pull
npm ci
npm run build
sudo systemctl restart abmtech
```

Content edits made in the admin are **not** affected by a redeploy — they live
in MongoDB. `npm run seed` would overwrite them for the records present in the
seed files, so only run it on first install or when you deliberately want the
committed content to win.

---

## 10. Backups

Content lives in MongoDB. Back it up:

```bash
sudo nano /usr/local/bin/abm-backup.sh
```

```bash
#!/usr/bin/env bash
set -euo pipefail
DEST=/var/backups/abmtech
STAMP=$(date +%F-%H%M)
mkdir -p "$DEST"
mongodump --uri="mongodb://abm_app:YOUR_APP_PASSWORD@127.0.0.1:27017/abm_tech?authSource=abm_tech" \
  --archive="$DEST/abm_tech-$STAMP.gz" --gzip
# Keep 30 days.
find "$DEST" -name 'abm_tech-*.gz' -mtime +30 -delete
```

```bash
sudo chmod 700 /usr/local/bin/abm-backup.sh
sudo crontab -e
# 0 2 * * *  /usr/local/bin/abm-backup.sh
```

**Test the restore once**, or you do not have a backup:

```bash
mongorestore --uri="mongodb://root:PW@127.0.0.1:27017/?authSource=admin" \
  --archive=/var/backups/abmtech/abm_tech-DATE.gz --gzip \
  --nsFrom='abm_tech.*' --nsTo='abm_tech_restoretest.*'
```

---

## 11. Logs and troubleshooting

```bash
sudo journalctl -u abmtech -f            # application
sudo tail -f /var/log/nginx/error.log    # proxy
sudo systemctl status mongod             # database
```

| Symptom | Cause | Fix |
| --- | --- | --- |
| 502 Bad Gateway | App not running | `sudo systemctl status abmtech`, then `journalctl -u abmtech -n 50` |
| Site loads, admin says "No database configured" | `MONGODB_URI` not reaching the process | It must be in `.env.local` **and** `EnvironmentFile`; `systemctl daemon-reload` after edits |
| Sign-in fails silently | `AUTH_SECRET` missing or `NEXTAUTH_URL` wrong | Both must be set; `NEXTAUTH_URL` must be the exact public origin |
| Edits save but the page does not change | Aggressive caching in front of nginx | Cloudflare "Cache Everything" will do this — bypass `/admin` and `/api` |
| Frappe site broke after this | A `server_name` collision | `sudo grep -rn "server_name" /etc/nginx/conf.d/ /etc/nginx/sites-enabled/` and make sure no host is listed twice |

---

## 12. A note on the social links

`NEXT_PUBLIC_INSTAGRAM` and `NEXT_PUBLIC_FACEBOOK` feed `sameAs` in the
Organization structured data, which is how a search engine ties a website and
a social profile to the same entity.

They must be **ABM Tech's own profiles**. Pointing them at Google IT Solution's
accounts actively tells Google the two brands are one company. Leaving them
empty renders no icon and is the correct state until the accounts exist.

---

## Appendix — why the site cannot be broken from the admin

Three properties worth knowing, because they change how carefully you need to
treat the CMS:

1. **The database is optional.** Every read falls back to the content committed
   in `src/lib/content/`. Stop MongoDB and the site still serves every page —
   it simply serves the last committed version.
2. **Deleting a setting restores the original copy.** Page-copy overrides are
   read with a mandatory fallback, so an empty or missing key renders the
   wording in the repository rather than a blank heading.
3. **Pages stay statically generated.** Content is fetched on the server during
   static generation, not in the browser. A write calls `revalidatePath`, which
   regenerates the HTML. Crawlers always receive fully rendered markup with the
   JSON-LD intact — the CMS does not turn this into a client-rendered site.
