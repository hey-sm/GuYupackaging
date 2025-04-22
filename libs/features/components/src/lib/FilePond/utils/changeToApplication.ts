export const applications = [
  {
    verifyName: '.doc',
    name: 'application/msword',
  },
  {
    verifyName: '.docx',
    name: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    verifyName: '.pdf',
    name: 'application/pdf',
  },
  {
    verifyName: '.xlsx',
    name: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  {
    verifyName: '.ppt',
    name: 'application/vnd.ms-powerpoint',
  },
  {
    verifyName: '.xls',
    name: 'application/vnd.ms-excel',
  },
  {
    verifyName: '.pptx',
    name: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
  {
    verifyName: '.txt',
    name: 'text/plain',
  },
];

export const changeToApplication = (fileType: string) =>
  applications.filter((item) => item.verifyName === fileType)[0]?.name;
