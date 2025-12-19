import { Typography, Stack } from "@mui/material";
import StaticPageLayout from "./StaticPageLayout";
import InfoBox from "../../components/common/InfoBox";

export default function TermsOfUse() {
  return (
    <StaticPageLayout
      title="Community Standards for a Better Universe"
    >
      <Stack spacing={2}>
        <InfoBox
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            textAlign: "left",
          }}
        >
          <Typography>• Be Responsible: You own what you post. No hate speech, no illegal content, and no "trolling."</Typography>
          <Typography>• Respect Copyright: Don't pirate. Respect the hard work of authors by not distributing their content without permission.</Typography>
          <Typography>• Vibe Check: Keep the community toxic-free. We reserve the right to suspend accounts that harass others or spam the platform.</Typography>
          <Typography>• Transactions: All in-app purchases are voluntary and governed by our transparent refund policy.</Typography>
        </InfoBox>
      </Stack>
    </StaticPageLayout>
  );
}
