import { Typography, Stack } from "@mui/material";
import StaticPageLayout from "./StaticPageLayout";
import InfoBox from "../../components/common/InfoBox";

export default function ContactUs() {
  return (
    <StaticPageLayout
      title="Let’s Keep in Touch!"
    >
      <Stack spacing={2}>
        <Typography>
          Got a question, a bug to report, or just want to say hi?
        </Typography>
        <InfoBox>
          <Typography><b>Email:</b> support@taleverse.com</Typography>
          <Typography><b>Response Time:</b> Within 24 hours</Typography>
          <Typography><b>Socials:</b> @TaleVerseOfficial</Typography>
          <Typography><b>HQ:</b> Ho Chi Minh City, Vietnam</Typography>
        </InfoBox>
      </Stack>
    </StaticPageLayout>
  );
}
