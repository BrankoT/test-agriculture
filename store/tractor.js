import { defineStore } from 'pinia'
import {
    fetchTractors,
    fetchTractor,
    fetchTractorPoint,
    fetchTractorPoints,
    addTractor,
    addTractorPoints,
    updateTractor,
    updateTractorPoint,
} from '../src/firebase/firebaseConfig';
import { usePaginationStore } from './pagination';

export const useTractorStore = defineStore('tractor', {
    state: () => {
        return {
            tractor: null,
            tractors: [],
            tractorPoints: [],
            tractorPoint: null
        }
    },
    actions: {
        editTractorRow(row) {
            this.tractorPoint = row
        },

        fetchTractors() {
            return fetchTractors().then(response => this.tractors = response);
        },

        fetchTractor(tractorId) {
            return fetchTractor(tractorId).then(response => this.tractor = response);
        },

        fetchTractorPoint(tractorId, pointId) {
            return fetchTractorPoint(tractorId, pointId).then(response => this.tractorPoint = response);
        },

        fetchTractorPoints(tractorId, selectedDocument, pagesLimit, direction) {
            const paginationStore = usePaginationStore();
            return fetchTractorPoints(tractorId, selectedDocument, pagesLimit, direction).then(response => {
                this.tractorPoints = response
                if (response.length) {
                    paginationStore.firstDocument = this.tractorPoints[0]
                    paginationStore.lastDocument = this.tractorPoints[this.tractorPoints.length - 1]
                }
                return this.tractorPoints
            });
        },

        addTractor(tractor) {
            return addTractor(tractor)
        },

        addTractorPoints(tractorId) {
            return addTractorPoints(tractorId)
        },

        updateTractor(tractor) {
            return updateTractor(tractor)
        },

        updateTractorPoint(tractorData) {
            return updateTractorPoint(tractorData)
        }
    }
})
