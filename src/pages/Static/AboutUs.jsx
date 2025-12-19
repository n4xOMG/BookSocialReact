import { Typography, Stack, Box } from "@mui/material";
import StaticPageLayout from "./StaticPageLayout";
import InfoBox from "../../components/common/InfoBox";

export default function AboutUs() {
  return (
    <StaticPageLayout
      title="TaleVerse – Where Every Story Finds Its Universe."
      subtitle="A boundless storytelling ecosystem"
    >
      <Typography paragraph sx={{ textAlign: "left" }}>
        Welcome to TaleVerse. Our name is a fusion of <b>"Tale"</b> and <b>"Verse"</b>, representing our vision of a boundless storytelling universe. We are more than just a reading app; we are a unified ecosystem where every narrative voice is connected and every story resides.
      </Typography>

      <Typography paragraph sx={{ textAlign: "left" }}>
        At TaleVerse, we believe that everyone has a world inside them waiting to be explored. Our mission is built on three pillars:
      </Typography>

      <Stack spacing={3} sx={{ my: 4 }}>
        <InfoBox
            sx={{
              display: "grid",
              gridTemplateColumns: "50px 1fr",
              columnGap: 6,
              alignItems: "start",
            }}
        >
          <Typography variant="h6" fontWeight={600}>📖 Read</Typography>
          <Typography sx={{ textAlign: "left" }}>Dive into a diverse ocean of knowledge and emotions from global creators.</Typography>
        </InfoBox>

        <InfoBox
          sx={{
            display: "grid",
            gridTemplateColumns: "50px 1fr",
            columnGap: 6,
            alignItems: "start",
          }}
        >
          <Typography variant="h6" fontWeight={600}>✍️ Write</Typography>
          <Typography sx={{ textAlign: "left" }}>Empower your creativity with seamless tools to publish your own chapters.</Typography>
        </InfoBox>

        <InfoBox
          sx={{
            display: "grid",
            gridTemplateColumns: "50px 1fr",
            columnGap: 6,
            alignItems: "start",
          }}
        >
          <Typography variant="h6" fontWeight={600}>🤝 Connect</Typography>
          <Typography sx={{ textAlign: "left" }}>Build a community where the line between author and reader fades, replaced by meaningful interaction.</Typography>
        </InfoBox>
      </Stack>

      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ textAlign: "left" }}>
        🌌 Our Vision
      </Typography>
      <Typography sx={{ textAlign: "left" }}>
        To become the ultimate home for literature in the digital age, fostering a sustainable and inspiring environment for book lovers everywhere.
      </Typography>
    </StaticPageLayout>
  );
}
