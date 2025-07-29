import { defineStore } from 'pinia';

export const useTableBStore = defineStore({
  id: 'tableB',
  state: () => ({
    columns: [
      { id: 'name', title: '姓名', width: 90, align: 'left', fixed: 'left', sortable: true },
      { id: 'operate', title: '操作', width: 60, align: 'center', fixed: 'right', sortable: true },
      { id: 'email', title: '邮箱', width: 120, align: 'right', sortable: true },
      { id: 'balance', title: 'Balance', width: 80, align: 'right', sortable: true },
      { id: 'status', title: '状态', width: 70, align: 'right', sortable: true },
      { id: 'status1', title: 'Status1', width: 75, align: 'right', sortable: true },
      { id: 'status2', title: 'Status2', width: 70, align: 'right', sortable: true },
      { id: 'status3', title: 'Status3', width: 100, align: 'right', sortable: true }
    ],
    data: [],
    rowHeight: 60,
    rowKey: 'id',
    pageSize: 60,
    total: 1000,
    currentPage: 1,
    sortInfo: { sortBy: 'name', order: 'desc' },
    showCheckbox: true,
    selectedRowKeys: [], //复选框选中id
    enableLoadMore: true
  }),
  actions: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
    setSortInfo({ sortBy, order }) {
      this.sortInfo = { sortBy, order };
    },
    setSelectedRowKeys(keys) {
      if (Array.isArray(keys)) {
        this.selectedRowKeys = keys;
      }
    },
    setTotal(total) {
      this.total = total;
    },
    fetchData(type = 'init') {
      if (type === 'init') {
        this.data = this.generateMockData();
      } else if (type === 'sort') {
        this.data = this.generateMockData();
      } else if (type === 'loadMore') {
        const newData = this.generateMockData();
        this.data.push(...newData);
      }
    },
    generateMockData() {
      this.setTotal(500);
      const excessLength = this.total - this.data.length;
      const fetchLength = Math.min(excessLength, this.pageSize);
      if (fetchLength <= 0) return [];
      return Array.from({ length: fetchLength }, (_, i) => ({
        id: (this.currentPage - 1) * this.pageSize + i, // 使用自增ID，确保唯一
        name: `UserB ${(this.currentPage - 1) * this.pageSize + i}`,
        age: Math.floor(Math.random() * 30) + 20,
        email: `user${this.pageSize * this.currentPage + i + 1}@example.com`,
        balance: (Math.random() * 10000).toFixed(2),
        status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
        status1: ['Active1', 'Inactive1', 'Pending1'][Math.floor(Math.random() * 3)],
        status2: ['Active2', 'Inactive2', 'Pending2'][Math.floor(Math.random() * 3)],
        status3: ['Active3', 'Inactive3', 'Pending3'][Math.floor(Math.random() * 3)]
      }));
    }
  }
});
