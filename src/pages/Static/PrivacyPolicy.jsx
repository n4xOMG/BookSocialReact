import { Typography, Stack } from "@mui/material";
import StaticPageLayout from "./StaticPageLayout";
import InfoBox from "../../components/common/InfoBox";

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Your Privacy, Your Verse."
    >
      <Stack spacing={3}>
        <Typography>
          At TaleVerse, we respect your personal space. We collect basic info (like email) to set up your account and reading habits to suggest books you’ll actually love.
        </Typography>

        <InfoBox>
          <Typography>
            <b>Data Usage:</b> We use your data to improve your experience, notify you of updates, and keep the universe secure.
          </Typography>
        </InfoBox>
        <InfoBox>
          <Typography>
            <b>No Selling:</b> We NEVER sell your personal data to third parties. Your trust is our most valuable asset.
          </Typography>
        </InfoBox>  
        <InfoBox>
          <Typography>
            <b>Control:</b> You have full control over your data. You can edit, download, or delete your information at any time through your settings.
          </Typography>
        </InfoBox>
      </Stack>
    </StaticPageLayout>
  );
}
