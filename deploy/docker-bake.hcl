variable "REPO" {
  default = "hominsu"
}

variable "AUTHOR_NAME" {
  default = "Homing So"
}

variable "AUTHOR_EMAIL" {
  default = "i@homing.so"
}

variable "VERSION" {
  default = ""
}

group "default" {
  targets = [
    "freegpt35",
  ]
}

target "freegpt35" {
  context    = "."
  dockerfile = "deploy/Dockerfile"
  args       = {
    AUTHOR_NAME       = "${AUTHOR_NAME}"
    AUTHOR_EMAIL      = "${AUTHOR_EMAIL}"
    VERSION           = "$(VERSION)"
  }
  secret = [
    "type=env,id=NEXT_PORT",
    "type=env,id=NEXT_BASE_URL",
    "type=env,id=NEXT_API_URL",
    "type=env,id=NEXT_REFRESH_INTERVAL",
    "type=env,id=NEXT_ERROR_WAIT",
    "type=env,id=NEXT_PROXY_ENABLE",
    "type=env,id=NEXT_PROXY_PROTOCOL",
    "type=env,id=NEXT_PROXY_HOST",
    "type=env,id=NEXT_PROXY_PORT",
    "type=env,id=NEXT_PROXY_AUTH",
    "type=env,id=NEXT_PROXY_USERNAME",
    "type=env,id=NEXT_PROXY_PASSWORD",
  ]
  tags = [
    notequal("", VERSION) ? "${REPO}/freegpt35:${VERSION}" : "",
    "${REPO}/freegpt35:latest",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}
