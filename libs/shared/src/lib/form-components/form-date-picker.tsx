import { DatePicker, DatePickerProps as AntDatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
import React from 'react';

declare type DatePickerProps = Omit<
  Omit<Omit<AntDatePickerProps, 'value'>, 'picker'>,
  'onChange'
>;

interface DatePickerExtProps extends DatePickerProps {
  picker?: 'date' | 'week' | 'month' | 'year';
  showTime?: boolean;
  format?: string;
  value?: string;
  onChange?: (v: string) => void;
  showToday?: boolean;
}

/** 封装Ant DatePicker */
export const DatePickerExt: React.FC<DatePickerExtProps> = ({
  value,
  onChange,
  picker,
  style = {},
  showTime = false,
  format = 'YYYY-MM-DD',
  ...props
}) => {
  const fmt = showTime ? 'YYYY-MM-DD HH:mm:ss' : format;
  const momentValue = React.useMemo(
    () => (value ? moment(value, fmt) : null),
    [fmt, value]
  );
  return (
    <DatePicker
      {...props}
      picker={picker}
      format={(v) => moment(v).format(fmt)}
      value={momentValue}
      onChange={(_e, v) => onChange && onChange(v)}
      showTime={showTime}
      style={{ width: '100%', ...style }}
    />
  );
};

declare type ValueType = [string | moment.Moment, string | moment.Moment];
declare type DateValues = [moment.Moment | null, moment.Moment | null];
declare type DateRangePickerProps = Omit<
  Omit<Omit<RangePickerProps, 'value'>, 'onChange'>,
  'placeholder'
>;

interface DateRangePickerExtProps extends DateRangePickerProps {
  showTime?: boolean;
  value?: ValueType;
  placeholder?: string;
  onChange?: (v: [string, string]) => void;
  format?: string;
}

/** 封装Ant 日期范围 */
export const DateRangePickerExt: React.FC<DateRangePickerExtProps> = ({
  value = [null, null],
  picker = 'date',
  onChange,
  style,
  showTime = false,
  format = 'YYYY-MM-DD',
  placeholder,
  ...props
}) => {
  const fmt = showTime ? 'YYYY-MM-DD HH:mm:ss' : format;

  React.useEffect(() => {
    const [s = null, e = null] = value;
    const sr = s && typeof s !== 'string' ? s.format(fmt) : '';
    const er = e && typeof e !== 'string' ? e.format(fmt) : '';
    if (onChange) onChange([sr, er]);
  }, [fmt, onChange, value]);

  const handleChange = React.useCallback(
    ([s, e]: DateValues) => {
      const sr = s ? s.format(fmt) : '';
      const er = e ? e.format(fmt) : '';
      if (onChange) onChange([sr, er]);
    },
    [fmt, onChange]
  );

  const momentValue = React.useMemo(
    () =>
      value && value instanceof Array && (value as any).every((v: any) => !!v)
        ? (value.map((v) => moment(v)) as DateValues)
        : null,
    [value]
  );
  const placeholders = React.useMemo<[string, string]>(
    () => [`开始${placeholder}`, `结束${placeholder}`],
    [placeholder]
  );

  return (
    <DatePicker.RangePicker
      {...props}
      picker={picker}
      placeholder={placeholders}
      value={momentValue}
      onChange={(e) => handleChange(e || [null, null])}
      showTime={showTime}
      style={{ width: '100%', ...style }}
    />
  );
};
