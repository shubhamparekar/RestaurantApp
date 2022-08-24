import axios from "axios"
import { useApplicationStore } from "./index"

export const actions = {

    async getFoodItems(key) {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/FoodItems?foodCategoryId=${key}`)
            .then((response) => {
                return response.data
            })
            .catch(error => console.log(error))
    },

    async submitOrder(data) {
        const store = useApplicationStore()
        return await axios
            .post(`${store.$state.url}/Order`, data)
            .then((response) => {
                return response
            })
            .catch(error => console.log(error))
    },

    async getFoodCategory() {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/Category`)
            .then((response) => {
                return response.data
            })
            .catch(error => console.log(error))
    },

    async getAllOrders() {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/Order`)
            .then((response) => {
                return response.data
            })
            .catch(error => console.log(error))
    }
}
