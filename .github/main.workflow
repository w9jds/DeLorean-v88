workflow "Production Deployment Workflow" {
  on = "push"
  resolves = ["Deploy to Production"]
}

action "Filter to Master Branch" {
  uses = "actions/bin/filter@b2bea07"
  args = "branch master"
}

action "Filter To Master Push" {
  uses = "actions/bin/filter@b2bea07"
  args = "branch master"
}

action "Install Dependencies" {
  uses = "actions/npm@e7aaefe"
  needs = ["Filter To Master Push"]
  args = "install"
}

action "Build Production" {
  uses = "actions/npm@e7aaefe"
  needs = ["Install Dependencies"]
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
