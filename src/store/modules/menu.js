import { get } from '@/assets/fetch';
import * as types from "../mutation-types";

const state = {
  menuData: [],
  projectData: [],
  subProjectData: {},
  subProjectApproval: []
}

const mutations = {
  [types.GET_MENUDATA] (state, { menuData }) {
    state.menuData = menuData
  },
  [types.GET_PROJ] (state, { projectData }) {
    state.projectData = projectData
  },

  [types.GET_SUBPROJ] (state, { data }) {
    state.subProjectData = data
  },

  [types.GET_SUBPROJ_APPROVAL] (state, { data }) {//todo
    state.subProjectApproval = data
  },
}

const actions = {
  getMenuData ({ commit }) {
    get('api/coord/projects', {params: {size: 10000}}).then(data => {
      commit(types.GET_MENUDATA, { menuData: data.projects })
    })
  },
  getProjects ({ commit }, projectId) {
    get(`api/coord/project/${projectId}`).then(data => {
      commit(types.GET_PROJ, { projectData: data })
    })
  },
  getSubProjects ({ commit }, subProjectId) {
    get(`api/coord/project/sub/${subProjectId}`).then(data => {
      commit(types.GET_SUBPROJ, { data })
    })
  },
  getSubProjectApproval ({ commit }, subProjectId) {//todo
    get(`api/coord/sub/${subProjectId}/approvals`).then(data => {
      commit(types.GET_SUBPROJ_APPROVAL, { data })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
