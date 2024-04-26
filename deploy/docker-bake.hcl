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
  tags = [
    notequal("", VERSION) ? "${REPO}/freegpt35:${VERSION}" : "",
    "${REPO}/freegpt35:latest",
  ]
  platforms = ["linux/amd64", "linux/arm64"]
}
