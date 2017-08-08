import { get } from '@/assets/fetch';
import * as types from "../mutation-types";

const state = {
  paperData: [],
  paperApproval: null
}

const mutations = {
  [types.GET_PAPERS] (state, { data }) {
    state.paperData = data.papers
  },
  [types.GET_PAPERS_APPROVAL] (state, { data }) {
    state.paperApproval = data.approvals[0]
  }
}

const actions = {
  getPapers ({ commit }, {id, version=1}) {
    get(`api/coord/sub/${id}/papers`, {params: {version: version}}).then(data => {
      commit(types.GET_PAPERS, { data })
    })
  },
  getPaperApproval ({ commit }, paperId) {
    get(`api/coord/paper/${paperId}/approvals`).then(data => {
      commit(types.GET_PAPERS_APPROVAL, { data })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
