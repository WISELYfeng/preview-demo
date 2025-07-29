import { defineStore } from 'pinia';

export const useTableAStore = defineStore({
  id: 'tableA',
  state: () => ({
    columns: [
      { id: 'name', title: 'Name', width: 90, align: 'left', fixed: 'left', sortable: false },
      { id: 'age', title: '年龄', width: 70, align: 'center', sortable: true },
      { id: 'email', title: 'Email', width: 100, align: 'right', sortable: true },
      { id: 'balance', title: 'Balance', width: 120, align: 'right', sortable: true },
      { id: 'status', title: 'Status', width: 60, align: 'right', sortable: true },
      { id: 'status1', title: 'Status1', width: 60, align: 'right', sortable: true },
      { id: 'status2', title: 'Status2', width: 100, align: 'right', sortable: true },
      { id: 'status3', title: 'Status3', width: 100, align: 'right', sortable: true }
    ],
    type: 0, //1常规表格 1卡片内表格 常规表格空数据显示图，卡片表格空数据显示“暂无数据”纯文本；常规表格加载完全部数据底部会显示“已无更多数据”，卡片表格没有
    data: [],
    rowHeight: 60,
    rowKey: 'id',
    loading: true,
    pageSize: 100,
    total: 1000,
    pageNum: 1,
    sortField: 'age',
    sortOrder: 0,
    showCheckbox: false,
    selectedRowKeys: [], //复选框选中id
    enableLoadMore: true,
    extendedField1: [], //扩展字段1
    extendedField2: 0 //扩展字段2
  }),
  actions: {
    setData(data) {
      this.data = data;
    },
    setPageNum(pageNum) {
      this.pageNum = pageNum;
    },
    setSortInfo({ sortField, sortOrder }) {
      this.sortField = sortField;
      this.sortOrder = sortOrder;
    },
    setSelectedRowKeys(keys) {
      if (Array.isArray(keys)) {
        this.selectedRowKeys = keys;
      }
    },
    setTotal(total) {
      this.total = total;
    },
    async fetchData(type = 'init') {
      this.loading = true;
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        extendedField1: this.extendedField1,
        extendedField2: this.extendedField2
      };
      try {
        const tableData = this.getHomeList(params);
        this.loading = false;
        this.total = 1111;
        if (type === 'init') {
          this.data = tableData;
        } else if (type === 'sort') {
          this.data = tableData;
        } else if (type === 'loadMore') {
          this.data.push(...tableData);
        } else if (type === 'fieldChange') {
          this.data = tableData;
        }
      } catch (error) {
        console.error('Failed to fetch list:', error);
        throw error; // 如果需要可以在这里处理错误
      }
    },
    getHomeList(params) {
      const excessLength = this.total - this.data.length;
      const fetchLength = Math.min(excessLength, this.pageSize);
      if (fetchLength <= 0) return [];
      return Array.from({ length: fetchLength }, (_, i) => ({
        id: (this.pageNum - 1) * this.pageSize + i, // 使用自增ID，确保唯一
        name: `UserA ${(this.pageNum - 1) * this.pageSize + i}`,
        age: Math.floor(Math.random() * 30) + 20,
        email: `user${this.pageSize * this.pageNum + i + 1}@example.com`,
        balance: (Math.random() * 10000).toFixed(2),
        status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
        status1: ['Active1', 'Inactive1', 'Pending1'][Math.floor(Math.random() * 3)],
        status2: ['Active2', 'Inactive2', 'Pending2'][Math.floor(Math.random() * 3)],
        status3: ['Active3', 'Inactive3', 'Pending3'][Math.floor(Math.random() * 3)]
      }));
    },
    setExtendedField1(extendedField1) {
      this.extendedField1 = extendedField1;
    },
    setExtendedField2(extendedField2) {
      this.extendedField2 = extendedField2;
    }
  }
});
