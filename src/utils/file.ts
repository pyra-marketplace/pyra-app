import { MirrorFile, StructuredFolderRecord } from "@meteor-web3/connector";

export const adaptResourceContent = (content: string) => {
  let resource = {
    url: content,
    type: "image/png",
  };
  try {
    const json = JSON.parse(content);
    if ("url" in json && "type" in json) {
      resource = json;
      resource.type = resource.type || "unknown/unknown";
    } else {
      console.warn("Invalid resource content", content);
    }
  } catch (e) {
    /* empty */
  }
  return resource;
};

export const adaptMirrorFile = (file: MirrorFile) => {
  return {
    ...file,
    content: {
      ...file.content,
      resources: file.content.resources.map(adaptResourceContent),
    },
  };
};

export const adaptFolders = (folders: StructuredFolderRecord) => {
  const adaptedFolders: StructuredFolderRecord = {};
  Object.entries(folders).forEach(([folderId, folder]) => {
    adaptedFolders[folderId] = {
      ...folder,
      mirrorRecord: Object.fromEntries(
        Object.values(folder.mirrorRecord).map(mirror => [
          mirror.mirrorId,
          {
            ...mirror,
            mirrorFile: adaptMirrorFile(mirror.mirrorFile),
          },
        ]),
      ),
    };
  });
  return adaptedFolders;
};
