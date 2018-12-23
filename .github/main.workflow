workflow "Production Workflow" {
  on = "push"
  resolves = [
    "Deploy to Production",
  ]
}

action "Install Dependencies" {
  uses = "actions/npm@e7aaefe"
  args = "install"
}

action "Filter for Production" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["Install Dependencies"]
  args = "branch master"
}

action "Build Production" {
  uses = "actions/npm@e7aaefe"
  needs = ["Filter for Production"]
  args = "run build-prod"
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

workflow "Development Workflow" {
  on = "push"
  resolves = ["Deploy to Development"]
}

action "Filter for Development" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["Install Dependencies"]
  args = "branch development"
}

action "Build Development" {
  uses = "actions/npm@e7aaefe"
  needs = ["Filter for Development"]
  args = "run build"
  secrets = ["DELOREAN_API_KEY", "DELOREAN_MAP_API"]
  env = {
    WINDY_CITY_EVENT_ID = "49674676294"
  }
}

action "Deploy to Development" {
  uses = "w9jds/firebase-action@master"
  needs = ["Build Development"]
  args = "deploy --only hosting:dev"
  secrets = ["FIREBASE_TOKEN"]
}


