export const parseServerResources = (
  items: Array<{ fileId?: string; fileUrl?: string } | undefined> = []
) => {
  return items
    .filter(Boolean)
    .map((v: any) => ({
      uid: v.fileId,
      url: v.fileUrl,
      response: { resourceId: v.fileId, resourceUrl: v.fileUrl },
    }));
};
