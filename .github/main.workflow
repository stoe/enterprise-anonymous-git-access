workflow "build and test on push" {
  on = "push"
  resolves = [
    "test"
  ]
}

action "install" {
  uses = "docker://node:10"
  args = "install"
  runs = "yarn"
}

action "test" {
  needs = [
    "install"
  ]
  uses = "docker://node:10"
  args = "test"
  runs = "yarn"
}
