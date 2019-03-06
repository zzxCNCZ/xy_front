export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    doctorId: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateDoctorId (state, doctorId) {
      state.doctorId = doctorId
    }
  }
}
