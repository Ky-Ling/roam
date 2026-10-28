import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vjn3nb8q',
    dataset: 'roam-dataset'
  },
  studioHost: 'roam-vjn3nb8q',
  deployment: {
    appId: 's4trrxj7yhykjapavjz9a1yt',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
