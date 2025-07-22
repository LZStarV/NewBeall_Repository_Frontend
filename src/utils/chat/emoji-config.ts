// 表情包类型定义
export interface EmojiCategory {
  id: string;
  name: string;
  emojis: Record<string, string>;
}

// 表情资源路径配置
export const EMOJI_RESOURCE_CONFIG = {
  // 默认表情包路径
  DEFAULT: 'https://newbeall.com/static/js/plugins/emoji-jq/images/emoji/',
  // 预留其他表情包路径
} as const;

// 表情包配置
export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'default',
    name: 'QQ表情',
    emojis: {
      '1.png': '[Smile]',
      '2.png': '[Grimace]',
      '3.png': '[Drool]',
      '4.png': '[Scowl]',
      '5.png': '[CoolGuy]',
      '6.png': '[Sob]',
      '7.png': '[Shy]',
      '8.png': '[Silent]',
      '9.png': '[Sleep]',
      '10.png': '[脸红]',
      '11.png': '[拥抱]',
      '12.png': '[强]',
      '13.png': '[弱]',
      '14.png': '[好的]',
      '15.png': '[握手]',
      '16.png': '[吃瓜]',
      '17.png': '[奸笑]',
      '18.png': '[旺柴]',
      '19.png': '[捂脸]',
      '20.png': '[666]',
      '21.png': '[OK]',
      '22.png': '[破涕为笑]',
      '23.png': '[Joyful]',
      '24.png': '[Smug]',
      '25.png': '[Hungry]',
      '26.png': '[Drowsy]',
      '27.png': '[Panic]',
      '28.png': '[Sweat]',
      '29.png': '[Laugh]',
      '30.png': '[Commando]',
      '31.png': '[Determined]',
      '32.png': '[Scold]',
      '33.png': '[Shocked]',
      '34.png': '[Shhh]',
      '35.png': '[Dizzy]',
      '36.png': '[Tormented]',
      '37.png': '[Toasted]',
      '38.png': '[Skull]',
      '39.png': '[Hammer]',
      '40.png': '[再见]',
      '41.png': '[Speechless]',
      '42.png': '[NosePick]',
      '43.png': '[Clap]',
      '44.png': '[Shame]',
      '45.png': '[Trick]',
      '46.png': '[Bah！L]',
      '47.png': '[Bah！R]',
      '48.png': '[Yawn]',
      '49.png': '[Pooh-pooh]',
      '50.png': '[Shrunken]',
      '51.png': '[TearingUp]',
      '52.png': '[Sly]',
      '53.png': '[Kiss]',
      '54.png': '[Wrath]',
      '55.png': '[Whimper]',
      '56.png': '[Cleaver]',
      '57.png': '[Watermelon]',
      '58.png': '[Beer]',
      '59.png': '[Basketball]',
      '60.png': '[PingPong]',
      '61.png': '[Coffee]',
      '62.png': '[Rice]',
      '63.png': '[Pig]',
      '64.png': '[Rose]',
      '65.png': '[Wilt]',
      '66.png': '[Lips]',
      '67.png': '[Heart]',
      '68.png': '[BrokenHeart]',
      '69.png': '[Cake]',
      '70.png': '[Cry]',
      '71.png': '[Awkward]',
      '72.png': '[Angry]',
      '73.png': '[Tongue]',
      '74.png': '[Grin]',
      '75.png': '[Surprise]',
      '76.png': '[Frown]',
      '77.png': '[Ruthless]',
      '78.png': '[Blush]',
      '79.png': '[Scream]',
      '80.png': '[Puke]',
      '81.png': '[Chuckle]',
      '82.png': '[Joyful]',
      '83.png': '[Slight]',
    },
  },
  // 预留其他表情包的位置
  // {
  //   id: 'animal',
  //   name: '动物表情',
  //   emojis: { ... }
  // }
];

// 创建反向映射：从表情代码到文件名
const emojiCodeToFile = new Map<
  string,
  { categoryId: string; fileName: string }
>();

// 初始化映射
EMOJI_CATEGORIES.forEach((category) => {
  Object.entries(category.emojis).forEach(([fileName, code]) => {
    emojiCodeToFile.set(code, { categoryId: category.id, fileName });
  });
});

// 匹配表情代码的正则表达式
const emojiRegex = /\[(.*?)\]/g;

// 获取表情文件名和分类
export function getEmojiInfo(code: string) {
  return emojiCodeToFile.get(code);
}

// 检查文本是否包含表情
export function hasEmoji(text: string): boolean {
  return emojiRegex.test(text);
}

// 导出正则表达式供组件使用
export { emojiRegex };

