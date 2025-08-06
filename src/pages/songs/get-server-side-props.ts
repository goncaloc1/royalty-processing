import { DashboardEntry, isDashboardEntry } from "@/types/songs";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await fetch("http://localhost:3000/api/songs");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data: result } = await response.json();

    const data: DashboardEntry[] = result.map((o: unknown) => {
      if (!isDashboardEntry(o)) {
        throw new Error("Invalid dashboard entry");
      }
      return o;
    });

    return {
      props: {
        data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};
