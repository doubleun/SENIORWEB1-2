export default {
  async setDrawerState(sate, drawerState) {
    console.log('set drawer action', drawerState)
    await sate.commit('SET_DRAWER', drawerState)
  }
}
