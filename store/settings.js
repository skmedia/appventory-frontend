export const state = () => ({
    showSettings: 0
  })
  
  export const mutations = {
    toggleSettings(state) {
      state.showSettings = !state.showSettings
    }
  }