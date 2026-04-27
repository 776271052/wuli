import { getDb } from './index';
import { aiModels, roleConfigs, dataSources, systemConfigs } from './schema';

export async function seedDatabase(d1Binding: D1Database) {
  const db = getDb(d1Binding);

  // 检查是否已安装
  const installed = await db.select({ value: systemConfigs.value })
    .from(systemConfigs)
    .where(eq(systemConfigs.key, 'installed'))
    .get();

  if (installed?.value === '1') {
    return { success: false, message: 'Already installed' };
  }

  // 插入AI模型
  await db.insert(aiModels).values([
    {
      provider: 'DeepSeek',
      modelName: 'deepseek-chat',
      apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
      apiKey: '',
      isActive: true,
      inputPrice: '1',
      outputPrice: '2',
      priceCurrency: 'CNY',
    },
    {
      provider: 'OpenAI兼容',
      modelName: 'gpt-3.5-turbo',
      apiEndpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: '',
      isActive: false,
      inputPrice: '1.5',
      outputPrice: '6',
      priceCurrency: 'CNY',
    },
    {
      provider: '智谱AI',
      modelName: 'glm-4',
      apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      apiKey: '',
      isActive: false,
      inputPrice: '0.1',
      outputPrice: '0.1',
      priceCurrency: 'CNY',
    },
  ]);

  // 插入角色配置
  const roles = [
    ['锐思', 9, '激进未来主义者,用极端预测冲击读者'],
    ['若水', 3, '温和但有原则,可尖锐反驳他人'],
    ['千策', 6, '商业视角,有进攻性质疑'],
    ['知微', 4, '数据驱动,用冰冷事实反击'],
    ['墨言', 5, '引用法规政策进行反驳'],
    ['逍遥', 7, '浪漫主义激进,富有感染力'],
    ['瓜田', 8, '毒舌娱记,讽刺且犀利'],
    ['浪潮', 5, '社会评论尖锐但克制'],
    ['极光', 7, '潮流判官,审美严苛'],
    ['星火', 6, '直戳粉丝心理痛点'],
    ['股道', 6, '技术面神棍,自信预测'],
    ['商略', 4, '基本面保守,严厉质疑'],
    ['风向', 5, '宏观视角,带点阴谋论风格'],
    ['明烛', 7, '行为金融反指,果断强烈'],
  ];

  for (const [roleName, aggression, tone] of roles) {
    await db.insert(roleConfigs).values({
      roleName,
      aggressionLevel: aggression as number,
      toneDescription: tone as string,
      enabled: true,
    });
  }

  // 插入数据源
  await db.insert(dataSources).values([
    { category: 'technology', provider: 'TianAPI', apiEndpoint: 'https://apis.tianapi.com/allnews/index', apiKey: '', isActive: true, priority: 1 },
    { category: 'entertainment', provider: 'TianAPI', apiEndpoint: 'https://apis.tianapi.com/allnews/index', apiKey: '', isActive: true, priority: 1 },
    { category: 'finance', provider: 'TianAPI', apiEndpoint: 'https://apis.tianapi.com/caijing/index', apiKey: '', isActive: false, priority: 1 },
    { category: 'finance', provider: 'TencentFinance', apiEndpoint: 'http://qt.gtimg.cn/q=sh600036,sz000001', apiKey: '', isActive: true, priority: 2 },
    { category: 'finance', provider: 'Chinadata', apiEndpoint: 'https://chinadata.live/api/v2/data/PMI', apiKey: '', isActive: true, priority: 3 },
    { category: 'finance', provider: 'Zhitu', apiEndpoint: 'https://api.zhituapi.com/hs/real/ssjy/000001', apiKey: '', isActive: false, priority: 4 },
    { category: 'finance', provider: 'Mairui', apiEndpoint: 'https://api.mairuiapi.com/hsstock/real/time/000001', apiKey: '', isActive: false, priority: 5 },
  ]);

  // 插入系统配置
  await db.insert(systemConfigs).values([
    { key: 'installed', value: '0' },
    { key: 'SITE_NAME', value: '呜哩网络' },
    { key: 'evolution_constraints', value: '保持明亮浅色风格和蓝色调和主题' },
  ]);

  return { success: true, message: 'Seed data inserted' };
}
