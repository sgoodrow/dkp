import { Metadata, ResolvingMetadata } from "next";

export const generateMetadataTitle = async (
  title: string,
  parent: ResolvingMetadata,
): Promise<Metadata> => {
  const titles: string[] = [title];

  const { title: parentTitle } = await parent;
  if (parentTitle?.absolute) {
    titles.push(parentTitle.absolute);
  }

  return {
    title: titles.join(" | "),
  };
};
