# Project 3 - Chat Server Backend







## Local Deployment

### Install Docker

Follow the instructions here: https://www.docker.com/products/docker-desktop

### Set Environment Variable

Add the following to your `.bash_profile` script, or similar for your shell:

```sh
# If your ucsb email is user_1@ucsb.edu, then YOUR_ACCOUNT_NAME is user-1
# Note: If you have an underscore in your account name, please replace with a hypen.
export CS291_ACCOUNT=YOUR_ACCOUNT_NAME
```

### Docker Build

```sh
docker build -t us.gcr.io/cs291-f19/project3_${CS291_ACCOUNT} .
```

### Docker Run

```sh
docker run -it --rm   -p 3000:3000   -v ~/.config/gcloud/application_default_credentials.json:/root/.config/gcloud/application_default_credentials.json   us.gcr.io/cs291-f19/project3_${CS291_ACCOUNT}
```

### Test Using CURL

```sh
curl -D- localhost:3000/
```




