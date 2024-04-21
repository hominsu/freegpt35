<div id="top"></div>

<!-- PROJECT SHIELDS -->
<p align="center">
<a href="https://github.com/hominsu/freegpt35/graphs/contributors"><img src="https://img.shields.io/github/contributors/hominsu/freegpt35.svg?style=for-the-badge" alt="Contributors"></a>
<a href="https://github.com/hominsu/freegpt35/network/members"><img src="https://img.shields.io/github/forks/hominsu/freegpt35.svg?style=for-the-badge" alt="Forks"></a>
<a href="https://github.com/hominsu/freegpt35/stargazers"><img src="https://img.shields.io/github/stars/hominsu/freegpt35.svg?style=for-the-badge" alt="Stargazers"></a>
<a href="https://github.com/hominsu/freegpt35/issues"><img src="https://img.shields.io/github/issues/hominsu/freegpt35.svg?style=for-the-badge" alt="Issues"></a>
<a href="https://github.com/hominsu/freegpt35/blob/master/LICENSE"><img src="https://img.shields.io/github/license/hominsu/freegpt35.svg?style=for-the-badge" alt="License"></a>
</p>

<div align="center">

<h3 align="center">freegpt35</h3>
  <p align="center">
    Unlimited free GPT-3.5 turbo API service.
    <br/>
    <a href="https://homing.so/about"><strong>About author »</strong></a>
    <br/>
    <br/>
    <a href="#Features">Features</a>
    ·
    <a href="#Examples">Examples</a>
    ·
    <a href="#Building">Building</a>
    ·
    <a href="#Reference">Reference</a>
    ·
    <a href="#License">License</a>
  </p>
</div>

## Features

- **Streaming API**. freegpt35 allow the response sent back incrementally in chunks.
- **Easy Deploy**. Containerized, starts in seconds using docker compose.
- **Login free**. Do not need to worry about the details of authorization, use in a glance.

## Examples

### Usage at a glance

```bash
mkdir freegpt35 && cd freegpt35
curl -O https://raw.githubusercontent.com/hominsu/freegpt35/main/deploy/docker-compose.yml
docker compose up -d
```

Once deployed, use following command to confirm that everything working.

```bash
curl -X POST "http://localhost:3000/v1/chat/completions" \
     -H "Authorization: Bearer anything" \
     -H "Content-Type: application/json" \
     -d '{
           "model": "gpt-3.5-turbo",
           "messages": [{"role": "user", "content": "How do I list all files in a directory using Python?"}]
         }'
```

### Nginx Template

Note that the token refresh api is exposed (`/api/refersh`), so it is necessary to use nginx to "hide" it. Here is an nginx conf template that you can refer to. More info about NGINX Docker setup you can check this post: [优雅地在 Docker 中使用 NGINX](https://homing.so/blog/nginx/how-to-use-nginx-elegantly-with-docker)

```nginx
upstream freegpt35 {
    server 127.0.0.1:3000
}

server {
    listen 80;
    listen [::]:80;
    server_name your.domain.name;

    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name your.domain.name;

    ssl_certificate /etc/nginx/ssl/your.domain.name/full.pem;
    ssl_certificate_key /etc/nginx/ssl/your.domain.name/key.pem;

    ssl_session_timeout 5m;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers TLS13_AES_128_GCM_SHA256:TLS13_AES_256_GCM_SHA384:TLS13_CHACHA20_POLY1305_SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers on;

    location /v1/chat/completions {
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto "https";
       proxy_pass http://freegpt35;

       proxy_buffering  off;
       proxy_cache      off;

       send_timeout               600;
       proxy_connect_timeout      600;
       proxy_send_timeout         600;
       proxy_read_timeout         600;
       chunked_transfer_encoding  on;
    }
    error_page   500 502 503 504  /50x.html;
}
```

## Building

If your country/region can not access ChatGPT, you might need a proxy. In this case, you need to build your own docker image (Next.JS replace the env in build stage).

You can specify your platform (`amd64 | arm64`), `NEXT_PUBLIC_CRON` is use to specify when the token should be refreshed.

```bash
NEXT_PUBLIC_BASE_URL="https://chat.openai.com" \
NEXT_PUBLIC_API_URL="/backend-anon/conversation" \
NEXT_PUBLIC_CRON="0 */30 * * * *" \
NEXT_PUBLIC_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36" \
NEXT_PUBLIC_PROXY_ENABLE=true \
NEXT_PUBLIC_PROXY_PROTOCOL=http \
NEXT_PUBLIC_PROXY_HOST="127.0.0.1" \
NEXT_PUBLIC_PROXY_PORT="7890" \
NEXT_PUBLIC_PROXY_AUTH="false" \
NEXT_PUBLIC_PROXY_USERNAME="" \
NEXT_PUBLIC_PROXY_PASSWORD="" \
docker buildx bake --file deploy/docker-bake.hcl --load --set "*.platform=linux/amd64"
```

## Reference

- https://github.com/PawanOsman/ChatGPT

## License

Distributed under the AGPL 3.0 license. See `LICENSE` for more information.
