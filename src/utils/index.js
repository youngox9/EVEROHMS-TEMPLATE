import axios from '@/axios';
import { useStore } from 'vuex';
import axiosGlobal from 'axios';
import FileSaver from 'file-saver';
import { ElNotification as Notification } from 'element-plus';

import { computed, ref } from 'vue';
import router from '@/router';
import moment from 'moment';
import i18n from '@/i18n';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';
import { IS_DEV, URL_CONFIG, NOTIFICATION_MAX_COUNT } from '@/config';

const { t = (v) => v } = i18n?.global || {};

const CancelToken = axiosGlobal.CancelToken;

export function getDateFormat(val, format = 'YYYY-MM-DD') {
  return val ? moment(val).format(format) : '';
}

export const VALIDATIONS = {
  isEmpty: (p) => ({
    required: true,
    message: '此欄位為必填',
    trigger: ['blur'],
    ...p,
  }),
  orIsEmptry: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const { validator, form, keys = [] } = props;
      const isPass = keys.some((k) => {
        return !!form?.value?.[k];
      });
      if (!isPass) {
        const errorText = keys.map((o) => t(o)).join(',');
        callback(new Error(`${errorText} 至少填一個`));
      } else {
        callback();
      }
    },
    trigger: ['blur'],
  }),
  checkMachine: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const { validator } = props;
      const result = await validator(value);
      if (!value) {
        callback();
        return;
      }
      if (!result) {
        callback(new Error('機台輸入錯誤'));
      } else {
        callback();
      }
    },
    trigger: ['blur'],
  }),
  SFFB017_1: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const form = props.form();
      if (value > form.SFFB017) {
        callback(new Error('良品數量 不可大於 待處理量'));
      } else {
        callback();
      }
      return;
    },
    trigger: ['blur'],
  }),
  custom: (fn, trigger = ['blur']) => ({
    validator: async (rule, value, callback) => {
      await fn(rule, value, callback);
      return;
    },
    trigger,
  }),
  checkNumber: (props = {}) => ({
    validator: async (rule, value, callback) => {
      const regex = /^-?\d*\.{0,1}\d+$/;
      const res = regex.test(value);

      if (res) {
        callback();
      } else {
        callback(new Error('輸入格式錯誤'));
      }
    },
    trigger: ['blur', 'change'],
  }),
  dateRange: (props = {}) => ({
    required: true,
    validator: async (rule, value, callback) => {
      const res = value?.[0] && value?.[1];
      if (res) {
        callback();
      } else {
        callback(new Error('日期區間錯誤'));
      }
    },
    trigger: ['blur', 'change'],
  }),
  dateIsBefore: (props = {}) => ({
    required: true,
    validator: async (rule, value, callback) => {
      const form = props.form();
      let date1 = moment(value);
      let date2 = moment(form?.[props.key]);
      const res = date2.isBefore(date1);
      if (res) {
        callback();
      } else {
        callback(new Error('開始日期須小於結束日期'));
      }
    },
    trigger: ['blur', 'change'],
  }),
  dateIsAfter: (props = {}) => ({
    required: true,
    validator: async (rule, value, callback) => {
      const form = props.form();
      let date1 = moment(value);
      let date2 = moment(form?.[props.key]);
      const res = date2.isAfter(date1);
      if (res) {
        callback();
      } else {
        callback(new Error('結束日期須大於開始日期'));
      }
    },
    trigger: ['blur', 'change'],
  }),
};

export function sumNumbers(numbers = []) {
  const maxDecimalPlaces = Math.max(
    ...numbers.map((num) => {
      const [, decimalPart] = String(num).split('.');
      return decimalPart ? decimalPart.length : 0;
    })
  );
  const paddedNumbers = numbers.map((num) => {
    const [integerPart, decimalPart = ''] = String(num).split('.');
    const paddedDecimalPart = decimalPart.padEnd(maxDecimalPlaces, '0');
    return `${integerPart}.${paddedDecimalPart}`;
  });

  const sum = paddedNumbers.reduce((acc, cur) => {
    return add(acc, cur);
  }, 0);

  function add(num1, num2) {
    const [int1, dec1] = String(num1).split('.');
    const [int2, dec2] = String(num2).split('.');
    const carry = 10 ** maxDecimalPlaces;
    const intSum = Number(int1) + Number(int2);
    const decSum = (Number(dec1) || 0) + (Number(dec2) || 0);
    const totalSum = intSum * carry + decSum;
    return (totalSum / carry).toFixed(maxDecimalPlaces);
  }

  return sum;
}

export const getSummaries = (param) => {
  const {
    columns,
    data,
    totalText = 'Total Cost',
    onlyShowKeys = null,
  } = param;

  const result = columns.map((col, idx) => {
    if (idx === 0) return totalText;

    const key = columns?.[idx]?.property || '';

    const isOnlyShowKey = onlyShowKeys
      ? onlyShowKeys.length >= 0 && onlyShowKeys.includes(key)
      : true;

    const needShowTotal =
      isOnlyShowKey &&
      !data.some((o) => {
        const v = o?.[key];
        const res = v && !/^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(v);
        return res;
      });

    console.log(key, isOnlyShowKey);

    if (!needShowTotal) return '-';
    if (key) {
      const numbers = data?.map((curr) => {
        const colValue = parseFloat(curr?.[key] || 0);
        return colValue;
      });
      const sum = sumNumbers(numbers);
      return sum;
    }
  });

  return result;
};

export function useState(initialState) {
  const state = ref(initialState);
  const setState = (newState) => {
    state.value = newState;
  };

  return [state, setState];
}

export const AREA_OPTIONS = [
  { label: '20', value: '20' },
  { label: '30', value: '30' },
];

export function axiosWithCancel(config = {}) {
  let cancel;
  const cancelToken = new CancelToken(function executor(c) {
    cancel = c;
  });
  return [
    () =>
      axios({
        ...config,
        cancelToken,
      }),
    cancel,
  ];
}

export function axiosExcel(config = {}) {
  return axiosWithCancel({
    ...config,
    responseType: 'blob',
    headers: {
      Accept: 'application/vnd.openxmlformats;charset=utf-8',
      'Access-Control-Expose-Headers': 'Content-Disposition',
      // "Content-Type": "application/json",
    },
    timeout: 9999999,
  });
}

export function saveExcel(res, filename = getTempFilename()) {
  let newFilename = filename;
  const disposition = res?.headers?.['content-disposition'];

  if (disposition) {
    const regex = /attachment; filename=(.*)/;
    const match = disposition.match(regex);
    const headerFileName = match ? match[1] : '';
    if (headerFileName) {
      newFilename = headerFileName;
    }
  }
  if (res?.data) {
    FileSaver.saveAs(new Blob([res.data]), newFilename);
  }
}

export async function axiosSaveExcel(config) {
  const [func] = axiosExcel({ ...config });
  const res = await func();
  saveExcel(res);
}

/**
 * 報工作業/搜尋BAR的下拉選單列表
 */
export const SEARCHBAR_AUTOCOMPLETE_LIST = [
  { value: 'K-CEAK-2208040002', link: '4 Plating/D200' },
  { value: 'K-ACRA-2208020001', link: '4 Plating/1490' },
  { value: 'K-ACRA-2207210001', link: '4 Plating/1500' },
  { value: 'K-ACRA-2207140001', link: '4 Plating/1600' },
  { value: 'K-ACRB-2207270002', link: '5 PACKAGE' },
  { value: 'K-CMAG-2206020002', link: '5M PACKAGE' },
];

/**
 *
 * @returns get default xlsx filename
 */
export function getTempFilename() {
  // console.log(router?.currentRoute?.value?.path);
  const pathname = router?.currentRoute?.value?.path || '';
  try {
    return `${pathname.replace(/[^a-zA-Z0-9 ]/g, '') || 'test'}_${moment(
      new Date()
    ).format('YYYYMMDDHHmmss')}.xlsx`;
  } catch (e) {
    return 'test.xlsx';
  }
}

/**
 * check string is Numeric
 * @param {} str
 * @returns
 */
function isNumeric(str) {
  // 使用正則表達式來判斷字串是否為數字
  // 正整數或負整數或正浮點數或負浮點數
  const numericRegex = /^[-+]?\d+(\.\d+)?$/;
  return numericRegex.test(str);
}
/**
 * pure front export excel
 */
export const jsonToExcel = (list, filename = getTempFilename()) => {
  const WHITE_LIST = ['IMAA128', '型別', '捲標', '盒標', '箱標'];
  const STRING_LIST = [
    'REEL_ID',
    'SFBA020',
    'DELIVERY_DATE',
    'START_DATE',
    'IMAA003',
    'VENDOR',
    'POLIST',
    'PRODUCECYCLE',
  ];
  const $t = i18n.global.t;
  if (!list?.length) return;

  const temp = list.map((obj) => {
    const newObj = Object.keys(obj).reduce((prev, k) => {
      // Check if the key is in the STRING_LIST, if so, force it to be a string
      if (STRING_LIST.includes(k)) {
        return { ...prev, [$t(k)]: `${obj[k]}` };
      }
      // If the key is not in the WHITE_LIST, and the value is numeric, parse it as a number
      const isNum = isNumeric(obj[k]) && !WHITE_LIST.includes(k);
      const val = isNum ? +obj[k] : obj[k];
      return { ...prev, [$t(k)]: val };
    }, {});
    return newObj;
  });

  const cols = Object.keys(temp?.[0]);
  var ws = XLSX.utils.json_to_sheet(temp, {
    header: [...cols],
  });
  const wb = XLSX.utils.book_new();

  // 自動調整欄位寬度
  ws['!cols'] = cols.map((col) => {
    const maxCharLength = Math.max(
      ...temp.map((obj) => `${obj[col]}`.length),
      col.length
    );
    return { width: maxCharLength + 5 };
  });

  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } },
  };

  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);

      if (!ws[cell_ref]) ws[cell_ref] = { t: 's', v: '' };
      if (!ws[cell_ref].s) ws[cell_ref].s = {};
      ws[cell_ref].s.border = borderStyle;
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSXStyle.writeFile(wb, filename, { compression: true });
};
export const printPage = (name = '') => {
  if (window?.close) {
    const pathname = router?.currentRoute?.value?.path || '';
    const time = moment(new Date()).format('YYYYMMDDHHmmss');
    const filename = name || `${pathname}_${time}`;
    document.title = filename;
    window.print();
    window.close();
  }
};

export const useTools = () => {
  const store = useStore();
  const isAdmin = computed(() => {
    const role_id = store?.state?.global?.profile?.role_id;
    return role_id === 1 || role_id === 22;
  });
  return { isAdmin };
};

let list = [];

/**
 * custom ElNotification only show max count
 * @param {} opt
 * @returns
 */
export const ElNotification = (opt = {}, max = NOTIFICATION_MAX_COUNT) => {
  const ElNotificationObj = Notification({
    ...opt,
  });
  if (list.length >= max) {
    list?.[0].close();
    list = list.slice(1);
  }
  list.push(ElNotificationObj);
  return ElNotificationObj;
};

export function useDynamicColumns(list, columnsSetting = {}) {
  const columns = computed(() => {
    try {
      return Object.keys(list?.value?.[0] || {}) || [];
    } catch (e) {
      return [];
    }
  });
  return { columns };
}

/**
 * 印出當前環境名稱
 */
export const logEnv = () => {
  console.log(
    `%c→ 目前環境: [${IS_DEV ? '測試站' : '正式站'}]`,
    'background-color: #003a74; color: white; padding: 0 6px; font-size: 18px; font-weight: bolder;',
    URL_CONFIG
  );
};

export function disableBeforeToday(val) {
  let result = true;
  const targetDate = moment(val);
  const today = moment();
  const formattedToday = today.format('YYYY-MM-DD');
  const formattedTargetDate = targetDate.format('YYYY-MM-DD');
  if (formattedTargetDate < formattedToday) {
    result = true;
  } else {
    result = false;
  }
  return result;
}

export function getMonth() {
  return moment(new Date()).subtract(90, 'days').format('YYYY-MM-DD');
}

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
