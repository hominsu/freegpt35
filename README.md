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
    <a href="#Reference">Reference</a>
    ·
    <a href="#License">License</a>
  </p>
</div>

## Features

- **Streaming API**. freegpt35 allows the response sent back incrementally in chunks.
- **Easy Deploy**. Containerized, starts in seconds using docker compose.
- **Login free**. Do not need to worry about the details of authorization, use at a glance.

## Examples

### Usage at a glance

```bash
mkdir freegpt35 && cd freegpt35
curl -O https://raw.githubusercontent.com/hominsu/freegpt35/main/deploy/docker-compose.yml
```

Then add the environment if you need, for more details check the following [**Customize**](https://github.com/hominsu/freegpt35?tab=readme-ov-file#customize) part.

```
docker compose up -d
```

Once deployed, use the following command to confirm that everything is working well.

```bash
curl -X POST "http://localhost:3000/v1/chat/completions" \
     -H "Authorization: Bearer anything_or_your_key" \
     -H "Content-Type: application/json" \
     -d '{
           "model": "gpt-3.5-turbo",
           "messages": [{"role": "user", "content": "Hello"}],
         }'
```

```json
{"id":"chatcmpl-*********","created":9999999999,"model":"gpt-3.5-turbo","object":"chat.completion","choices":[{"finish_reason":"stop","index":0,"message":{"content":"Hi there! How can I assist you today?","role":"assistant"}}],"usage":{"prompt_tokens":1,"completion_tokens":10,"total_tokens":11}}
```

### Nginx Template

Here is an Nginx conf template that you can refer to. For more info about NGINX Docker setup you can check this post: [优雅地在 Docker 中使用 NGINX](https://homing.so/blog/nginx/how-to-use-nginx-elegantly-with-docker)

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

### Vercel

If you subscribe to Vercel, you can try this deploy method, otherwise do not waste your time, since with `Hobby` plan your serverless API routes can only be processed for 5 seconds, and the route responds with a `FUNCTION_INVOCATION_TIMEOUT` error.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhominsu%2Ffreegpt35&env=NEXT_API_KEY&envDescription=API%20key%20used%20for%20authentication%20to%20access%20the%20API.&envLink=https%3A%2F%2Fgithub.com%2Fhominsu%2Ffreegpt35%3Ftab%3Dreadme-ov-file%23customize)

Once deployed, you can test with curl again

```bash
curl -X POST "https://freegpt35.vercel.app/v1/chat/completions" \
     -H "Authorization: Bearer anything_or_your_key" \
     -H "Content-Type: application/json" \
     -d '{
           "model": "gpt-3.5-turbo",
           "messages": [{"role": "user", "content": "Hello"}]
         }'
```

```json
{"id":"chatcmpl-**********","created":9999999999,"model":"gpt-3.5-turbo","object":"chat.completion","choices":[{"finish_reason":"stop","index":0,"message":{"content":"Hey there! How's it going?","role":"assistant"}}],"usage":{"prompt_tokens":1,"completion_tokens":8,"total_tokens":9}}
```

### Customize

You can also define your Environment Variables to for some specific cases.

| Environment Variable | Description                                                                                                                                                                                    |
|:---------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NEXT_BASE_URL`      | Base URL for the ChatGPT, modified it if you using a mirror site                                                                                                                               |
| `NEXT_API_URL`       | **DO NOT MODIFIED IT**, unless you really know what you're doing                                                                                                                               |
| `NEXT_API_KEY`       | API key used for authentication to access the API.                                                                                                                                             |
| `NEXT_MAX_RETRIES`   | Maximum number of retries for API requests in case of failure.                                                                                                                                 |
| `NEXT_USER_AGENT`    | User agent string used in the headers of requests sent from the server.                                                                                                                        |
| `NEXT_PROXY`         | Enable http(s) proxy e.g. `http://127.0.0.1:7890`. If multiple proxies are needed, separate each proxy with `,` e.g. `https://user:password@proxy-1:10000,https://user:password@proxy-2:10001` |

## Reference

- https://github.com/PawanOsman/ChatGPT

## License

Distributed under the AGPL 3.0 license. See `LICENSE` for more information.
