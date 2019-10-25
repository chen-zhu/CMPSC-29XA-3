# Project 3 - Chat Server Backend

## Backend Keywords

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [SSE: Server-Sent Events](https://www.w3.org/TR/eventsource/)
- Docker
- Sinatra

## Available HTTP Endpoint

### `POST /login`

### `POST /message`

### `POST /stream/<SIGNED TOKEN>`

## Local Deployment

### Install Docker

Follow the instructions here: https://www.docker.com/products/docker-desktop

### Set Environment Variable

Add the following to your `.bash_profile` script, or similar for your shell:

```sh
export CS291_ACCOUNT=YOUR_ACCOUNT_NAME
```

### Docker Build

```sh
docker build -t us.gcr.io/cs291-f19/project3_${CS291_ACCOUNT} .
```

### Docker Run

```sh
docker run -it --rm \
  -p 3000:3000  \
  -v ~/.config/gcloud/application_default_credentials.json:/root/.config/gcloud/application_default_credentials.json \  us.gcr.io/cs291-f19/project3_${CS291_ACCOUNT}
```

### Test Using CURL

```sh
curl -D- localhost:3000/
```




