workflow "Deployment Workflow" {
  on = "push"
  resolves = ["Deploy to Production", "Deploy to Development"]
}

action "Get Dependencies" {
  uses = "actions/npm@e7aaefe"
  args = "install"
}

action "Filter to Master Branch" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["Get Dependencies"]
  args = "branch master"
}

action "Filter to Dev Branch" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["Get Dependencies"]
  args = "branch development"
}

action "Build Production" {
  uses = "actions/npm@e7aaefe"
  needs = ["Filter to Master Branch"]
  args = "run build-prod"
  secrets = ["DELOREAN_API_KEY", "DELOREAN_MAP_API"]
  env = {
    WINDY_CITY_EVENT_ID = "49674676294"
  }
}

action "Build Development" {
  uses = "actions/npm@e7aaefe"
  needs = ["Filter to Dev Branch"]
  args = "run build"
  secrets = ["DELOREAN_API_KEY", "DELOREAN_MAP_API"]
  env = {
    WINDY_CITY_EVENT_ID = "49674676294"
  }
}

action "Deploy to Production" {
  uses = "w9jds/firebase-action@master"
  needs = ["Build Production"]
  args = "deploy --only hosting:prod"
  secrets = ["FIREBASE_TOKEN"]
}

action "Deploy to Development" {
  uses = "w9jds/firebase-action@master"
  needs = ["Build Development"]
  args = "deploy --only hosting:dev"
  secrets = ["FIREBASE_TOKEN"]
}
