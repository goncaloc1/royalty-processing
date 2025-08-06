import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const ErrorPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold">Oops! Something went wrong.</h1>

      <Image
        src="https://media.tenor.com/vhY5yLMC9PAAAAAj/milk-and.gif"
        alt="Error animation"
        width={192}
        height={192}
        className="mb-10 rounded-lg"
        unoptimized
      />

      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white no-underline rounded text-base font-medium transition-colors"
        >
          {"Let's try again!"}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
