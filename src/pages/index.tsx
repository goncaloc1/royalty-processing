import { GetServerSideProps } from "next";

export default function Home() {
  // This component will never render because of the redirect
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/songs",
      permanent: false,
    },
  };
};
