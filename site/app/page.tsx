import { LandingPage } from "@/components/landing/landing-page";
import { resolveTagline } from "@/lib/tagline";

type HomeProps = {
  searchParams: Promise<{ t?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const tagline = resolveTagline(params.t);
  const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim() ?? "";
  return (
    <LandingPage tagline={tagline} web3formsAccessKey={web3formsAccessKey} />
  );
}
