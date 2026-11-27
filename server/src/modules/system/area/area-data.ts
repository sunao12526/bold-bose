export interface AreaNode {
  id: number;
  name: string;
  children?: AreaNode[];
}

export const CHINA_AREA_TREE: AreaNode[] = [
  {
    id: 110000,
    name: '北京市',
    children: [
      { id: 110101, name: '东城区' },
      { id: 110102, name: '西城区' },
      { id: 110105, name: '朝阳区' },
      { id: 110106, name: '丰台区' },
      { id: 110107, name: '石景山区' },
      { id: 110108, name: '海淀区' },
      { id: 110112, name: '通州区' },
      { id: 110113, name: '顺义区' },
      { id: 110114, name: '昌平区' },
      { id: 110115, name: '大兴区' },
    ],
  },
  {
    id: 120000,
    name: '天津市',
    children: [
      { id: 120101, name: '和平区' },
      { id: 120102, name: '河东区' },
      { id: 120103, name: '河西区' },
      { id: 120104, name: '南开区' },
      { id: 120116, name: '滨海新区' },
    ],
  },
  {
    id: 130000,
    name: '河北省',
    children: [
      { id: 130100, name: '石家庄市' },
      { id: 130200, name: '唐山市' },
      { id: 130300, name: '秦皇岛市' },
      { id: 130400, name: '邯郸市' },
      { id: 130600, name: '保定市' },
      { id: 131000, name: '廊坊市' },
    ],
  },
  {
    id: 140000,
    name: '山西省',
    children: [
      { id: 140100, name: '太原市' },
      { id: 140200, name: '大同市' },
      { id: 140400, name: '长治市' },
    ],
  },
  {
    id: 150000,
    name: '内蒙古自治区',
    children: [
      { id: 150100, name: '呼和浩特市' },
      { id: 150200, name: '包头市' },
      { id: 150600, name: '鄂尔多斯市' },
    ],
  },
  {
    id: 210000,
    name: '辽宁省',
    children: [
      { id: 210100, name: '沈阳市' },
      { id: 210200, name: '大连市' },
      { id: 210300, name: '鞍山市' },
    ],
  },
  {
    id: 220000,
    name: '吉林省',
    children: [
      { id: 220100, name: '长春市' },
      { id: 220200, name: '吉林市' },
    ],
  },
  {
    id: 230000,
    name: '黑龙江省',
    children: [
      { id: 230100, name: '哈尔滨市' },
      { id: 230200, name: '齐齐哈尔市' },
      { id: 230600, name: '大庆市' },
    ],
  },
  {
    id: 310000,
    name: '上海市',
    children: [
      { id: 310101, name: '黄浦区' },
      { id: 310104, name: '徐汇区' },
      { id: 310105, name: '长宁区' },
      { id: 310106, name: '静安区' },
      { id: 310107, name: '普陀区' },
      { id: 310110, name: '杨浦区' },
      { id: 310112, name: '闵行区' },
      { id: 310115, name: '浦东新区' },
    ],
  },
  {
    id: 320000,
    name: '江苏省',
    children: [
      { id: 320100, name: '南京市' },
      { id: 320200, name: '无锡市' },
      { id: 320300, name: '徐州市' },
      { id: 320400, name: '常州市' },
      { id: 320500, name: '苏州市' },
      { id: 320600, name: '南通市' },
    ],
  },
  {
    id: 330000,
    name: '浙江省',
    children: [
      { id: 330100, name: '杭州市' },
      { id: 330200, name: '宁波市' },
      { id: 330300, name: '温州市' },
      { id: 330400, name: '嘉兴市' },
      { id: 330600, name: '绍兴市' },
      { id: 330700, name: '金华市' },
    ],
  },
  {
    id: 340000,
    name: '安徽省',
    children: [
      { id: 340100, name: '合肥市' },
      { id: 340200, name: '芜湖市' },
      { id: 340300, name: '蚌埠市' },
    ],
  },
  {
    id: 350000,
    name: '福建省',
    children: [
      { id: 350100, name: '福州市' },
      { id: 350200, name: '厦门市' },
      { id: 350500, name: '泉州市' },
    ],
  },
  {
    id: 360000,
    name: '江西省',
    children: [
      { id: 360100, name: '南昌市' },
      { id: 360400, name: '九江市' },
      { id: 360700, name: '赣州市' },
    ],
  },
  {
    id: 370000,
    name: '山东省',
    children: [
      { id: 370100, name: '济南市' },
      { id: 370200, name: '青岛市' },
      { id: 370600, name: '烟台市' },
      { id: 370700, name: '潍坊市' },
    ],
  },
  {
    id: 410000,
    name: '河南省',
    children: [
      { id: 410100, name: '郑州市' },
      { id: 410200, name: '开封市' },
      { id: 410300, name: '洛阳市' },
    ],
  },
  {
    id: 420000,
    name: '湖北省',
    children: [
      { id: 420100, name: '武汉市' },
      { id: 420500, name: '宜昌市' },
      { id: 420600, name: '襄阳市' },
    ],
  },
  {
    id: 430000,
    name: '湖南省',
    children: [
      { id: 430100, name: '长沙市' },
      { id: 430200, name: '株洲市' },
      { id: 430300, name: '湘潭市' },
    ],
  },
  {
    id: 440000,
    name: '广东省',
    children: [
      { id: 440100, name: '广州市' },
      { id: 440300, name: '深圳市' },
      { id: 440400, name: '珠海市' },
      { id: 440600, name: '佛山市' },
      { id: 441300, name: '惠州市' },
      { id: 441900, name: '东莞市' },
      { id: 442000, name: '中山市' },
    ],
  },
  {
    id: 450000,
    name: '广西壮族自治区',
    children: [
      { id: 450100, name: '南宁市' },
      { id: 450200, name: '柳州市' },
      { id: 450300, name: '桂林市' },
    ],
  },
  {
    id: 460000,
    name: '海南省',
    children: [
      { id: 460100, name: '海口市' },
      { id: 460200, name: '三亚市' },
    ],
  },
  {
    id: 500000,
    name: '重庆市',
    children: [
      { id: 500103, name: '渝中区' },
      { id: 500105, name: '江北区' },
      { id: 500108, name: '南岸区' },
      { id: 500112, name: '渝北区' },
    ],
  },
  {
    id: 510000,
    name: '四川省',
    children: [
      { id: 510100, name: '成都市' },
      { id: 510700, name: '绵阳市' },
      { id: 511500, name: '宜宾市' },
    ],
  },
  {
    id: 520000,
    name: '贵州省',
    children: [
      { id: 520100, name: '贵阳市' },
      { id: 520300, name: '遵义市' },
    ],
  },
  {
    id: 530000,
    name: '云南省',
    children: [
      { id: 530100, name: '昆明市' },
      { id: 530300, name: '曲靖市' },
      { id: 532900, name: '大理白族自治州' },
    ],
  },
  {
    id: 540000,
    name: '西藏自治区',
    children: [
      { id: 540100, name: '拉萨市' },
      { id: 540200, name: '日喀则市' },
    ],
  },
  {
    id: 610000,
    name: '陕西省',
    children: [
      { id: 610100, name: '西安市' },
      { id: 610300, name: '宝鸡市' },
      { id: 610400, name: '咸阳市' },
    ],
  },
  {
    id: 620000,
    name: '甘肃省',
    children: [
      { id: 620100, name: '兰州市' },
      { id: 620400, name: '白银市' },
    ],
  },
  {
    id: 630000,
    name: '青海省',
    children: [
      { id: 630100, name: '西宁市' },
      { id: 630200, name: '海东市' },
    ],
  },
  {
    id: 640000,
    name: '宁夏回族自治区',
    children: [
      { id: 640100, name: '银川市' },
      { id: 640200, name: '石嘴山市' },
    ],
  },
  {
    id: 650000,
    name: '新疆维吾尔自治区',
    children: [
      { id: 650100, name: '乌鲁木齐市' },
      { id: 650200, name: '克拉玛依市' },
    ],
  },
  {
    id: 710000,
    name: '台湾省',
    children: [
      { id: 710100, name: '台北市' },
      { id: 710200, name: '高雄市' },
    ],
  },
  {
    id: 810000,
    name: '香港特别行政区',
    children: [
      { id: 810100, name: '香港岛' },
      { id: 810200, name: '九龙' },
      { id: 810300, name: '新界' },
    ],
  },
  {
    id: 820000,
    name: '澳门特别行政区',
    children: [
      { id: 820100, name: '澳门半岛' },
      { id: 820200, name: '离岛' },
    ],
  },
];
