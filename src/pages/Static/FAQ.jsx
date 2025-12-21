import { Typography, Stack } from "@mui/material";
import StaticPageLayout from "./StaticPageLayout";
import InfoBox from "../../components/common/InfoBox.jsx"

const QA = ({ q, a }) => (
  <InfoBox>
    <Typography
      fontWeight={600}
      sx={{ mb: 0.5, fontSize: "1.05rem", textAlign: "left", }}
    >
      ❓ {q}
    </Typography>

    <Typography color="text.secondary" sx={{ textAlign: "left" }}> 
      {a}
    </Typography>
  </InfoBox>
);

export default function FAQ() {
  return (
    <StaticPageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know before diving into the TaleVerse universe"
    >
      <Stack spacing={3}>
        <QA
          q="Is TaleVerse free to use?"
          a="Absolutely! You can join, read, and share stories for free. We also offer premium content and Support Author features for those who want to go the extra mile for their favorite creators."
        />

        <QA
          q="How do I start my journey as an author?"
          a="It’s simple! Head to your profile, hit the Create button, and start crafting your masterpiece. Your audience is waiting!"
        />

        <QA
          q="Can I read offline?"
          a="Yes! You can save books to your Library to enjoy your favorite tales anytime, anywhere—no Wi-Fi needed."
        />

        <QA
          q="What about my story’s copyright?"
          a="You own your words. Period. TaleVerse is just the stage; the intellectual property remains yours. We provide reporting tools to help you protect your work from unauthorized use."
        />
      </Stack>
    </StaticPageLayout>
  );
}
