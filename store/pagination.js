import { defineStore } from 'pinia';
import { useTractorStore } from './tractor';

export const usePaginationStore = defineStore('pagination', {
    state: () => {
        return {
            loading: false,
            perPage: 50,
            perPageOptions: [50, 100, 200],
            currentPage: 1,
            currentSort: 'dateTime',
            currentSortDirection: 'asc',
            firstDocument: null,
            lastDocument: null,
        }
    },
    getters: {
        getNewSortedColumn(state) {
            return this.getNewData.sort((a, b) => {
                let modifier = 1;
                if (state.currentSortDirection === 'desc') modifier = -1;
                if (a[state.currentSort] < b[state.currentSort]) return -1 * modifier;
                if (a[state.currentSort] > b[state.currentSort]) return modifier;
                return 0;
            });
        },
        getNewData: () => {
            const tractorStore = useTractorStore();
            return tractorStore.tractorPoints
        }
    },
    actions: {
        sortTableColumn(column) {
            if (column === this.currentSort) {
                this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
            }
            this.currentSort = column;
        },
    }
})
