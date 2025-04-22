import React, { useMemo } from 'react';
import Doc from './images/fileIcons/doc.png';
import Pdf from './images/fileIcons/pdf.png';
import Ppt from './images/fileIcons/ppt.png';
import Unknown from './images/fileIcons/unknown.svg';
import Xls from './images/fileIcons/xls.png';

interface IProps {
  suffix?: string;
  className?: string;
}
export const FileIcon = ({ suffix, className }: IProps): React.ReactElement => {
  const url = useMemo(() => {
    if (suffix?.toLowerCase() === 'doc' || suffix?.toLowerCase() === 'docx') {
      return Doc;
    } else if (suffix?.toLowerCase() === 'pdf') {
      return Pdf;
    } else if (
      suffix?.toLowerCase() === 'ppt' ||
      suffix?.toLowerCase() === 'pptx'
    ) {
      return Ppt;
    } else if (
      suffix?.toLowerCase() === 'xls' ||
      suffix?.toLowerCase() === 'xlsx'
    ) {
      return Xls;
    } else {
      return Unknown;
    }
  }, [suffix]);
  return (
    <div>
      <img className={className} src={url} alt="" />
    </div>
  );
};

export default FileIcon;
