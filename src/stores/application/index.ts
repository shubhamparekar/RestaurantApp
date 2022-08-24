import { defineStore } from 'pinia'
import { state } from './state'
import { actions } from './actions'

export const useApplicationStore = defineStore({
    id: 'application',
    state,
    actions,
})
