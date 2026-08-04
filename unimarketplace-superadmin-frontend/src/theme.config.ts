import type { ThemeConfig } from 'antd/es/config-provider/context';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#EEF0FE75',
    colorBgBase: '#EEF0FE75',
    borderRadius: 8,
    fontSize: 16,
    colorText: '#041B4B',
  },
  components: {
    Button: {
      borderRadius: 12,
      colorPrimary: '#1B56CC',
      colorPrimaryActive: '#042a75ff',
      colorPrimaryHover: '#042a75ff',
    },
    Typography: {
      fontSize: 18,
    },
    Layout: {
      lightSiderBg: '#EEF0FE75',
      siderBg: '#EEF0FE75',
      triggerBg: '#ffff',
      margin: 0,
    },
    Card: {
      colorBgContainer: '#FFFFFF',
    },
    Table: {
      colorBgContainer: '#FFFFFF',
      borderColor: 'transparent',
      headerBg: 'transparent',
      headerColor: '#98A2B3',
      headerSplitColor: 'transparent',
      rowHoverBg: 'transparent',
      cellPaddingBlock: 16,
    },
    Menu: {
      itemBg: '#EEF0FE',
      darkItemBg: '#EEF0FE',
      itemSelectedBg: '#FFFFFF',
      darkItemSelectedBg: '#FFFFFF',
      darkItemColor: '#041B4B',
      darkItemSelectedColor: '#041B4B',
      itemColor: '#041B4B',
      itemPaddingInline: 0,
      itemMarginBlock: 0,
      itemMarginInline: 0,
      itemHoverColor: '#041B4B',
      darkItemHoverColor: '#041B4B',
      fontSize: 18,
      itemHeight: 48,
    },
  },
};
