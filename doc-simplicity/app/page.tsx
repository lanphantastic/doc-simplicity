import FeatureItem from "@/components/FeatureItem";
import { Button } from "@/components/ui/button";
import { features } from "@/mockData/features";
import Image from "next/image";
import Link from "next/link";

const Header = () => (
  <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
    <div className="mx-auto max-w-2xl sm:text-center">
      <h2 className="text-base font-semibold leading-7 text-indigo-600">
        Your Interactive Document Companion
      </h2>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Transform Your PDFs into Interactive Conversations
      </p>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Introducing{" "}
        <span className="font-bold text-indigo-600">Chat with PDF</span>
        <br />
        <br /> Upload your document, and our chatbot will answer questions,
        summarize content, and answer all your questions. Ideal for everyone,{" "}
        <span className="text-indigo-600">Chat with PDF</span> turns static
        documents into <span className="font-bold">dynamic conversations</span>,
        enhancing productivity 10x fold effortlessly.
      </p>
    </div>
    <Button asChild className="mt-10">
      <Link href="/dashboard">Get Started</Link>
    </Button>
  </div>
);

const ScreenshotSection = () => (
  <div className="relative overflow-hidden pt-16">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <Image
        alt="Screenshot of the app interface"
        src="https://i.imgur.com/VciRSTI.jpeg"
        width={2432}
        height={1442}
        className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
      />
      <div aria-hidden="true" className="relative">
        <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
      </div>
    </div>
  </div>
);

const FeaturesSection = () => (
  <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
    <dl className="mx-auto grid max-w-2xl grid-cols-2 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
      {features.map((feature) => (
        <FeatureItem key={feature.name} feature={feature} />
      ))}
    </dl>
  </div>
);

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <Header />
        <ScreenshotSection />
        <FeaturesSection />
      </div>
    </main>
  );
}
