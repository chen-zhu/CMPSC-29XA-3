# Project 3 - Chat Server Backend

## Implementation Keywords

- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [SSE: Server-Sent Events](https://www.w3.org/TR/eventsource/)
- Docker
- Sinatra

## Available HTTP Endpoint

### POST /login

Sample CURL
```sh
curl -D- <BASE_URL>/login -F username=<USERNAME> -F password=<PASSWORD>
```

Sample HTTP Response
```sh
HTTP/1.1 201 CREATED
Content-Type: application/json

{"token": "<SIGNED TOKEN>"}
```

### POST /message

Sample CURL
```sh
curl -D- <BASE_URL>/message -F message=test -H "Authorization: Bearer <SIGNED TOKEN>"
```

Sample HTTP Response
```sh
HTTP/1.1 201 CREATED
```

### GET /stream/<SIGNED TOKEN>
Establish stream connection with frontend

Sample CURL
```sh
curl -D- <BASE_URL>/stream/<SIGNED TOKEN>
```

Sample HTTP Response
```sh
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8

data: {"users": ["curl"], "created": 1570999219.797813}
event: Users
id: 0718299d-43ef-4b1c-b1cf-ba828d195959

data: {"status": "Server start", "created": 1570947584.0895946}
event: ServerStatus
id: ed4e3e63-9680-436d-9ab2-e0546b5cc03f

data: {"message": "We're online!", "user": "bboe", "created": 1570947655.5598643}
event: Message
id: 1a72e044-92e4-4ee5-94fe-5cabacb75b83
```

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



