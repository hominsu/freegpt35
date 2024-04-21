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
    "type=env,id=NEXT_PUBLIC_BASE_URL",
    "type=env,id=NEXT_PUBLIC_API_URL",
    "type=env,id=NEXT_PUBLIC_CRON",
    "type=env,id=NEXT_PUBLIC_USER_AGENT",
    "type=env,id=NEXT_PUBLIC_PROXY_ENABLE",
    "type=env,id=NEXT_PUBLIC_PROXY_PROTOCOL",
    "type=env,id=NEXT_PUBLIC_PROXY_HOST",
    "type=env,id=NEXT_PUBLIC_PROXY_PORT",
    "type=env,id=NEXT_PUBLIC_PROXY_AUTH",
    "type=env,id=NEXT_PUBLIC_PROXY_USERNAME",
    "type=env,id=NEXT_PUBLIC_PROXY_PASSWORD",
  ]
  tags = [
    notequal("", VERSION) ? "${REPO}/freegpt35:${VERSION}" : "",
    "${REPO}/freegpt35:latest",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}
