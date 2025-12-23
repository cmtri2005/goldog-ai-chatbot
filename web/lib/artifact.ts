const realEstateArtifact = {
  kind: "realEstate"
};

export const artifactDefinitions = [realEstateArtifact];
export type ArtifactKind = (typeof artifactDefinitions)[number]["kind"];
