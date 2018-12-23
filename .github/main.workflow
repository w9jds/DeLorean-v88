workflow "Deployment Workflow" {
  on = "push"
  resolves = [
    "Deploy to Production",
    "Deploy to Development",
  ]
}

action "Filter to Master Branch" {
  uses = "actions/bin/filter@b2bea07"
  args = "branch master"
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

action "GitHub Action for npm" {
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
  needs = ["GitHub Action for npm"]
  args = "deploy --only hosting:prod"
  secrets = ["FIREBASE_TOKEN"]
}

action "Filter for Development" {
  uses = "actions/bin/filter@b2bea07"
  needs = ["Install Dependencies"]
}

action "Build for Development" {
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
  needs = ["Build for Development"]
  args = "deploy --only hosting:dev"
  secrets = ["FIREBASE_TOKEN"]
}
