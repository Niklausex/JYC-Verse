// JYC Verse — 全站内容数据层

export interface Realm {
  id: string
  no: string
  code: string
  name: string
  tagline: string
  desc: string
  color: string
  color2: string
  icon: string // font-awesome class
  count: number
  plays: string[]
  highlight?: string
  planetImg: string
  sceneImg: string
  orbit: 1 | 2 | 3
  angle: number
}

export const realms: Realm[] = [
  {
    id: 'predict', no: '01', code: 'PREDICT', name: '预测宇宙',
    tagline: '万物皆可预测,人人皆可开盘',
    desc: '在 QuantumPredict 的成熟基础上,扩展到加密秒级涨跌、电竞、娱乐八卦、天气、政治选举,并开放 UGC 自建市场——任何人都可以出题当庄,抽取分成。',
    color: '#38A8FF', color2: '#1F5BFF', icon: 'fa-chart-line', count: 18,
    plays: ['经典预测市场', 'Quick 极速市场', '加密 1 分钟涨跌', '加密 5 分钟涨跌', '世界杯专区', '电竞预测', '娱乐八卦预测', '天气预测', '政治选举', '科技发布预测', 'UGC 自建市场', '串关 Parlay', '跟单大神榜', '预测锦标赛', '预测积分赛季', '多结果市场', '区间市场', '预测保险'],
    highlight: 'UGC 自建市场:任何人都可以出题当庄',
    planetImg: '/static/img/planet-predict.webp', sceneImg: '/static/img/scene-predict.jpg', orbit: 1, angle: 0,
  },
  {
    id: 'arcade', no: '02', code: 'ARCADE', name: '极速游戏城',
    tagline: '极速游戏,秒级结算,可验证公平',
    desc: '20+ 经典加密原生游戏与赌场桌游,全部 Provably Fair,每一局随机数链上可查。这里是 JYC 换手频率最高、手续费最密集的星域。',
    color: '#FF4FA3', color2: '#FF2D6F', icon: 'fa-dice', count: 22,
    plays: ['Crash 火箭', 'Dice 骰子', 'Plinko 弹珠', 'Mines 扫雷', 'Limbo', 'Coinflip 硬币', 'Wheel 幸运轮盘', 'Keno', 'Hi-Lo', 'Tower 爬塔', '轮盘 Roulette', '百家乐', '21 点', '龙虎', '骰宝', '德州扑克(对庄)', '三公', '牛牛', '视频扑克', '捕鱼', '宾果', 'JYC 主题老虎机系列'],
    highlight: 'JYC 主题老虎机系列:星际 · 财神 · 世界杯 · 塔罗 · 赌城夜',
    planetImg: '/static/img/planet-arcade.webp', sceneImg: '/static/img/scene-arcade.jpg', orbit: 1, angle: 90,
  },
  {
    id: 'lottery', no: '03', code: 'LOTTERY', name: '彩票与奖池',
    tagline: '小投入,大梦想,链上开奖',
    desc: '从 5 分钟快开到周度累积大奖,用 BSC 区块哈希开奖,每一注都可验证。全生态 MEGA JACKPOT——所有星域每笔投注抽 0.5% 注入,任何游戏都可能触发,滚存大奖是 JYC Verse 最强的传播弹药。',
    color: '#F5C24B', color2: '#FF9F1C', icon: 'fa-ticket', count: 12,
    plays: ['5 分钟快开彩', '每日大乐透', '周度 Powerball 累积奖池', '刮刮乐(多主题)', '区块哈希彩票', 'Raffle 实物/NFT 抽奖', '幸运号码守护(包号)', '合买团', '时时彩', '竞彩足球', '数字 3D', 'MEGA JACKPOT 全生态大奖'],
    highlight: 'MEGA JACKPOT:全生态每笔投注抽 0.5% 注入,任何游戏都可能触发',
    planetImg: '/static/img/planet-lottery.webp', sceneImg: '/static/img/scene-lottery.jpg', orbit: 1, angle: 180,
  },
  {
    id: 'fortune', no: '04', code: 'FORTUNE', name: '玄学命运',
    tagline: '先看运势,再做决策',
    desc: '全球化本地玄学矩阵——中式八字、日式御神签、泰式佛牌、越南占卜、西方塔罗占星。AI 大师 24 小时在线。每一次运势,都能一键转化为幸运数字买彩票、幸运方向下注——玄学是导流全生态的入口。',
    color: '#9D5CFF', color2: '#6A2BFF', icon: 'fa-moon', count: 18,
    plays: ['每日运势', '塔罗牌', '星座占星盘', '生肖运程', '八字命书', '易经六爻', '关帝/观音灵签', '御神签', '泰式佛牌开光', 'AI 大师算命', 'AI 面相', 'AI 手相', '风水罗盘', '数字命理', '塔罗对赌', '命运挑战', '幸运数字一键投注', '运势海报分享'],
    highlight: '命运挑战:运势说你财旺,敢不敢下注验证?',
    planetImg: '/static/img/planet-fortune.webp', sceneImg: '/static/img/scene-fortune.jpg', orbit: 1, angle: 270,
  },
  {
    id: 'sports', no: '05', code: 'SPORTS', name: '体育电竞',
    tagline: '全球赛场,24 小时不停歇',
    desc: '五大联赛、NBA、UFC、F1 全覆盖,滚球实时投注;电竞覆盖 LoL、CS2、Dota2、王者荣耀、无畏契约;虚拟体育每 3 分钟一场,永不停歇。',
    color: '#2EE59D', color2: '#00B871', icon: 'fa-futbol', count: 14,
    plays: ['足球竞猜', '篮球', '网球', 'UFC / 拳击', 'F1', '滚球 Live', '电竞 5 大项', 'Fantasy 梦幻体育', '虚拟赛马', '虚拟足球', '虚拟赛狗', '赛马', '大赛专题(世界杯/奥运/欧冠)', '体育串关'],
    highlight: '虚拟体育:每 3 分钟一场,24 小时永不停歇',
    planetImg: '/static/img/planet-sports.webp', sceneImg: '/static/img/scene-sports.jpg', orbit: 2, angle: 30,
  },
  {
    id: 'arena', no: '06', code: 'ARENA', name: '竞技对战',
    tagline: '赢的不是庄家,是对面的人',
    desc: '玩家对玩家的真金对决——德州扑克、麻将、斗地主、棋类、知识竞答。平台只抽水,不当对手。战队、公会、赛季天梯,构建长期社区壁垒。',
    color: '#FF5A3C', color2: '#E0231A', icon: 'fa-khanda', count: 16,
    plays: ['1v1 预测对赌', '德州扑克(P2P)', '麻将(国标/日麻/广东)', '斗地主', '象棋', '围棋', '国际象棋', 'Ludo 飞行棋', 'UNO', 'Trivia 直播答题', '猜拳', '反应力挑战', '拼图速度赛', 'Sit&Go 锦标赛', '战队 / 公会赛', '赛季天梯与冠军池'],
    highlight: 'Trivia 直播答题:全场同答,赢者分池',
    planetImg: '/static/img/planet-arena.webp', sceneImg: '/static/img/scene-arena.jpg', orbit: 2, angle: 90,
  },
  {
    id: 'cards', no: '07', code: 'CARDS', name: '卡牌与收藏',
    tagline: '抽的是运气,攒的是资产',
    desc: '命运卡 NFT 五档稀有度(N / R / SR / SSR / UR),卡牌不仅能收藏、合成、交易,还能在全生态生效:SSR 卡 = 手续费折扣、彩票加倍、Crash 保险、分红加成。',
    color: '#E86BFF', color2: '#38E8FF', icon: 'fa-clone', count: 12,
    plays: ['抽卡', '盲盒', '命运卡 NFT', '卡牌合成 / 升星', '卡牌增益系统', '卡牌对战 TCG', '宠物养成', '坐骑', '限量藏品拍卖', '卡牌二级市场', '赛季限定卡', '名人 / IP 联名卡'],
    highlight: '卡牌增益:SSR = 手续费折扣 · 彩票加倍 · Crash 保险 · 分红加成',
    planetImg: '/static/img/planet-cards.webp', sceneImg: '/static/img/scene-cards.jpg', orbit: 2, angle: 150,
  },
  {
    id: 'live', no: '08', code: 'LIVE', name: '直播与社交',
    tagline: '每一场开奖,都是一场秀',
    desc: '真人荷官、直播开奖、主播开盘——主播自己开竞猜房,观众边看边投,主播分成。聊天室红包雨、跟单大神、好友对赌房,让赌局成为社交。',
    color: '#FF3D8A', color2: '#FFFFFF', icon: 'fa-tower-broadcast', count: 12,
    plays: ['真人荷官(百家乐 / 轮盘 / 龙虎)', '直播开奖', '主播竞猜房', '打赏即下注', '聊天室 Rain 红包雨', '跟单 Copy Bet', '好友对赌房', '战绩晒单', 'KOL 联盟', '社区投票', '排行榜直播', '语音房'],
    highlight: '主播竞猜房:主播开盘,观众下注,主播分成',
    planetImg: '/static/img/planet-live.webp', sceneImg: '/static/img/scene-live.jpg', orbit: 2, angle: 210,
  },
  {
    id: 'city', no: '09', code: 'JYC CITY', name: '元宇宙赌城',
    tagline: '在这里,你可以当庄家',
    desc: '一座由 12 星域组成的虚拟赌城。买地建店收租,购买赌桌牌照自己做庄——盈亏自负,庄家优势归你。Avatar、剧情任务、赛季活动,冠军雕像永久上链名人堂。',
    color: '#38E8FF', color2: '#F5C24B', icon: 'fa-city', count: 10,
    plays: ['虚拟赌城地图', '虚拟地产(买地 / 开店 / 收租)', '玩家做庄(赌桌牌照)', 'Avatar 与皮肤', '剧情任务线', '探索宝箱', '赌城赛季活动', '名人堂雕像', '城市治理投票', '品牌联名地块'],
    highlight: '玩家做庄:购买赌桌牌照,庄家优势归你',
    planetImg: '/static/img/planet-city.webp', sceneImg: '/static/img/scene-city.jpg', orbit: 2, angle: 270,
  },
  {
    id: 'earn', no: '10', code: 'EARN', name: '理财金库',
    tagline: '持币即分红,稳健收益',
    desc: '质押 JYC 分享全生态收入;存入 Bankroll 庄家池,成为 120+ 玩法背后的庄家;复活险(Buyback 机制升级)让每一次失败都有回血机会。',
    color: '#FFD166', color2: '#C88A00', icon: 'fa-vault', count: 10,
    plays: ['Staking 全生态分红', 'Bankroll 庄家池', 'LP 流动性挖矿', '复活险', '锁仓 NFT 加成', 'JYC 债券', '跟单基金', '回购销毁看板', 'VIP 返水', '收益自动复投'],
    highlight: 'Bankroll 庄家池:存入 JYC,成为 120+ 玩法背后的庄家',
    planetImg: '/static/img/planet-earn.webp', sceneImg: '/static/img/scene-earn.jpg', orbit: 2, angle: 330,
  },
  {
    id: 'ai', no: '11', code: 'AI', name: '智脑',
    tagline: '一个贯穿全宇宙的 AI 层',
    desc: 'AI 预测助手给概率、AI 算命师出命书、AI 荷官主持牌局、AI 对手陪练、AI 推荐"你今天该玩什么"、AI 自动生成市场、AI 风控反作弊。',
    color: '#7FD7FF', color2: '#2A7BFF', icon: 'fa-brain', count: 10,
    plays: ['AI 预测分析', 'AI 算命师', 'AI 荷官 / 主播', 'AI 对手', 'AI 个性化推荐', 'AI 赛事解说', 'AI 自动出题', 'AI 风控', 'AI 客服', 'AI 内容生成'],
    highlight: 'AI 推荐:"你今天该玩什么"',
    planetImg: '/static/img/planet-ai.webp', sceneImg: '/static/img/scene-ai.jpg', orbit: 3, angle: 60,
  },
  {
    id: 'open', no: '12', code: 'OPEN', name: '开放生态',
    tagline: '让 JYC 走出 JYC Verse',
    desc: 'JYC Pay 支付网关、开发者 SDK、白标输出、跨链桥、DAO 治理、生态基金——任何第三方游戏都可以接入 JYC 结算,任何商户都可以收 JYC。',
    color: '#E8F4FF', color2: '#38E8FF', icon: 'fa-circle-nodes', count: 10,
    plays: ['JYC Pay', '开发者 SDK', '白标 B2B', '跨链桥(BSC → Base / TON / Solana)', 'DAO 治理', '生态基金 Grants', '商户联盟(实物 / 礼品卡 / 旅游)', 'API 开放平台', '合作方游戏市场', '联盟营销网络'],
    highlight: 'JYC Pay:任何商户都可以收 JYC',
    planetImg: '/static/img/planet-open.webp', sceneImg: '/static/img/scene-open.jpg', orbit: 3, angle: 240,
  },
]

export const totalPlays = realms.reduce((s, r) => s + r.count, 0)

export const tickerStats = [
  { v: '$1.2 万亿', l: '全球博彩年流水' },
  { v: '$3,000 亿', l: '全球彩票市场' },
  { v: '$500 亿', l: '玄学与命理经济' },
  { v: '$180 亿', l: '加密娱乐市场 · 年增速 40%+' },
  { v: '6.8 亿', l: '全球活跃博彩人口' },
  { v: '$120 亿', l: '预测市场年交易量' },
]

export const personas = [
  { icon: 'fa-brain', name: '认知型', desc: '相信自己比市场更懂', realms: ['PREDICT', 'SPORTS'], color: '#38A8FF' },
  { icon: 'fa-bolt', name: '快感型', desc: '追求即时反馈与极速刺激', realms: ['ARCADE'], color: '#FF4FA3' },
  { icon: 'fa-clover', name: '幸运型', desc: '小投入,博一个大梦想', realms: ['LOTTERY'], color: '#F5C24B' },
  { icon: 'fa-moon', name: '玄学型', desc: '先看运势,再做决策', realms: ['FORTUNE'], color: '#9D5CFF' },
  { icon: 'fa-khanda', name: '竞技型', desc: '要赢的是对面的人', realms: ['ARENA', 'LIVE'], color: '#FF5A3C' },
  { icon: 'fa-clone', name: '收藏型', desc: '抽卡养成,攒的是资产', realms: ['CARDS', 'JYC CITY'], color: '#E86BFF' },
  { icon: 'fa-vault', name: '理财型', desc: '追求稳健收益与长期回报', realms: ['EARN'], color: '#FFD166' },
]

export const journey = [
  { t: '08:00', icon: 'fa-moon', text: '起床看今日运势', realm: 'FORTUNE' },
  { t: '08:05', icon: 'fa-ticket', text: '幸运数字一键买一注彩票', realm: 'LOTTERY' },
  { t: '12:30', icon: 'fa-dice', text: '午休 Crash 玩几局', realm: 'ARCADE' },
  { t: '20:00', icon: 'fa-futbol', text: '欧冠之夜下注', realm: 'SPORTS' },
  { t: '22:00', icon: 'fa-tower-broadcast', text: '进主播竞猜房跟单', realm: 'LIVE' },
  { t: '23:30', icon: 'fa-clone', text: '睡前抽一张命运卡', realm: 'CARDS' },
  { t: '24/7', icon: 'fa-vault', text: '全天收益自动进 Staking', realm: 'EARN' },
]

export const systems = [
  { icon: 'fa-id-card', name: '统一账户与钱包', desc: '一个身份,JYC 余额全生态通用' },
  { icon: 'fa-crown', name: 'VIP 1–100 级', desc: '所有玩法都涨经验,解锁返水、专属房间、空投' },
  { icon: 'fa-passport', name: '赛季通行证', desc: '每季新主题、新奖励、新限定' },
  { icon: 'fa-list-check', name: '全生态任务', desc: '每日 / 每周 / 赛季任务,引导跨星域体验' },
  { icon: 'fa-ranking-star', name: '全球排行榜与名人堂', desc: '各星域榜 + 综合榜,赛季冠军上链' },
  { icon: 'fa-people-group', name: '公会与战队', desc: '组队任务、公会战、公会分红' },
  { icon: 'fa-gem', name: 'MEGA JACKPOT', desc: '全生态共享大奖池,任何游戏都可能触发' },
  { icon: 'fa-share-nodes', name: '返水与多级裂变', desc: 'Rakeback + 多级推荐,全生态分成' },
  { icon: 'fa-bag-shopping', name: 'JYC 商城', desc: '皮肤、卡包、实物、礼品卡、旅游' },
]

export const utilities = [
  { icon: 'fa-coins', name: '筹码', desc: '120+ 玩法唯一结算货币' },
  { icon: 'fa-hand-holding-dollar', name: '分红凭证', desc: '质押分享全生态收入' },
  { icon: 'fa-crown', name: 'VIP 门票', desc: '持仓解锁等级与特权' },
  { icon: 'fa-clone', name: '资产', desc: '卡牌 / 地产 / 牌照计价' },
  { icon: 'fa-chess-king', name: '做庄资格', desc: 'Bankroll 与赌桌牌照' },
  { icon: 'fa-landmark', name: '治理权', desc: 'DAO 投票决定生态方向' },
  { icon: 'fa-credit-card', name: '支付货币', desc: 'JYC Pay 商户联盟' },
  { icon: 'fa-gift', name: '商城兑换', desc: '实物 / 礼品卡 / 旅游' },
]

export const roadmap = [
  {
    q: '2026 Q4', title: '奠基', color: '#F5C24B',
    items: ['JYC Verse 统一账户与钱包', 'Game Hub 生态大厅', 'ARCADE 首批 8 款:Crash / Dice / Plinko / Mines / 轮盘 / 百家乐 / 龙虎 / 老虎机', 'FORTUNE:每日运势 + 塔罗 + AI 算命', '全生态任务系统与 VIP 体系', 'Staking 升级为全生态收入分红'],
    realms: ['arcade', 'fortune', 'earn'],
  },
  {
    q: '2027 Q1', title: '扩张', color: '#38E8FF',
    items: ['LOTTERY 全线上线 + MEGA JACKPOT 启动', 'SPORTS 体育电竞 + 虚拟体育', 'CARDS 抽卡与命运卡 NFT', 'PREDICT 加密秒级市场 + UGC 自建市场', '公会与战队系统'],
    realms: ['lottery', 'sports', 'cards', 'predict'],
  },
  {
    q: '2027 Q2', title: '社交', color: '#FF4FA3',
    items: ['ARENA:德州 / 麻将 / 斗地主 / Trivia', 'LIVE:真人荷官 + 主播竞猜房', 'Bankroll 庄家池', '复活险全生态开放', '跨链桥 Base / TON'],
    realms: ['arena', 'live'],
  },
  {
    q: '2027 Q3', title: '宇宙', color: '#9D5CFF',
    items: ['JYC CITY 元宇宙赌城:地产 + 玩家做庄', 'AI 智脑全面接入 12 星域', 'JYC Pay + 开发者 SDK', 'DAO 治理上线', '第一届 JYC Verse 全球冠军赛'],
    realms: ['city', 'ai', 'open'],
  },
]

export const trust = [
  { icon: 'fa-shield-halved', name: 'Provably Fair 验证中心', desc: '每一局随机数 commit-reveal,玩家可自行验证' },
  { icon: 'fa-cube', name: '链上开奖', desc: '彩票与大奖使用 BSC 区块哈希开奖,不可篡改' },
  { icon: 'fa-link', name: '链上结算与分红', desc: '质押分红、回购销毁全部链上可查' },
  { icon: 'fa-earth-asia', name: '全球合规策略', desc: '分区运营 + KYC 分级 + 实时风控与反作弊' },
]

export const foundation = [
  { v: '$128M', l: 'TVL 总锁仓价值' },
  { v: '482K', l: '注册用户' },
  { v: '1,284', l: '活跃市场' },
  { v: '$96M', l: '累计派发' },
]
