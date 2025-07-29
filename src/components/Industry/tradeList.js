const tradeList = {
  list: {
    B: [
      { label: '百货零售', code: 'BR01B01221', codeText: 'B01221', type: 'checkbox' },
      { label: '白酒', code: 'BR01B01241', codeText: 'B01241', type: 'checkbox' },
      { label: '玻璃及建材', code: 'BR01B01111', codeText: 'B01111', type: 'checkbox' },
      { label: '包装印刷', code: 'BR01B01211', codeText: 'B01211', type: 'checkbox' }
    ],
    C: [
      { label: '船舶制造', code: 'BR01B01141', codeText: 'B01141', type: 'checkbox' },
      { label: '传媒服务', code: 'BR01B01251', codeText: 'B01251', type: 'checkbox' }
    ],
    D: [
      { label: '电气电源设备', code: 'BR01B01021', codeText: 'B01021', type: 'checkbox' },
      { label: '电子半导体', code: 'BR01B01031', codeText: 'B01031', type: 'checkbox' }
    ],
    F: [
      { label: '服装家纺', code: 'BR01B01052', codeText: 'B01052', type: 'checkbox' },
      { label: '纺织面料', code: 'BR01B01051', codeText: 'B01051', type: 'checkbox' }
    ],
    G: [
      { label: '公共事业', code: 'BR01B01071', codeText: 'B01071', type: 'checkbox' },
      { label: '公交', code: 'BR01B01131', codeText: 'B01131', type: 'checkbox' },
      { label: '高速公路', code: 'BR01B01151', codeText: 'B01151', type: 'checkbox' },
      { label: '钢铁冶炼', code: 'BR01B01061', codeText: 'B01061', type: 'checkbox' },
      { label: '光学光电子', code: 'BR01B01032', codeText: 'B01032', type: 'checkbox' },
      { label: '贵重金属', code: 'BR01B01281', codeText: 'B01281', type: 'checkbox' }
    ],
    H: [
      { label: '火电', code: 'BR01B01011', codeText: 'B01011', type: 'checkbox' },
      { label: '化肥农药', code: 'BR01B01081', codeText: 'B01081', type: 'checkbox' },
      { label: '化工新材料', code: 'BR01B01082', codeText: 'B01082', type: 'checkbox' },
      { label: '黄金', code: 'BR01B01282', codeText: 'B01282', type: 'checkbox' },
      { label: '航空军工', code: 'BR01B01142', codeText: 'B01142', type: 'checkbox' },
      { label: '化学纤维', code: 'BR01B01083', codeText: 'B01083', type: 'checkbox' },
      { label: '化学原料', code: 'BR01B01084', codeText: 'B01084', type: 'checkbox' },
      { label: '化学制品', code: 'BR01B01085', codeText: 'B01085', type: 'checkbox' },
      { label: '航运', code: 'BR01B01133', codeText: 'B01133', type: 'checkbox' },
      { label: '混业房地产', code: 'BR01B01041', codeText: 'B01041', type: 'checkbox' }
    ],
    J: [
      { label: '机场港口', code: 'BR01B01152', codeText: 'B01152', type: 'checkbox' },
      { label: '基础建设', code: 'BR01B01112', codeText: 'B01112', type: 'checkbox' },
      { label: '机床仪表', code: 'BR01B01091', codeText: 'B01091', type: 'checkbox' },
      { label: '金属非金属新材料', code: 'BR01B01283', codeText: 'B01283', type: 'checkbox' },
      { label: '计算机设备', code: 'BR01B01261', codeText: 'B01261', type: 'checkbox' },
      { label: '计算机应用', code: 'BR01B01252', codeText: 'B01252', type: 'checkbox' },
      { label: '金属制品', code: 'BR01B01092', codeText: 'B01092', type: 'checkbox' },
      { label: '家用电器', code: 'BR01B01101', codeText: 'B01101', type: 'checkbox' },
      { label: '家用轻工', code: 'BR01B01212', codeText: 'B01212', type: 'checkbox' }
    ],
    L: [{ label: '旅游餐饮', code: 'BR01B01171', codeText: 'B01171', type: 'checkbox' }],
    M: [
      { label: '煤炭炼焦', code: 'BR01B01181', codeText: 'B01181', type: 'checkbox' },
      { label: '贸易', code: 'BR01B01222', codeText: 'B01222', type: 'checkbox' }
    ],
    N: [{ label: '农产品加工', code: 'BR01B01191', codeText: 'B01191', type: 'checkbox' }],
    P: [{ label: '普通有色', code: 'BR01B01284', codeText: 'B01284', type: 'checkbox' }],
    Q: [
      { label: '汽车零部件', code: 'BR01B01202', codeText: 'B01202', type: 'checkbox' },
      { label: '汽车制造及服务', code: 'BR01B01201', codeText: 'B01201', type: 'checkbox' },
      { label: '其它交运设备', code: 'BR01B01143', codeText: 'B01143', type: 'checkbox' }
    ],
    S: [
      { label: '输变电设备', code: 'BR01B01022', codeText: 'B01022', type: 'checkbox' },
      { label: '水电', code: 'BR01B01012', codeText: 'B01012', type: 'checkbox' },
      { label: '塑料橡胶', code: 'BR01B01086', codeText: 'B01086', type: 'checkbox' },
      { label: '饲料养殖', code: 'BR01B01192', codeText: 'B01192', type: 'checkbox' },
      { label: '水泥', code: 'BR01B01113', codeText: 'B01113', type: 'checkbox' },
      { label: '食品加工', code: 'BR01B01242', codeText: 'B01242', type: 'checkbox' },
      { label: '生物制药', code: 'BR01B01272', codeText: 'B01272', type: 'checkbox' },
      { label: '石油化工', code: 'BR01B01231', codeText: 'B01231', type: 'checkbox' }
    ],
    T: [
      { label: '铁路设备', code: 'BR01B01144', codeText: 'B01144', type: 'checkbox' },
      { label: '通信设备', code: 'BR01B01262', codeText: 'B01262', type: 'checkbox' },
      { label: '通用机械', code: 'BR01B01093', codeText: 'B01093', type: 'checkbox' }
    ],
    W: [{ label: '网络与通信', code: 'BR01B01253', codeText: 'B01253', type: 'checkbox' }],
    X: [{ label: '西药', code: 'BR01B01271', codeText: 'B01271', type: 'checkbox' }],
    Y: [
      { label: '元件', code: 'BR01B01033', codeText: 'B01033', type: 'checkbox' },
      { label: '饮料低度酒', code: 'BR01B01243', codeText: 'B01243', type: 'checkbox' },
      { label: '医疗器械与服务', code: 'BR01B01273', codeText: 'B01273', type: 'checkbox' },
      { label: '园区开发', code: 'BR01B01042', codeText: 'B01042', type: 'checkbox' },
      { label: '运输物流', code: 'BR01B01135', codeText: 'B01135', type: 'checkbox' },
      { label: '银行', code: 'BR01B01162', codeText: 'B01162', type: 'checkbox' },
      { label: '渔业', code: 'BR01B01193', codeText: 'B01193', type: 'checkbox' }
    ],
    Z: [
      { label: '证券保险', code: 'BR01B01161', codeText: 'B01161', type: 'checkbox' },
      { label: '中药', code: 'BR01B01274', codeText: 'B01274', type: 'checkbox' },
      { label: '主营房地产', code: 'BR01B01043', codeText: 'B01043', type: 'checkbox' },
      { label: '专业工程及装饰', code: 'BR01B01114', codeText: 'B01114', type: 'checkbox' },
      { label: '专用设备', code: 'BR01B01094', codeText: 'B01094', type: 'checkbox' },
      { label: '造纸', code: 'BR01B01213', codeText: 'B01213', type: 'checkbox' },
      { label: '种植业', code: 'BR01B01194', codeText: 'B01194', type: 'checkbox' }
    ]
  },
  letters: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'Q', 'S', 'T', 'W', 'X', 'Y', 'Z']
};

export default tradeList;
